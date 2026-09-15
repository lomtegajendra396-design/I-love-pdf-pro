# Multi-stage production build for PDF Tools Pro
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy application sources
COPY . .

# Build Vite frontend and bundle Express server into dist/server.cjs
RUN npm run build

# Production Runner Stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled frontend & server from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Expose container port (Cloud Run defaults to 8080 or process.env.PORT)
EXPOSE 8080

# Run the bundled production server
CMD ["node", "dist/server.cjs"]
