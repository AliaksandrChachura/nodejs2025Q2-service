# ---- Base image for building ----
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (only package*.json first for better caching)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy the rest of the source code
COPY . .

# Build the NestJS app (creates dist/ folder)
RUN npm run build

# ---- Development/Runner image ----
FROM node:20-alpine AS runner

WORKDIR /app

# Install dependencies (needed for runtime and dev tools)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy prisma schema (needed for potential regeneration)
COPY prisma ./prisma

# Copy generated Prisma client from builder (avoids regeneration)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/doc ./doc

# Copy source code for development (will be overridden by volume mount in docker-compose)
COPY . .

# If you have env files, you’ll usually mount them or use docker env vars
# EXPOSE just documents the port
EXPOSE 4000

# Default command
# CMD ["node", "dist/main.js"]
CMD ["npm", "run", "start:dev"]