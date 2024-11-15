FROM node:18.20.4-slim as base

RUN apt-get update -qq && apt-get install -y build-essential apt-utils

WORKDIR /docker/app

COPY package.json ./package.json
COPY yarn.lock ./yarn.lock
COPY node_modules ./

RUN yarn install

COPY config/docker/vite.entrypoint.sh ./config/docker/vite.entrypoint.sh

RUN chmod +x config/docker/vite.entrypoint.sh

CMD ["bash", "./config/docker/vite.entrypoint.sh"]
