# Stage 1: Build
FROM node:20-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    python3 \
    python3-pip \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

RUN apk add --update --no-cache python3 build-base gcc && ln -sf /usr/bin/python3 /usr/bin/python

# Install node-gyp globally
RUN npm install -g node-gyp

WORKDIR /app

# Copy package files and install dependencies (including devDependencies for TypeScript)
COPY package.json package-lock.json ./
RUN npm install --only=development

# Copy the rest of the source code
COPY . .

# Compile TypeScript
RUN npx tsc

# Stage 2: Production Image
FROM node:20-alpine

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy compiled JavaScript files
COPY --from=builder /app/dist /app/dist

EXPOSE 3000

CMD ["node", "dist/index.js"]