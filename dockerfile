FROM node:18-slim

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

USER discordbot

# Start the bot
CMD [ "node", "src/index.js" ]