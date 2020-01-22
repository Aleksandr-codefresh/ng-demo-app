
###################### stage 1 ##############################
FROM node:10.16.0-alpine

RUN apk update && apk upgrade && apk add --no-cache bash git openssh

RUN mkdir -p /app
WORKDIR /app

# cache dependencies layer
COPY . .
RUN yarn install
RUN yarn build
