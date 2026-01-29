# 빌드 스테이지 - 내부망 레지스트리 사용
# 내부망 레지스트리 주소로 변경 필요 (예: registry.internal:5000/node:18-alpine)
FROM node:18-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (내부망에서는 npm 레지스트리 설정 필요 시 추가)
RUN npm ci --only=production=false

# 소스 코드 복사
COPY . .

# prebuild 스크립트 실행 (notices index 생성)
RUN npm run prebuild

# 환경 변수 설정 (빌드 시 필요)
# 주의: 실제 배포 시에는 --build-arg로 전달하거나 .env 파일 사용
ARG REACT_APP_NAVER_CLIENT_ID
ARG REACT_APP_API_URL

ENV REACT_APP_NAVER_CLIENT_ID=$REACT_APP_NAVER_CLIENT_ID
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# 프로덕션 빌드
RUN CI=false npm run build

# 프로덕션 스테이지 - 내부망 레지스트리 사용
# 내부망 레지스트리 주소로 변경 필요 (예: registry.internal:5000/nginx:alpine)
FROM nginx:alpine

# 빌드된 파일을 nginx 서빙 디렉토리로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# Nginx 설정 파일 복사 (프론트엔드 단독 서빙용)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]

