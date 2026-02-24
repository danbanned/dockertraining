# Use Node 20 alpine for dev
FROM node:20-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install


# Copy entire project, including prisma folder
COPY . .

# Build the Next.js production bundle
RUN npm run build

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

# Start app
CMD ["npm", "start"]