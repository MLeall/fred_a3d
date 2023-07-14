const { SlashCommandBuilder } = require("@discordjs/builders")
const { useQueue  } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Embaralha a fila."),
	run: async ({ interaction }) => {
		const queue = useQueue(interaction.guildId)

		if (!queue) return await interaction.editReply("No pedradas na fila :(")

		queue.tracks.shuffle();
        await interaction.editReply(`A fila de ${queue.size} musicas foi embaralhada!`)
	},
}