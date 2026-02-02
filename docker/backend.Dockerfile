# Backend Dockerfile
# Build stage ----------------
FROM node:22-alpine AS builder
WORKDIR /usr/src/app
# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001
# Install dependencies for all workspaces (backend included)
COPY package*.json ./
COPY src/app/package*.json ./src/app/
ENV NODE_ENV=production
RUN npm ci --only=production
# Copy the entire source tree
COPY . .
# Build the Nest backend
RUN npm run build:backend
USER nestjs

# Runtime stage -----------------
FROM node:22-alpine AS runtime
WORKDIR /usr/src/app
# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001
# Copy compiled backend and node_modules (retain ownership)
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/src/app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /usr/src/app/node_modules ./node_modules
# Switch to non-root user
USER nestjs
EXPOSE 5601
CMD ["node", "dist/main.js"]
