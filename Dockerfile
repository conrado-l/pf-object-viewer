# build stage
FROM node:lts-alpine as build-stage

# Create app directory
WORKDIR /app

RUN yarn install

# Copy data
COPY . .

# Give execution permission
RUN chmod +x docker-entrypoint.sh

# Use docker-entrypoint as entrypoint
ENTRYPOINT ["./docker-entrypoint.sh"]

# Expose the port
EXPOSE 8080
