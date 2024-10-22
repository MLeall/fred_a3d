FROM node:16-bullseye

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

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create a non-root user
RUN useradd -m discordbot && \
    chown -R discordbot:discordbot /usr/src/app

# Switch to non-root user
USER discordbot

# Start the bot
CMD [ "npm", "start" ]