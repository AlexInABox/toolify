# Stage 1: Build
FROM node:18-alpine AS builder

# Install dependencies for canvas
RUN apk add --no-cache python3 build-base cairo-dev pango-dev jpeg-dev giflib-dev librsvg-dev

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --only=development

# Copy source code and compile TypeScript
COPY . .
RUN npx tsc

# Stage 2: Production Image
FROM node:18-alpine

# Install only runtime dependencies for canvas
RUN apk add --no-cache cairo pango jpeg giflib librsvg

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy compiled JavaScript files
COPY --from=builder /app/dist /app/dist

EXPOSE 3000

CMD ["node", "dist/index.js"]