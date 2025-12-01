FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including production deps like express)
RUN npm install

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_UMAMI_WEBSITE_ID
ARG VITE_UMAMI_SCRIPT_URL
ARG VITE_APP_URL

# Set environment variables during build
ENV VITE_UMAMI_WEBSITE_ID=$VITE_UMAMI_WEBSITE_ID
ENV VITE_UMAMI_SCRIPT_URL=$VITE_UMAMI_SCRIPT_URL
ENV VITE_APP_URL=$VITE_APP_URL

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
