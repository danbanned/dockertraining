
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
FROM node:20-alpine AS builder

# Install build tools
RUN apk add --no-cache git bash curl dos2unix

WORKDIR /app

# Build arguments for repository cloning
ARG REPO_URL
ARG BRANCH
ARG DATABASE_URL

# Set environment variables
ENV DATABASE_URL=$DATABASE_URL

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Clone the repository if REPO_URL is provided, otherwise use local files
RUN if [ -n "$REPO_URL" ]; then \
        echo "📦 Cloning repository: $REPO_URL (branch: $BRANCH)"; \
        git clone --depth 1 --branch $BRANCH $REPO_URL /tmp/repo && \
        cp -r /tmp/repo/* /tmp/repo/.[!.]* . \
    else \
        echo "📦 Using local files"; \
    fi

# Copy local files if they exist (for local builds)
COPY . .

# Create scripts directory if it doesn't exist
RUN mkdir -p scripts

# Copy detect-and-build.sh script if it exists locally
COPY scripts/detect-and-build.sh ./scripts/detect-and-build.sh 

# Make scripts executable
RUN if [ -f scripts/detect-and-build.sh ]; then \
        dos2unix scripts/detect-and-build.sh && \
        chmod +x scripts/detect-and-build.sh; \
    fi

# Run the universal build script
RUN if [ -f scripts/detect-and-build.sh ]; then \
        echo "📜 Running universal build script..."; \
        ./scripts/detect-and-build.sh; \
    else \
        echo "⚠️ No detect-and-build.sh found, using inline build"; \
        \
        # Install dependencies if needed
        if [ ! -d "node_modules" ]; then \
            npm ci --include=dev; \
        fi; \
        \
        # Generate Prisma client if schema exists
        if [ -f "prisma/schema.prisma" ]; then \
            echo "🗄️ Generating Prisma client..."; \
            npx prisma generate --schema=prisma/schema.prisma; \
        fi; \
        \
        # Detect framework and build
        if [ -f "next.config.js" ] || [ -f "next.config.ts" ]; then \
            echo "🏗️ Building Next.js app..."; \
            export NODE_ENV=production; \
            npm run build; \
        elif [ -f "vite.config.js" ] || [ -f "vite.config.ts" ]; then \
            echo "🏗️ Building Vite app..."; \
            npm run build; \
        elif npm run | grep -q "build"; then \
            echo "🏗️ Running build script..."; \
            npm run build; \
        else \
            echo "❌ No build script found"; \
            exit 1; \
        fi; \
    fi

# Verify build output
RUN echo "📦 Verifying build output..." && \
    if [ -d ".next" ]; then \
        echo "✅ Next.js build detected"; \
        ls -la .next; \
    elif [ -d "dist" ]; then \
        echo "✅ Vite build detected"; \
        ls -la dist; \
    else \
        echo "⚠️ No standard build output found"; \
    fi

# -----------------------------------------------------------
# Production Stage - Runner (Universal)
# -----------------------------------------------------------
FROM node:20-alpine AS runner

# Install runtime dependencies
RUN apk add --no-cache dumb-init curl bash dos2unix

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from builder
COPY --from=builder --chown=nextjs:nodejs /app /app

# Copy dependencies
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

# Copy package.json
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Copy build outputs (conditional)
RUN if [ -d "/app/.next" ]; then \
        echo "📦 Copying Next.js build..."; \
        cp -r /app/.next ./.next; \
    fi

RUN if [ -d "/app/dist" ]; then \
        echo "📦 Copying Vite build..."; \
        cp -r /app/dist ./dist; \
    fi

# Copy public assets
RUN if [ -d "/app/public" ]; then \
        cp -r /app/public ./public; \
    fi

# Copy Prisma files
RUN if [ -d "/app/prisma" ]; then \
        echo "📦 Copying Prisma schema..."; \
        cp -r /app/prisma ./prisma; \
    fi

# Copy config files
RUN if [ -f "/app/next.config.js" ] && [ ! -f "./next.config.js" ]; then \
        echo "📄 Copying next.config.js..."; \
        cp /app/next.config.js ./next.config.js; \
    fi

RUN if [ -f "/app/vite.config.js" ] && [ ! -f "./vite.config.js" ]; then \
        echo "📄 Copying vite.config.js..."; \
        cp /app/vite.config.js ./vite.config.js; \
    fi

RUN if [ -f "/app/prisma.config.ts" ] && [ ! -f "./prisma.config.ts" ]; then \
        echo "📄 Copying prisma.config.ts..."; \
        cp /app/prisma.config.ts ./prisma.config.ts; \
    fi

# Copy scripts
RUN if [ -d "/app/scripts" ] && [ ! -d "./scripts" ]; then \
        echo "📁 Copying scripts..."; \
        cp -r /app/scripts ./scripts; \
    fi

# Make scripts executable
RUN if [ -f scripts/validate-logs.sh ]; then \
        dos2unix scripts/validate-logs.sh && \
        chmod +x scripts/validate-logs.sh; \
    fi

RUN if [ -f scripts/detect-and-build.sh ]; then \
        dos2unix scripts/detect-and-build.sh && \
        chmod +x scripts/detect-and-build.sh; \
    fi

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

# Expose port
EXPOSE 3000

# Use dumb-init as init process
ENTRYPOINT ["dumb-init", "--"]

# Switch to non-root user
USER nextjs

# Determine start command based on what was built
CMD ["sh", "-c", "\
    if [ -f scripts/detect-and-build.sh ]; then \
        echo '📜 Running detect-and-build.sh for startup...'; \
        ./scripts/detect-and-build.sh; \
    else \
        echo '🚀 Starting application...'; \
        if [ -d .next ]; then \
            echo 'Running Next.js migrations and start...'; \
            npx prisma migrate deploy && npm start; \
        elif [ -d dist ]; then \
            echo 'Running Vite preview...'; \
            npx prisma migrate deploy && npx serve -s dist -l $PORT; \
        else \
            echo 'Running with npm start...'; \
            npx prisma migrate deploy && npm start; \
        fi; \
    fi"]

