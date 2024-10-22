const Discord = require("discord.js");
const dotenv = require("dotenv");
const { GatewayIntentBits } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Player } = require("discord-player");
const fs = require("fs");

dotenv.config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

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

// Load slash commands
let commands = [];
const slashFiles = fs
  .readdirSync("./slash")
  .filter((file) => file.endsWith(".js"));
for (const file of slashFiles) {
  const slashcmd = require(`./slash/${file}`);
  client.slashcommands.set(slashcmd.data.name, slashcmd);
  commands.push(slashcmd.data.toJSON());
}

// Function to deploy commands to a guild
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

client.login(TOKEN);
