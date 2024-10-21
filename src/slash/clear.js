const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Stops the bot and clears the queue"),
  run: async ({ interaction }) => {
    const queue = useQueue(interaction.guildId);

    if (!queue)
      return await interaction.editReply("There are no songs in the queue");

    queue.clear();
    await interaction.editReply("Queue cleared!");
  },
};
