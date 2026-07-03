# WashAI production image — single container, SQLite on a mounted volume.
# Build:  docker build -t washai .
# Run:    see docker-compose.prod.yml
FROM node:22-alpine

WORKDIR /app

# Install dependencies first for layer caching
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# Build the app
COPY . .
RUN npx prisma generate && npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Apply schema to the volume-mounted database on boot, then serve.
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm start"]
