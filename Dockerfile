# -----------------------------------------------------------
# Base Image
# -----------------------------------------------------------
# Use the official Node.js version 20 Alpine image.
# "Alpine" is a lightweight Linux distribution, which keeps
# the image small and efficient.
# This image already contains Node.js and npm installed.
# dockerfile mlti-stage build for next.js application 
FROM node:20-alpine AS deps 



# Install git
RUN apk add --no-cache git

# Build arguments for repository
ARG REPO_URL
ARG BRANCH
ARG DATABASE_URL



# -----------------------------------------------------------
# Working Directory
# -----------------------------------------------------------
# Sets the working directory inside the container to /app.
# All following commands (COPY, RUN, CMD) will execute
# relative to this directory.

WORKDIR /app


# Install dumb-init for proper signal handling, places a receptionist in front of your apps folder directory
RUN apk add --no-cache dumb-init

# so our script works make sure bash is installed in your Docker image.
RUN apk add --no-cache bash dos2unix curl git ca-certificates && update-ca-certificates

# docker compose is using wget so install it in our image 
RUN apk add --no-cache curl wget


# -----------------------------------------------------------
# Install Dependencies
# -----------------------------------------------------------
# First we copy only package.json and package-lock.json.
# This allows Docker to cache dependency installation.
# If your dependencies don't change, Docker won't reinstall
# them on every rebuild — which makes builds faster.
COPY package.json package-lock.json ./
# copy the Prisma schema
COPY prisma ./prisma

# Install all Node dependencies defined in package.json.
# This includes:
# - Next.js
# - React
# - Prisma
# - Any other libraries your app depends on

RUN npm ci --retry 5 --fetch-retries=5 --fetch-timeout=60000

# Development stage 
FROM node:20-alpine AS builder

#install git for cloning the repository
RUN apk add --no-cache git

# Debug: print the values
RUN echo "Cloning from: $REPO_URL"
RUN echo "Branch: $BRANCH"
RUN echo "DATABASE_URL: $DATABASE_URL"

# Clone the repository at build time
RUN git clone --depth 1 --branch $BRANCH $REPO_URL / app

WORKDIR /app

# 1. Declare the build argument
ARG DATABASE_URL

# 2. Use it, for example by setting an environment variable
ENV DATABASE_URL=$DATABASE_URL

#copy dependecies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy Prisma configuration FIRST (important for Prisma 7)
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

# -----------------------------------------------------------
# Copy Application Source Code
# -----------------------------------------------------------
# Now copy the entire project into the container.
# This includes:
# - Next.js pages/app directory
# - Components
# - Prisma folder (schema + migrations)
# - Public assets
# - Configuration files
COPY public ./public
COPY . .

# Make scripts executable
RUN dos2unix scripts/validate-logs.sh && chmod +x scripts/validate-logs.sh






# -----------------------------------------------------------
# Generate Prisma Client
# -----------------------------------------------------------
# Prisma uses your schema.prisma file to generate a type-safe
# database client.
#
# This step:
# - Reads prisma/schema.prisma
# - Generates database client code inside node_modules/.prisma
#
# Your application uses this generated client to communicate
# with your database (PostgreSQL, MySQL, etc.).
RUN npx prisma generate --schema=prisma/schema.prisma
# -----------------------------------------------------------
# Build Application
# -----------------------------------------------------------
# Builds the Next.js production bundle.
# This compiles your application into optimized production code.
# After this step, your app is ready to run in production mode.
RUN npm run build

#production stage

# production stage
FROM node:20-alpine AS runner

# Install bash, dumb-init, curl for health checks
RUN apk add --no-cache dumb-init curl bash dos2unix

# set working directory
WORKDIR /app

ENV DATABASE_URL=${DATABASE_URL}


# create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001


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


# set env variables
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

# expose port
EXPOSE 3000

# use dumb-init as init process its like our receptioness 
ENTRYPOINT ["dumb-init", "--"]

# switch to non-root user
USER nextjs

# start app
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]