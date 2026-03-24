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

# -----------------------------------------------------------
# Builder Stage - Clone and Build (Universal)
# -----------------------------------------------------------
FROM node:20-alpine AS builder

# Redeclare ARG in this stage
ARG REPO_URL
ARG BRANCH
ARG DATABASE_URL

# Install git, bash, curl
RUN apk add --no-cache git bash curl

# Debug
RUN echo "========== DEBUG =========="
RUN echo "REPO_URL: $REPO_URL"
RUN echo "BRANCH: $BRANCH"
RUN echo "==========================="

# Clone the repository
RUN git clone --depth 1 --branch $BRANCH $REPO_URL /app

WORKDIR /app

# Set environment variable for database
ENV DATABASE_URL=$DATABASE_URL

# Install ALL dependencies (including dev) for building
RUN npm ci --include=dev

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
        if [ -f "yarn.lock" ]; then \
            yarn install --frozen-lockfile; \
        elif [ -f "pnpm-lock.yaml" ]; then \
            pnpm install --frozen-lockfile; \
        else \
            npm ci --include=dev; \
        fi; \
        \
        if [ -f "prisma/schema.prisma" ]; then \
            npx prisma generate 2>/dev/null || true; \
        fi; \
        \
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

# Clone the target repository
RUN git clone --depth 1 --branch $BRANCH $REPO_URL /app

WORKDIR /app

ENV DATABASE_URL=$DATABASE_URL

# Copy the universal script from build context
COPY scripts/detect-and-build.sh /tmp/detect-and-build.sh
RUN mkdir -p scripts && \
    cp /tmp/detect-and-build.sh scripts/detect-and-build.sh && \
    chmod +x scripts/detect-and-build.sh

# Install ALL dependencies (including dev)
RUN npm ci --include=dev

# Generate Prisma client if schema exists
RUN if [ -f prisma/schema.prisma ]; then \
        npx prisma generate; \
    fi

# Run the universal script
CMD ["./scripts/detect-and-build.sh"]

# -----------------------------------------------------------
# Production Stage - Runner (Universal)
# -----------------------------------------------------------
FROM node:20-alpine AS runner

RUN apk add --no-cache dumb-init curl bash dos2unix

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from builder
COPY --from=builder --chown=nextjs:nodejs /app /app

# Copy specific directories (no shell operators)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copy Next.js build if it exists
RUN if [ -d "/app/.next" ]; then \
        echo "📦 Copying Next.js build..."; \
        cp -r /app/.next ./.next; \
    fi

# Copy Vite build if it exists
RUN if [ -d "/app/dist" ]; then \
        echo "📦 Copying Vite build..."; \
        cp -r /app/dist ./dist; \
    fi

# Copy Prisma if it exists
RUN if [ -d "/app/prisma" ]; then \
        echo "📦 Copying Prisma schema..."; \
        cp -r /app/prisma ./prisma; \
    fi

# Copy optional config files (with same-file check)
RUN if [ -f "/app/prisma.config.ts" ] && [ ! -f "./prisma.config.ts" ]; then \
        echo "📄 Copying prisma.config.ts..."; \
        cp /app/prisma.config.ts ./prisma.config.ts; \
    fi

RUN if [ -f "/app/next.config.js" ] && [ ! -f "./next.config.js" ]; then \
        echo "📄 Copying next.config.js..."; \
        cp /app/next.config.js ./next.config.js; \
    fi

RUN if [ -d "/app/scripts" ] && [ ! -d "./scripts" ]; then \
        echo "📁 Copying scripts..."; \
        cp -r /app/scripts ./scripts; \
    fi

# Make scripts executable
RUN if [ -f scripts/detect-and-build.sh ]; then \
        chmod +x scripts/detect-and-build.sh; \
    fi
    
RUN if [ -f scripts/validate-logs.sh ]; then \
        dos2unix scripts/validate-logs.sh; \
        chmod +x scripts/validate-logs.sh; \
    fi

ENV NODE_ENV=production \
    PORT=3000

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
USER nextjs

CMD ["sh", "-c", "\
    if [ -d .next ]; then \
        echo '🚀 Starting Next.js application...'; \
        exec npm start; \
    elif [ -d dist ]; then \
        echo '🚀 Starting Vite preview...'; \
        npx serve -s dist -l $PORT; \
    elif [ -f scripts/detect-and-build.sh ]; then \
        echo '📜 Starting with detect-and-build.sh...'; \
        ./scripts/detect-and-build.sh; \
    else \
        echo '❌ No build artifacts found'; \
        exit 1; \
    fi"]