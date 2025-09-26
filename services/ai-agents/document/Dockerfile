# Multi-stage build for Document Agent
FROM node:18-alpine AS builder

# Install system dependencies for document processing
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    tesseract-ocr \
    tesseract-ocr-data-eng \
    graphicsmagick \
    imagemagick \
    poppler-utils \
    libreoffice

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Production stage
FROM node:18-alpine AS production

# Install system dependencies for document processing
RUN apk add --no-cache \
    python3 \
    tesseract-ocr \
    tesseract-ocr-data-eng \
    graphicsmagick \
    imagemagick \
    poppler-utils \
    libreoffice \
    dumb-init

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S document -u 1001

# Copy package files
COPY package*.json ./

# Copy dependencies from builder stage
COPY --from=builder --chown=document:nodejs /app/node_modules ./node_modules

# Copy source code
COPY --chown=document:nodejs src/ ./src/
COPY --chown=document:nodejs .env* ./

# Create necessary directories
RUN mkdir -p uploads temp logs data && \
    chown -R document:nodejs uploads temp logs data

# Switch to non-root user
USER document

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3015/api/v1/document/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Expose port
EXPOSE 3015

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "run", "start:prod"]
