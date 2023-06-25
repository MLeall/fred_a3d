const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue  } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles the queue"),
	run: async ({ interaction }) => {
		const queue = useQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

		queue.tracks.shuffle();
        await interaction.editReply(`The queue of ${queue.size} songs have been shuffled!`)
	},
}