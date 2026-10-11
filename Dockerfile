# 1단계: 타입 검사·빌드(정적 파일 생성). Jenkins 에이전트에는 Docker만 있으면 된다.
# 결과물이 플랫폼과 무관한 정적 파일이라 에이전트 플랫폼($BUILDPLATFORM)에서 돌려 에뮬레이션을 피한다.
FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN node --experimental-strip-types src/lib/eol.check.ts && npm run build:app

# 2단계: 비root nginx(8080 포트)로 정적 파일 서비스. 운영 서버에 맞춰 linux/arm64로 빌드한다(Jenkinsfile).
FROM nginxinc/nginx-unprivileged:1.27-alpine
# 운영 서버에서 이 프로젝트 이미지만 골라 정리(docker image prune --filter label=...)하기 위한 라벨. 백엔드와 같은 값.
LABEL cloud.jjoon.project=oss-eol-poc
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist-app /usr/share/nginx/html
EXPOSE 8080
