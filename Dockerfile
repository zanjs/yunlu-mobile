FROM node:6-alpine
MAINTAINER Lyndon <snakeliwei@gmail.com>

RUN apk --update --no-cache add make git \
    && mkdir -p /app \
    && mkdir -p /build

COPY . /app
WORKDIR /app
RUN npm install && \
    chmod +x /app/docker-entrypoint.sh

ENTRYPOINT ["/app/docker-entrypoint.sh"]
