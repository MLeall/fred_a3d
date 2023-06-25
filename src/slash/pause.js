const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue  } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the music"),
	run: async ({ interaction }) => {
		const queue = useQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("There are no songs in the queue")

		queue.node.setPaused(!queue.node.isPaused())
        await interaction.editReply("Music has been paused! Use `/resume` to resume the music")
	},
}