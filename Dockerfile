# ---- Base image for building ----
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (only package*.json first for better caching)
COPY package*.json ./

# If you use Yarn or pnpm, adjust accordingly
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build the NestJS app (creates dist/ folder)
RUN npm run build

# ---- Production image ----
FROM node:20-alpine AS runner

WORKDIR /app

# Only copy the necessary files from builder
COPY package*.json ./
# Install all dependencies including dev dependencies for development
RUN npm install --legacy-peer-deps

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/doc ./doc
# Copy source code for development (will be overridden by volume mount)
COPY . .

# If you have env files, you’ll usually mount them or use docker env vars
# EXPOSE just documents the port
EXPOSE 4000

# Default command
# CMD ["node", "dist/main.js"]
CMD ["npm", "run", "start:dev"]