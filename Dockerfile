# -----------------------------------------------------------
# Base Image
# -----------------------------------------------------------
# Use the official Node.js version 20 Alpine image.
# "Alpine" is a lightweight Linux distribution, which keeps
# the image small and efficient.
# This image already contains Node.js and npm installed.
# dockerfile mlti-stage build for next.js application 
FROM node:20-alpine as deps 



# Install dumb-init for proper signal handling, places a receptionist in formnt of your apps folodr directory 
RUN apk add --no-cache dumb-init


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
RUN npm ci

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

COPY . .





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
RUN npx prisma generate

# -----------------------------------------------------------
# Build Application
# -----------------------------------------------------------
# Builds the Next.js production bundle.
# This compiles your application into optimized production code.
# After this step, your app is ready to run in production mode.
RUN npm run build

#production stage

FROM node:20-alpine AS runner

#Install dumb-init and curl for health checks 
RUN apk add --no-cache dumb-init curl 

#create non-rrot user 
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

#set working directory 
WORKDIR /app 

#COPY buit application and dependecies from our build stage using chown to nake sure its a non root user 
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

#set envirmenetal varaiables 

ENV NODE_ENV=production \
    PORT=3000 \
    NEXT_TELEMETRY_DISABLED=1

# -----------------------------------------------------------
# Expose Port
# -----------------------------------------------------------
# Exposes port 3000 inside the container.
# This tells Docker that the app runs on port 3000.
# You still need to map this port when running the container:
#   docker run -p 3000:3000 ...
EXPOSE 3000

#specifying who the non root user is 
USER nextjs


#use dumb-init as intitprocess for propersignal jhandling 
ENTRYPOINT ["dumb-init","--"]

# -----------------------------------------------------------
# Start the Application
# -----------------------------------------------------------
# This is the command Docker runs when the container starts.
#
# "npm start" usually runs:
#   next start
#
# That starts the production Next.js server,
# which serves the built app and handles API routes.
CMD ["sh", "scripts/validate-logs.sh", "sh", "-c", "npx prisma migrate deploy && npm start"]