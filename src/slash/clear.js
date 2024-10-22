const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Para o BOT e limpa a fila"),
  run: async ({ interaction }) => {
    const queue = useQueue(interaction.guildId);

    if (!queue) return await interaction.editReply("Sem músicas na sua fila");

    queue.clear();
    await interaction.editReply("Fila zerada!");
  },
};
