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

# Copy dependency files
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install dependencies
RUN npm ci --retry 5 --fetch-retries=5 --fetch-timeout=60000

# -----------------------------------------------------------
# Builder Stage - Clone and Build
# -----------------------------------------------------------
FROM node:20-alpine AS builder

# Redeclare ARG in this stage
ARG REPO_URL
ARG BRANCH
ARG DATABASE_URL

# Install git for cloning
RUN apk add --no-cache git

# DEBUG: Print the values (this will show in build logs)
RUN echo "========== DEBUG =========="
RUN echo "REPO_URL: $REPO_URL"
RUN echo "BRANCH: $BRANCH"
RUN echo "==========================="

# Clone the repository
RUN git clone --depth 1 --branch $BRANCH $REPO_URL /app

WORKDIR /app

# Set environment variable for database
ENV DATABASE_URL=$DATABASE_URL

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy configuration files
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY public ./public
COPY scripts ./scripts
COPY next.config.js ./next.config.js

# Make scripts executable
RUN if [ -f scripts/validate-logs.sh ]; then \
        chmod +x scripts/validate-logs.sh; \
    fi

# Generate Prisma client
RUN npx prisma generate --schema=prisma/schema.prisma

# Build Next.js application
RUN npm run build

# -----------------------------------------------------------
# Production Stage - Runner
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

# Copy built application from builder (use conditional COPY via RUN)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# copy built app + dependencies from builder
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# Copy Prisma config + schema (required for migrations)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts


# Make scripts executable
RUN dos2unix /app/scripts/validate-logs.sh && chmod +x /app/scripts/validate-logs.sh


# Set environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

# Use dumb-init as init process
ENTRYPOINT ["dumb-init", "--"]

# Switch to non-root user
USER nextjs

# Start app
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]