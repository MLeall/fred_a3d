require("dotenv").config();

const { REST } = require ("@discordjs/rest");
const { Routes } = require ("discord-api-types/v9");
const { Client, Intents, Collection, InteractionCollector } = require ("discord.js");
const { Player } = require ("discord-player");

const fs = require("node:fs");
const path = require("node:path");
const internal = require("node:stream");

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGE, 
        Intents.FLAGS.GUILD_VOICE_STATES]
});

// Loading commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles)
{
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command);
}

client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMar: 1 << 25
    }
});

client.on("ready", () => {
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    const rest = new REST({version: "9"}).setToken(process.env.TOKEN);
    for (const guildId of guild_ids)
    {
        rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId), {
            body: commands
        })
        .then(() => console.log(`Added commands to ${guildId}`))
        .catch(console.error);
    }
});

client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    try
    {
        await command.execute({client, interaction});
    }
    catch(err)
    {
        console.error(err);
        await interaction.reply("Error while executing command")
    }
});

client.login(process.env.TOKEN);