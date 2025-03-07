# Stage 1: Build
FROM node:18-alpine3.18 AS builder

RUN apk add --no-cache \
        sudo \
        curl \
        build-base \
        g++ \
        libpng \
        libpng-dev \
        jpeg-dev \
        pango-dev \
        cairo-dev \
        giflib-dev \
        python3

# Add glibc for compatibility
RUN apk --no-cache add ca-certificates wget && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.29-r0/glibc-2.29-r0.apk && \
    apk add glibc-2.29-r0.apk

# Update npm to the latest version
RUN npm install -g npm@latest

WORKDIR /app

# Copy package files and install dependencies (including devDependencies for TypeScript)
COPY package.json package-lock.json ./
RUN npm install --only=development

# Copy the rest of the source code
COPY . .

# Compile TypeScript
RUN npx tsc

# Stage 2: Production Image
FROM node:18-alpine3.18

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy compiled JavaScript files
COPY --from=builder /app/dist /app/dist

EXPOSE 3000

CMD ["node", "dist/index.js"]