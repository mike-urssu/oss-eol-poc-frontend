# 운영 배포 (Jenkins)

`main` 브랜치를 Jenkins가 Docker 이미지(nginx + 정적 파일)로 빌드해 운영 서버에 배포하고, Traefik을 통해 `https://oss-eol.jjoon.cloud`로 서비스한다. 백엔드(`oss-eol-poc-backend`, `https://oss-eol-api.jjoon.cloud`)와 같은 서버·Jenkins credentials·배포 방식을 쓴다.

```
GitHub ──webhook──▶ Jenkins: Build image → Push(ghcr.io) → Deploy(SSH) → Verify → Clean up registry
                                              │                         │
                                       ghcr.io ◀─────────────── pull ── 운영 서버 (docker compose)

 브라우저 ──▶ Traefik ──(proxy)──▶ web(nginx)      oss-eol.jjoon.cloud
          └─▶ Traefik ──(proxy)──▶ 백엔드 app       oss-eol-api.jjoon.cloud (CORS)
```

| 파일 | 역할 |
|------|------|
| `Jenkinsfile` | 파이프라인. 백엔드와 같은 credentials(`ghcr-credentials`, `deploy-ssh-key`)와 시스템 환경 변수(`DEPLOY_HOST`, `DEPLOY_PORT`)를 쓴다. |
| `Dockerfile` | 1단계에서 `npm ci`·타입 검사·self-check·운영 빌드, 2단계에서 비root nginx(8080)로 서비스. 운영 서버에 맞춘 linux/arm64(빌드 단계는 에이전트 플랫폼에서 돌아 에뮬레이션이 필요 없다). |
| `.env.production` | 운영 빌드에 들어가는 백엔드 주소(`VITE_API_BASE_URL`). 비밀값이 아니다. |
| `deploy/nginx.conf` | SPA 서비스, 캐시(`index.html` no-cache, `/assets/` 1년), 보안 헤더. |
| `deploy/compose.yml` | 운영 서버에서 실행할 서비스 정의. 배포 때마다 Jenkins가 복사한다. |
| `deploy/ghcr-cleanup.mjs` | GHCR에 최신 이미지 10개만 남기는 정리 스크립트(백엔드 `ghcrCleanup` 태스크와 같은 동작). |

## 처음 한 번 설정

백엔드 배포가 이미 동작한다면 Jenkins credentials·환경 변수, 서버의 배포 계정·GHCR 로그인·`proxy` 네트워크는 그대로 쓴다. 추가로 필요한 것만 적는다.

1. **DNS**: `oss-eol.jjoon.cloud`가 운영 서버를 가리키게 한다.
2. **백엔드 CORS**: 운영 서버 백엔드 `app.env`에 `EOL_CORS_ALLOWED_ORIGINS=https://oss-eol.jjoon.cloud`가 있어야 한다(백엔드 `deploy/app.env.example` 기본값). 바꿨다면 백엔드를 재기동한다.
3. **GHCR 패키지**: `ghcr-credentials`의 PAT는 classic PAT(`write:packages`, `delete:packages`)여야 한다(백엔드와 같은 요구사항). 첫 push 후 `ghcr.io/mike-urssu/oss-eol-poc-frontend`가 private으로 만들어진다. 운영 서버 배포 계정은 백엔드 때 `docker login ghcr.io`를 했으므로 그대로 pull할 수 있다(같은 계정 소유 패키지).
4. **Jenkins**
   - 빌드 에이전트 요구사항: Docker(BuildKit), `ssh`/`scp`, `curl`. Node.js는 필요 없다(Docker 안에서 빌드).
   - Pipeline job 생성: "Pipeline script from SCM" → `https://github.com/mike-urssu/oss-eol-poc-frontend`, 브랜치 `main`, Script Path `Jenkinsfile`
   - GitHub 저장소에 Jenkins webhook(`https://<jenkins>/github-webhook/`)을 등록하거나 job에서 Poll SCM을 설정한다.

배포 디렉터리 `/opt/projects/oss-eol-poc/frontend`는 Jenkins가 처음 배포할 때 만든다(백엔드 배포 디렉터리 아래라 배포 계정에 권한이 있다).

## 로컬에서 이미지 확인
```bash
docker build -t oss-eol-poc-frontend:local .
docker run --rm -p 18080:8080 oss-eol-poc-frontend:local   # http://localhost:18080
```

## 배포
`main`에 push하면 빌드(타입 검사·self-check 포함)를 통과한 경우 **승인 없이 운영 서버까지 자동 배포**된다. 이미지 태그는 커밋 해시 앞 8자리다.

## 이미지 정리
- **GHCR**: 배포가 끝나면 `Clean up registry` 단계가 `deploy/ghcr-cleanup.mjs`로 이미지 버전을 생성일 기준으로 정렬해 최신 10개(`KEEP_IMAGES`)만 남기고 지운다. 정리에 실패해도 빌드는 성공으로 남고 해당 단계만 실패로 표시된다.
  삭제 대상만 미리 보려면: `DRY_RUN=true GHCR_PACKAGE=oss-eol-poc-frontend REG_PASS=<PAT> node deploy/ghcr-cleanup.mjs`
- **운영 서버**: 배포할 때 `docker image prune -af --filter label=cloud.jjoon.project=oss-eol-poc`로 이 프로젝트(백엔드 포함) 이미지 중 컨테이너가 쓰지 않는 것만 지운다.

## 롤백
GHCR에는 최신 10개만 남으므로 그보다 오래된 버전으로는 롤백할 수 없다.
```bash
cd /opt/projects/oss-eol-poc/frontend
sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=<이전 태그>/' image.env
docker compose --env-file image.env up -d
```

## 운영 확인
```bash
cd /opt/projects/oss-eol-poc/frontend
docker compose --env-file image.env ps
docker compose --env-file image.env logs -f web
curl -sI https://oss-eol.jjoon.cloud/
```
