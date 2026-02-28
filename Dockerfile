FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package*.json ./
RUN npm ci

<<<<<<< HEAD
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build
RUN npx prisma generate

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
=======
# Install all Node dependencies defined in package.json.
# This includes:
# - Next.js
# - React
# - Prisma
# - Any other libraries your app depends on
RUN npm ci
RUN npm ci

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

#docker deploy adds the tables

# -----------------------------------------------------------
# Build Application
# -----------------------------------------------------------
# Builds the Next.js production bundle.
# This compiles your application into optimized production code.
# After this step, your app is ready to run in production mode.
RUN npm run build

# -----------------------------------------------------------
# Build Application
# -----------------------------------------------------------
# Builds the Next.js production bundle.
# This compiles your application into optimized production code.
# After this step, your app is ready to run in production mode.
RUN npm run build
>>>>>>> 5d991e646cf9b60d4528ef4b9202b835f558ff29

EXPOSE 3000
<<<<<<< HEAD
CMD ["node", "server.js"]
=======


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
CMD sh -c "npx prisma migrate deploy && npm start"