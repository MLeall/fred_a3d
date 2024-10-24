FROM node:18-alpine

RUN apk add --no-cache \
    python3 \
    py3-pip \
    build-base \
    libtool \
    autoconf \
    automake \
    cmake

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src ./src

# Create a non-root user
RUN adduser -D discordbot && \
    chown -R discordbot:discordbot /usr/src/app

# Switch to non-root user
USER discordbot

# Start the bot
CMD ["npm", "run", "start"]