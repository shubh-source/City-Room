FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install OpenSSL for Prisma compatibility
RUN apt-get update -y && apt-get install -y openssl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy prisma schema and generate client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest of the backend source code
COPY . .

# Cloud Run injects the PORT environment variable (default 8080)
# Express is set up to use process.env.PORT
USER node
EXPOSE 8080

# Start the server
CMD ["npm", "start"]
