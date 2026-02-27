# -----------------------------------------------------------
# Base Image
# -----------------------------------------------------------
# Use the official Node.js version 20 Alpine image.
# "Alpine" is a lightweight Linux distribution, which keeps
# the image small and efficient.
# This image already contains Node.js and npm installed.
FROM node:20-alpine


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
COPY package*.json ./

# Install all Node dependencies defined in package.json.
# This includes:
# - Next.js
# - React
# - Prisma
# - Any other libraries your app depends on
RUN npm install


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
# Build Application
# -----------------------------------------------------------
# Builds the Next.js production bundle.
# This compiles your application into optimized production code.
# After this step, your app is ready to run in production mode.
RUN npm run build


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
# Expose Port
# -----------------------------------------------------------
# Exposes port 3000 inside the container.
# This tells Docker that the app runs on port 3000.
# You still need to map this port when running the container:
#   docker run -p 3000:3000 ...
EXPOSE 3000


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
CMD ["npm", "start"]