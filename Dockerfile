FROM node:6-alpine
MAINTAINER Lyndon <snakeliwei@gmail.com>

RUN apk --update --no-cache add make git \
    && mkdir -p /app \
    && mkdir -p /build 

COPY . /app
WORKDIR /app
RUN npm install && \
    npm run build && \
    mv ./docker-entrypoint.sh / && \
    cp -rf ./dist /dist && \
    echo "$(git log -1 --pretty=format:"%h - %an, %ar: %s")" > /dist/version && \
    rm -rf /app && \
    chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
