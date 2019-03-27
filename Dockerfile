# TODO: improve the whole file and build/test logic
ARG run="build"

# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY . .

RUN ls
RUN if [ "$run" = "build" ] ; then RUN yarn run build; else yarn run test:unit; fi

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
