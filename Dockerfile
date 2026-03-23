# -----------------------------------------------------------
# Base Image - Dependencies Stage
# -----------------------------------------------------------
FROM node:20-alpine AS deps

# Install git and other tools
RUN apk add --no-cache git

# Build arguments for repository
ARG REPO_URL
ARG BRANCH
ARG DATABASE_URL

# Debug
RUN echo "DEPS stage - Building from: $REPO_URL, branch: $BRANCH"

WORKDIR /app

# Install additional tools
RUN apk add --no-cache dumb-init bash dos2unix curl ca-certificates wget && \
    update-ca-certificates

# ❌ REMOVE THIS - no package.json here yet
# RUN npm ci --retry 5 --fetch-retries=5 --fetch-timeout=60000 --include=dev

# -----------------------------------------------------------
# Builder Stage - Clone and Build (Universal)
# -----------------------------------------------------------
FROM node:20-alpine AS builder

# Redeclare ARG in this stage
ARG REPO_URL
ARG BRANCH
ARG DATABASE_URL

# Install git, bash, curl (pnpm and yarn are already in the image)
RUN apk add --no-cache git bash curl

# Debug
RUN echo "========== DEBUG =========="
RUN echo "REPO_URL: $REPO_URL"
RUN echo "BRANCH: $BRANCH"
RUN echo "==========================="

# Clone the repository (this gets ALL source files)
RUN git clone --depth 1 --branch $BRANCH $REPO_URL /app

WORKDIR /app

# Set environment variable for database
ENV DATABASE_URL=$DATABASE_URL

# Install ONLY production dependencies (faster, smaller)
RUN npm ci --omit=dev

# Make the detection script executable (if it exists in the cloned repo)
RUN if [ -f scripts/detect-and-build.sh ]; then \
        chmod +x scripts/detect-and-build.sh; \
    fi

# Run the universal build script
RUN if [ -f scripts/detect-and-build.sh ]; then \
        echo "📜 Using detect-and-build.sh from repository"; \
        ./scripts/detect-and-build.sh; \
    else \
        echo "📜 No detect-and-build.sh found, using inline detection"; \
        echo "🔍 Detecting project type..."; \
        \
        # Check package manager
        if [ -f "yarn.lock" ]; then \
            yarn install --frozen-lockfile --production; \
        elif [ -f "pnpm-lock.yaml" ]; then \
            pnpm install --frozen-lockfile --prod; \
        else \
            npm ci --omit=dev; \
        fi; \
        \
        # Generate Prisma client if schema exists
        if [ -f "prisma/schema.prisma" ]; then \
            npx prisma generate 2>/dev/null || true; \
        fi; \
        \
        # Build based on framework
        if [ -f "next.config.js" ] || [ -f "next.config.ts" ]; then \
            echo "🏗️ Building Next.js app..."; \
            npm run build; \
        elif [ -f "vite.config.js" ] || [ -f "vite.config.ts" ]; then \
            echo "🏗️ Building Vite app..."; \
            npm run build; \
        elif npm run 2>/dev/null | grep -q "build"; then \
            echo "🏗️ Running build script..."; \
            npm run build; \
        else \
            echo "⚠️ No build script found"; \
        fi; \
    fi

# -----------------------------------------------------------
# Test Stage - Includes Dev Dependencies
# -----------------------------------------------------------
FROM node:20-alpine AS test

ARG REPO_URL
ARG BRANCH
ARG DATABASE_URL

RUN apk add --no-cache git bash curl

RUN git clone --depth 1 --branch $BRANCH $REPO_URL /app

WORKDIR /app

ENV DATABASE_URL=$DATABASE_URL

# Install ALL dependencies (including dev)
RUN npm ci --include=dev

# Generate Prisma client if schema exists
RUN if [ -f prisma/schema.prisma ]; then \
        npx prisma generate; \
    fi

# ✅ NO extra COPY commands - use the repo's own files

# Tests will run in this stage
CMD ["npm", "test"]

# -----------------------------------------------------------
# Production Stage - Runner (Universal)
# -----------------------------------------------------------
FROM node:20-alpine AS runner

# Install runtime dependencies
RUN apk add --no-cache dumb-init curl bash dos2unix

# Redeclare ARG for this stage
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from builder
COPY --from=builder --chown=nextjs:nodejs /app /app

# Make scripts executable (if they exist)
RUN if [ -f scripts/detect-and-build.sh ]; then \
        chmod +x scripts/detect-and-build.sh; \
    fi && \
    if [ -f scripts/validate-logs.sh ]; then \
        dos2unix scripts/validate-logs.sh 2>/dev/null || true && \
        chmod +x scripts/validate-logs.sh; \
    fi

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

# Use dumb-init as init process
ENTRYPOINT ["dumb-init", "--"]

# Switch to non-root user
USER nextjs

# Universal start command
CMD ["sh", "-c", "\
    if [ -f scripts/detect-and-build.sh ]; then \
        echo '📜 Starting with detect-and-build.sh...'; \
        ./scripts/detect-and-build.sh; \
    else \
        echo '📜 No detect-and-build.sh, using inline start detection...'; \
        if [ -f next.config.js ]; then \
            echo '🚀 Starting Next.js...'; \
            exec npm start; \
        elif [ -f vite.config.js ]; then \
            if npm run 2>/dev/null | grep -q preview; then \
                echo '🚀 Starting Vite preview...'; \
                exec npm run preview; \
            else \
                echo '🚀 Starting with npm start...'; \
                exec npm start; \
            fi; \
        elif npm run 2>/dev/null | grep -q start; then \
            echo '🚀 Starting with npm start...'; \
            exec npm start; \
        elif [ -f server.js ]; then \
            echo '🚀 Starting with node server.js...'; \
            exec node server.js; \
        else \
            echo '❌ No start command found'; \
            exit 1; \
        fi; \
    fi"]