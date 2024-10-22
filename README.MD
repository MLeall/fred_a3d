# Discord Music Bot

This is a simple Discord music bot that allows users to play and manage music in a voice channel. The bot uses the Discord API and the YouTube/Spotify extractors to search for and play music.

## Features

- Play music from YouTube and Spotify by providing a search query or a URL.
- Pause, resume, skip, and stop playback.
- Display the currently playing song and its duration.

## Setup

To set up the bot, follow these steps:

1. Clone or download this repository to your local machine:
   `git clone https://github.com/raphaluz/fred_a3d.git`

2. Install the required dependencies using npm:
   `npm install`

3. Create a new application on the Discord Developer Portal ([discord.com/developers/applications](https://discord.com/developers/applications)).

4. Under the "Bot" tab, click on "Add Bot" to create a new bot user.

5. Copy the bot token and paste it into the `.ENV` file:
   {
   "TOKEN": "YOUR_BOT_TOKEN"
   "CLIENT_ID": "YOUR_CLIENT_ID"
   }

6. Invite the bot to your Discord server. Go to the "OAuth2" tab in the Developer Portal, select the "bot" scope, and copy the generated invite URL. Paste the URL into your web browser and choose the server where you want to add the bot.

7. Run bot using npm:
   `npm run start`

## Usage

Once the bot is running and connected to your Discord server, you can use the following commands:

    /play <query>: Searches for a song on YouTube and adds it to the queue.
    /play <URL>: Plays the song from the provided URL.
    /pause: Pauses the currently playing song.
    /resume: Resumes playback if paused.
    /skip: Skips the current song and plays the next one in the queue.
    /clear: Stops playback and clears the queue.
    /shuffle: Shuffles the queue.
    /queue: Show songs in the queue and current song.
