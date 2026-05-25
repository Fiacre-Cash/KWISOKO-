FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY next.config.js ./


# Build the Next.js app
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
