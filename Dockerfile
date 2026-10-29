# ==================
# 1. Build Stage
# ==================

FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies (only package.json + lock first for better caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Build the Next.js app
RUN npm run build


# ==================
# 2. Runner Stage
# ==================
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy package.json and install only production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev

# Copy built app and required files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]