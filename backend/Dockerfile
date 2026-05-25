FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src

# Generate Prisma client
RUN npm run prisma:generate

# Build the app
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]
