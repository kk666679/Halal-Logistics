# Multi-stage Docker build for Risk Assessment Agent

# Build stage
FROM node:18-alpine AS builder

# Install system dependencies for native modules
RUN apk add --no-cache python3 make g++ git

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Production stage
FROM node:18-alpine AS production

# Install system dependencies for runtime
RUN apk add --no-cache dumb-init curl

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S riskuser -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy dependencies from builder stage
COPY --from=builder --chown=riskuser:nodejs /app/node_modules ./node_modules

# Copy source code
COPY --chown=riskuser:nodejs src/ ./src/
COPY --chown=riskuser:nodejs dist/ ./dist/

# Create necessary directories with proper permissions
RUN mkdir -p logs temp uploads && \
    chown -R riskuser:nodejs /app

# Switch to non-root user
USER riskuser

# Expose port
EXPOSE 3016

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3016/api/v1/risk/health || exit 1

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "run", "start:prod"]
