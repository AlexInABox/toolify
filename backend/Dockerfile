# Stage 1: Build
FROM node:18-bullseye AS builder

RUN apt update && apt install python3 build-essential -y
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y

WORKDIR /app

# Copy package files and install dependencies (including devDependencies for TypeScript)
COPY package.json package-lock.json ./
RUN npm install --only=development

# Copy the rest of the source code
COPY . .

# Compile TypeScript
RUN npx tsc

# Stage 2: Production Image
FROM node:18-bullseye

RUN apt update && apt install -y python3 build-essential
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy compiled JavaScript files
COPY --from=builder /app/dist /app/dist

EXPOSE 3000

CMD ["node", "dist/index.js"]