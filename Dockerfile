FROM node:18-bullseye

RUN apt-get update && \
    apt-get install -y \
    python3 \
    python3-pip \
    build-essential \
    libtool-bin \
    autoconf \
    automake \
    cmake \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src

# Create a non-root user
RUN useradd -m discordbot && \
    chown -R discordbot:discordbot /usr/src/app

# Switch to non-root user
USER discordbot

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the bot
CMD [ "node", "src/index.js" ]