
# -----------------------------------------------------------
# Base Image - Dependencies Stage
# -----------------------------------------------------------
FROM node:20-alpine AS deps

# Install git and other tools for cloning
RUN apk add --no-cache git bash curl wget dos2unix ca-certificates && \
    update-ca-certificates

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json ./

# Copy Prisma schema if it exists
COPY prisma ./prisma 

# Install dependencies
RUN npm ci --retry 5 --fetch-retries=5 --fetch-timeout=60000

# -----------------------------------------------------------
# Builder Stage - Universal Build
# -----------------------------------------------------------
# Builder Stage - Clone and Build (Universal)
FROM node:20-alpine AS builder

ARG REPO_URL
ARG BRANCH
ARG DATABASE_URL

RUN apk add --no-cache git bash curl dos2unix

WORKDIR /app

# Clone the repository
RUN if [ -n "$REPO_URL" ]; then \
        echo "📦 Cloning repository: $REPO_URL (branch: $BRANCH)"; \
        git clone --depth 1 --branch "$BRANCH" "$REPO_URL" /tmp/repo; \
    fi

# Copy files from cloned repo (excluding . and ..)
RUN if [ -n "$REPO_URL" ]; then \
        echo "📦 Copying files from cloned repository"; \
        cp -r /tmp/repo/* /app/; \
        for file in /tmp/repo/.*; do \
            basename=$(basename "$file"); \
            if [ "$basename" != "." ] && [ "$basename" != ".." ]; then \
                cp -r "$file" /app/; \
            fi; \
        done; \
        rm -rf /tmp/repo; \
    else \
        echo "📦 Using local files"; \
    fi

# Debug: Check what files we have
RUN echo "=== Files after clone ===" && \
    ls -la

# Check for Next.js config files without failing
RUN echo "=== Checking for Next.js config ===" && \
    if [ -f "next.config.js" ]; then \
        echo "Found next.config.js"; \
        ls -la next.config.js; \
    fi && \
    if [ -f "next.config.ts" ]; then \
        echo "Found next.config.ts"; \
        ls -la next.config.ts; \
    fi

# Check for Vite config files without failing
RUN echo "=== Checking for Vite config ===" && \
    if [ -f "vite.config.js" ]; then \
        echo "Found vite.config.js"; \
        ls -la vite.config.js; \
    fi && \
    if [ -f "vite.config.ts" ]; then \
        echo "Found vite.config.ts"; \
        ls -la vite.config.ts; \
    fi

# Check package.json
RUN echo "=== Checking package.json ===" && \
    cat package.json | head -20

# Set environment variable for database
ENV DATABASE_URL=$DATABASE_URL

# Install dependencies
RUN npm ci --include=dev

# Copy detection script if it exists locally
COPY scripts/detect-and-build.sh /tmp/detect-and-build.sh
RUN if [ -f /tmp/detect-and-build.sh ]; then \
        mkdir -p scripts && \
        cp /tmp/detect-and-build.sh scripts/detect-and-build.sh && \
        chmod +x scripts/detect-and-build.sh; \
    fi

# Run the build script
RUN if [ -f scripts/detect-and-build.sh ]; then \
        echo "📜 Using detect-and-build.sh from repository"; \
        ./scripts/detect-and-build.sh; \
    else \
        echo "📜 No detect-and-build.sh found, using inline detection"; \
        echo "🔍 Detecting project type..."; \
        if [ -f "next.config.js" ] || [ -f "next.config.ts" ]; then \
            echo "🏗️ Building Next.js app..."; \
            npm run build; \
        elif [ -f "vite.config.js" ] || [ -f "vite.config.ts" ]; then \
            echo "🏗️ Building Vite app..."; \
            npm run build; \
        else \
            echo "⚠️ No build script found"; \
        fi; \
    fi

# Verify build output
RUN echo "=== Build verification ==="
RUN if [ -d ".next" ]; then \
        echo "✅ Next.js build successful"; \
        ls -la .next; \
    fi
RUN if [ -d "dist" ]; then \
        echo "✅ Vite build successful"; \
        ls -la dist; \
    fi
RUN if [ ! -d ".next" ] && [ ! -d "dist" ]; then \
        echo "❌ No build output found"; \
        exit 1; \
    fi

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

# Copy only what's needed from builder (not the entire /app)
# This avoids duplication and recursion issues
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/public ./public 

# Copy optional config files
RUN if [ -f "/app/prisma.config.ts" ] && [ ! -f "./prisma.config.ts" ]; then \
        cp /app/prisma.config.ts ./prisma.config.ts; \
    fi

RUN if [ -f "/app/next.config.js" ] && [ ! -f "./next.config.js" ]; then \
        cp /app/next.config.js ./next.config.js; \
    fi

RUN if [ -d "/app/scripts" ] && [ ! -d "./scripts" ]; then \
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