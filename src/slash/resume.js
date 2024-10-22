const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

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
