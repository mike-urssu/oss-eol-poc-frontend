// 운영 배포 파이프라인: 이미지 빌드(타입 검사·빌드 포함) → push → (승인) → SSH로 서버에 배포 → 응답 확인
// 처음 설정 방법은 deploy/README.md 참고. 백엔드(oss-eol-poc-backend)와 같은 credentials·환경 변수를 쓴다.
// Jenkins 시스템 환경 변수 DEPLOY_HOST(운영 서버 user@host), DEPLOY_PORT(SSH 포트)를 사용한다.
pipeline {
    agent any

    environment {
        REGISTRY          = 'ghcr.io'                       // GitHub Container Registry
        IMAGE             = "${REGISTRY}/mike-urssu/oss-eol-poc-frontend"
        REGISTRY_CRED     = 'ghcr-credentials'              // Username with password: GitHub 사용자명 + PAT(write:packages)
        DEPLOY_SSH_CRED   = 'deploy-ssh-key'                // SSH Username with private key: 운영 서버 배포 계정의 개인키
        DEPLOY_DIR        = '/opt/projects/oss-eol-poc/frontend'
        APP_URL           = 'https://oss-poc.jjoon.cloud'
    }

    options {
        disableConcurrentBuilds()
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Build image') {
            // Dockerfile 1단계에서 npm ci, 타입 검사, 날짜 로직 self-check, 운영 빌드를 수행한다.
            steps {
                script {
                    env.IMAGE_TAG = env.GIT_COMMIT.take(8)
                }
                sh 'docker build --platform linux/amd64 -t "$IMAGE:$IMAGE_TAG" .'
            }
        }

        stage('Push image') {
            steps {
                withCredentials([usernamePassword(credentialsId: env.REGISTRY_CRED, usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
                    sh '''
                        echo "$REG_PASS" | docker login "$REGISTRY" -u "$REG_USER" --password-stdin
                        docker push "$IMAGE:$IMAGE_TAG"
                    '''
                }
            }
            post {
                always {
                    sh 'docker logout "$REGISTRY" || true'
                }
            }
        }

        stage('Approve') {
            steps {
                timeout(time: 30, unit: 'MINUTES') {
                    input message: "운영 서버에 프런트엔드 ${env.IMAGE_TAG}을(를) 배포할까요?", ok: '배포'
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
    }

    post {
        always {
            // 에이전트에 이미지가 쌓이지 않게 정리한다.
            sh 'if [ -n "$IMAGE_TAG" ]; then docker image rm "$IMAGE:$IMAGE_TAG" || true; fi'
        }
    }
}
