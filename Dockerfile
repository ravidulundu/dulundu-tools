FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including production deps like express)
RUN npm install

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 80

# Start the server
CMD ["node", "server.js"]
