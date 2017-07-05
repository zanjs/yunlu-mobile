FROM node:8-alpine
MAINTAINER Lyndon <snakeliwei@gmail.com>

RUN apk --update --no-cache add make git \
    && mkdir -p /app \
    && mkdir -p /build \
    && mkdir -p /dist

COPY . /app
WORKDIR /app
RUN npm install && \
    npm run build && \
    mv ./docker-entrypoint.sh / && \
    cp -rf ./dist /dist && \
    rm -rf /app && \
    chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
