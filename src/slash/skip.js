const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Pula a música atual"),
  run: async ({ interaction }) => {
    const queue = useQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("Sem músicas na sua fila");

    const currentSong = queue.currentTrack;

    queue.node.skip();
    await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription(`${currentSong.title} foi skipada!`)
          .setThumbnail(currentSong.thumbnail),
      ],
    });
  },
};
