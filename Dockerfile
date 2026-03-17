# -----------------------------------------------------------
# Base Image
# -----------------------------------------------------------
# Use the official Node.js version 20 Alpine image.
# "Alpine" is a lightweight Linux distribution, which keeps
# the image small and efficient.
# This image already contains Node.js and npm installed.
# dockerfile mlti-stage build for next.js application 
FROM node:20-alpine AS deps 



# Install dumb-init for proper signal handling, places a receptionist in formnt of your apps folodr directory 
RUN apk add --no-cache dumb-init

# so our script works make sure bash is installed in your Docker image.
RUN apk add --no-cache bash dos2unix curl git ca-certificates && update-ca-certificates

# docker compose is using wget so install it in our image 
RUN apk add --no-cache curl wget
# -----------------------------------------------------------
# Working Directory
# -----------------------------------------------------------
# Sets the working directory inside the container to /app.
# All following commands (COPY, RUN, CMD) will execute
# relative to this directory.
WORKDIR /app


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

WORKDIR /app

#copy dependecies from deps stage
COPY --from=deps /app/node_modules ./node_modules

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

# Convert line endings & make script executable
RUN dos2unix scripts/validate-logs.sh
RUN chmod +x scripts/validate-logs.sh


ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL


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
ENV DATABASE_URL="postgresql://user:password@localhost:5432/db"
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

ENV DATABASE_URL=${DATABASE_URL}

# Install bash, dumb-init, curl for health checks
RUN apk add --no-cache dumb-init curl bash dos2unix

# create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# set working directory
WORKDIR /app

# copy built app + dependencies from builder
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

# Convert line endings & make scripts executable
RUN dos2unix /app/scripts/validate-logs.sh
RUN chmod +x /app/scripts/validate-logs.sh

# set env variables
ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

# expose port
EXPOSE 3000

# use dumb-init as init process
ENTRYPOINT ["dumb-init", "--"]

# switch to non-root user
USER nextjs

# start app
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]