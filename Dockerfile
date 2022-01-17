# Build docker
# docker build . -t dn-ms-notification --no-cache
FROM node:16-alpine
RUN  apk add git curl

ENV AUTH_REDIS_URL=redis://localhost:6379
ENV REDIS_TTL=86400
ENV JWT_SECRET=DN-MS-APP-!@#=-0
ENV JWT_EXPIRESIN=86400
ENV DB_HOST=localhost
ENV DB_HOST=3306
ENV DB_NAME=ms_notification
ENV DB_USER=root
ENV DB_PASSWORD=123456

WORKDIR /app

COPY ./package-docker.json ./package.json
COPY ./dist ./dist

RUN npm install --production=true
RUN npm prune --production

EXPOSE 8300

# CMD exec /bin/sh -c "trap : TERM INT; sleep 9999999999d & wait"

CMD [ "node", "dist/main.js" ]
