const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the music"),
  run: async ({ interaction }) => {
    const queue = useQueue(interaction.guildId);

    if (!queue)
      return await interaction.editReply("Sem músicas para pausar :(");

    if (!queue.dispatcher.isPaused()) {
      queue.node.setPaused(!queue.node.isPaused());
      await interaction.editReply(
        "Música pausada! Use `/resume` pra voltar com o som"
      );
    } else {
      await interaction.editReply("A música ja está pausada.");
    }
  },
};
