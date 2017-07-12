FROM node:8-alpine
MAINTAINER Lyndon <snakeliwei@gmail.com>

RUN apk --update --no-cache add make git \
    && mkdir -p /app \
    && mkdir -p /build 

COPY . /app
WORKDIR /app
RUN yarn install && \
    npm run build && \
    mv ./docker-entrypoint.sh / && \
    cp -rf ./dist /dist && \
    echo "$(git rev-parse --short HEAD)($(git log -1 HEAD --pretty=format:%s))" > /dist/version && \
    rm -rf /app && \
    chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
