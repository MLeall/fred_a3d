const Discord = require("discord.js");
const { GatewayIntentBits } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Player } = require("discord-player");
const fs = require("fs");
const path = require("path");
const http = require("http");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const PORT = process.env.PORT || 8080;

if (!TOKEN || !CLIENT_ID) {
  console.error("Required environment variables are missing!");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Discord bot is running!");
});

server.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`);
});

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
  ],
});

client.slashcommands = new Discord.Collection();
client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

const slashFiles = fs
  .readdirSync(path.join(__dirname, "slash"))
  .filter((file) => file.endsWith(".js"));

let commands = [];
for (const file of slashFiles) {
  const slashcmd = require(path.join(__dirname, "slash", file));
  client.slashcommands.set(slashcmd.data.name, slashcmd);
  commands.push(slashcmd.data.toJSON());
}

async function deployCommands(guildId) {
  try {
    const rest = new REST({ version: "9" }).setToken(TOKEN);
    console.log(`Deploying slash commands to guild ${guildId}`);

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), {
      body: commands,
    });

    console.log(`Successfully deployed commands to guild ${guildId}`);
  } catch (error) {
    console.error(`Failed to deploy commands to guild ${guildId}:`, error);
  }
}

// Event handler for when the bot joins a new server
client.on("guildCreate", async (guild) => {
  console.log(`Joined new guild: ${guild.name} (${guild.id})`);
  await deployCommands(guild.id);
});

// Event handler for when the bot is ready
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  console.log("Deploying commands to all existing guilds...");
  const guilds = client.guilds.cache;

  for (const [guildId] of guilds) {
    await deployCommands(guildId);
  }
});

// Handle slash command interactions
client.on("interactionCreate", (interaction) => {
  async function handleCommand() {
    if (!interaction.isCommand()) return;

    const slashcmd = client.slashcommands.get(interaction.commandName);
    if (!slashcmd) {
      return interaction.reply("Not a valid slash command");
    }

    await interaction.deferReply();
    await slashcmd.run({ client, interaction });
  }
  handleCommand();
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("HTTP server closed.");
    client.destroy();
    process.exit(0);
  });
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

// Handle bot statuses
client.player.on("error", (queue, error) => {
  console.error(`Player error: ${error.message}`);
  queue.metadata.channel.send(`An error occurred: ${error.message}`);
});

client.on("error", (error) => {
  console.error("Discord client error:", error);
});

client.on("disconnect", () => {
  console.log("Bot disconnected! Attempting to reconnect...");
});

client.on("reconnecting", () => {
  console.log("Bot reconnecting...");
});

client.login(TOKEN).catch((error) => {
  console.error("Failed to login:", error);
  process.exit(1);
});
