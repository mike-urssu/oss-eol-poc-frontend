# 1단계: 타입 검사·빌드(정적 파일 생성). Jenkins 에이전트에는 Docker만 있으면 된다.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN node --experimental-strip-types src/lib/eol.check.ts && npm run build:app

# 2단계: 비root nginx(8080 포트)로 정적 파일 서비스
FROM nginxinc/nginx-unprivileged:1.27-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist-app /usr/share/nginx/html
EXPOSE 8080
