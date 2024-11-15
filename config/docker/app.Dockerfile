FROM ruby:3.1.4-slim as base

RUN apt-get update -qq && apt-get install -y build-essential apt-utils curl

WORKDIR /docker/app

RUN gem install bundler

COPY Gemfile* ./

RUN bundle install

# install node
COPY .node-version /tmp
RUN NODE_MAJOR=$(cat /tmp/.node-version | grep -ohE "^[[:digit:]]{1,2}") \
    && NODE_VERSION=$(cat /tmp/.node-version | tr -d ' ') \
    && curl -o /tmp/nodejs.deb https://deb.nodesource.com/node_${NODE_MAJOR}.x/pool/main/n/nodejs/nodejs_${NODE_VERSION}-1nodesource1_amd64.deb \
  ; apt-get install -y /tmp/nodejs.deb \
  ; rm -rf /var/lib/apt/lists/*
RUN npm install yarn -g

COPY package.json ./
COPY yarn.lock ./
COPY node_modules ./

RUN yarn install


CMD ["bin/rails", "s", "-b", "0.0.0.0"]
