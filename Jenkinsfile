// 운영 배포 파이프라인: 이미지 빌드(타입 검사·빌드 포함) → push → SSH로 서버에 배포 → 응답 확인 → GHCR 오래된 이미지 정리
// 처음 설정 방법은 deploy/README.md 참고. 백엔드(oss-eol-poc-backend)와 같은 credentials·환경 변수를 쓴다.
// Jenkins 시스템 환경 변수 DEPLOY_HOST(운영 서버 user@host), DEPLOY_PORT(SSH 포트)를 사용한다.
pipeline {
    agent any

    environment {
        REGISTRY          = 'ghcr.io'                       // GitHub Container Registry
        IMAGE             = "${REGISTRY}/mike-urssu/oss-eol-poc-frontend"
        REGISTRY_CRED     = 'ghcr-credentials'              // Username with password: GitHub 사용자명 + PAT(write:packages, delete:packages)
        DEPLOY_SSH_CRED   = 'deploy-ssh-key'                // SSH Username with private key: 운영 서버 배포 계정의 개인키
        DEPLOY_DIR        = '/opt/projects/oss-eol-poc/frontend'
        APP_URL           = 'https://oss-eol.jjoon.cloud'
        GHCR_PACKAGE      = 'oss-eol-poc-frontend'
        KEEP_IMAGES       = '10'                            // GHCR에 남길 최신 이미지 수
    }

    options {
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Build image') {
            // Dockerfile 1단계에서 npm ci, 타입 검사, 날짜 로직 self-check, 운영 빌드를 수행한다.
            // 운영 서버가 ARM64다. 빌드 단계는 에이전트 플랫폼에서 돌고, 최종 nginx 이미지만 arm64로 만든다.
            steps {
                script {
                    env.IMAGE_TAG = env.GIT_COMMIT.take(8)
                }
                sh 'docker build --platform linux/arm64 -t "$IMAGE:$IMAGE_TAG" .'
            }
        }

        stage('Push image') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.REGISTRY_CRED, usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
                    // macOS 에이전트의 Docker Desktop은 로그인 정보를 키체인(credsStore)에 저장하려다 실패한다(Keychain Error -61).
                    // 빌드마다 임시 DOCKER_CONFIG에 로그인하고 끝나면 지운다. 임시 설정엔 현재 context가 없으니 DOCKER_HOST로 데몬 소켓을 넘긴다.
                    // config.json이 비어 있으면 CLI가 osxkeychain을 기본 저장소로 고르므로, auths 항목을 미리 넣어 파일에 저장되게 한다.
                    sh '''
                        export DOCKER_HOST="$(docker context inspect --format '{{.Endpoints.docker.Host}}')"
                        export DOCKER_CONFIG="$(mktemp -d)"
                        trap 'rm -rf "$DOCKER_CONFIG"' EXIT
                        printf '{"auths":{"%s":{}}}' "$REGISTRY" > "$DOCKER_CONFIG/config.json"
                        echo "$REG_PASS" | docker login "$REGISTRY" -u "$REG_USER" --password-stdin
                        docker push "$IMAGE:$IMAGE_TAG"
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: env.DEPLOY_SSH_CRED, keyFileVariable: 'SSH_KEY')]) {
                    sh '''
                        SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=accept-new"
                        ssh $SSH_OPTS -p "$DEPLOY_PORT" "$DEPLOY_HOST" "mkdir -p '$DEPLOY_DIR'"
                        scp $SSH_OPTS -P "$DEPLOY_PORT" deploy/compose.yml "$DEPLOY_HOST:$DEPLOY_DIR/compose.yml"
                        ssh $SSH_OPTS -p "$DEPLOY_PORT" "$DEPLOY_HOST" "
                            set -e
                            cd '$DEPLOY_DIR'
                            printf 'IMAGE=%s\\nIMAGE_TAG=%s\\n' '$IMAGE' '$IMAGE_TAG' > image.env
                            docker compose --env-file image.env pull
                            docker compose --env-file image.env up -d
                            # 이 프로젝트 라벨이 붙은 이미지 중 컨테이너가 쓰지 않는 것만 지운다(다른 프로젝트 이미지는 건드리지 않음).
                            docker image prune -af --filter label=cloud.jjoon.project=oss-eol-poc
                        "
                    '''
                }
            }
        }

        stage('Verify') {
            steps {
                sh 'curl -fsS --retry 10 --retry-delay 3 --retry-all-errors "$APP_URL/" > /dev/null'
            }
        }

        stage('Clean up registry') {
            // GHCR에서 최신 KEEP_IMAGES개만 남긴다. 정리에 실패해도 배포는 성공으로 둔다.
            // 에이전트에 Node가 없어도 되게 node 컨테이너에서 deploy/ghcr-cleanup.mjs를 돌린다.
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    withCredentials([usernamePassword(credentialsId: env.REGISTRY_CRED, usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
                        sh 'docker run --rm -e GHCR_PACKAGE -e REG_PASS -e KEEP_IMAGES -v "$PWD/deploy:/deploy:ro" node:22-alpine node /deploy/ghcr-cleanup.mjs'
                    }
                }
            }
        }
    }

    post {
        always {
            // 에이전트에 이미지가 쌓이지 않게 정리한다.
            sh 'if [ -n "$IMAGE_TAG" ]; then docker image rm "$IMAGE:$IMAGE_TAG" || true; fi'
        }
    }
}
