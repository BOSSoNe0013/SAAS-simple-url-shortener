# Dockerfile for Frontend
# Use Node 22 for build
FROM node:22-alpine AS build
WORKDIR /usr/src/app
# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001
# Install dependencies
COPY package*.json ./
COPY ./src/front/package*.json ./src/front/
ENV NODE_ENV=production
RUN npm i --only=production
# Copy source
COPY . .
# Build application
RUN npm run build:frontend
USER nestjs
# Production image
FROM nginx:stable-alpine
COPY --from=build --chown=nginx:nginx /usr/src/app/src/front/dist /usr/share/nginx/html
COPY ./src/front/nginx.conf /etc/nginx/nginx.conf
# Expose port
EXPOSE 80
ENTRYPOINT ["nginx", "-c", "/etc/nginx/nginx.conf"]
CMD ["-g", "daemon off;"]
