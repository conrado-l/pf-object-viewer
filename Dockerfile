# TODO: improve the whole file and build/test logic
ARG run="serve"

# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package.json ./
RUN yarn cache clean
RUN yarn install --verbose
COPY . .

RUN if [ "$run" = "test" ] ; then yarn run test:unit; else yarn run serve; fi
EXPOSE 8080
