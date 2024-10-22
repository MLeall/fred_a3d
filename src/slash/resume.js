const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const {
  YouTubeExtractor,
  SpotifyExtractor,
} = require("@discord-player/extractor");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("resume")
    .setDescription("Despausa a sua musga"),
  run: async ({ interaction }) => {
    const queue = useQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("Sem músicas para tocar :(");

    if (queue.dispatcher.isPaused()) {
      queue.node.setPaused(false);
      await interaction.editReply("O som está de volta.");
    } else {
      await interaction.editReply("A música ja está tocando.");
    }
  },
};
