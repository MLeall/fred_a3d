const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { QueryType } = require("discord-player")
const { YouTubeExtractor, SpotifyExtractor} = require("@discord-player/extractor");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("Play songs/playlists in your voice channel.")
        .addStringOption((option) => option.setName("searchterms").setDescription("params for song or playlist").setRequired(true)),
	run: async ({ client, interaction }) => {
        client.player.extractors.register(YouTubeExtractor);
        client.player.extractors.register(SpotifyExtractor);

        const completeMember = await interaction.guild.members.fetch(interaction.member.user.id)
		if (!completeMember.voice.channel) return interaction.editReply("You need to be in a VC to use this command")

		const queue = await client.player.nodes.create(interaction.guild, {
            metadata: {
             channel: interaction.channel,
             client: interaction.guild.members.me,
             requestedBy: interaction.user,
            },
            selfDeaf: true,
            volume: 70,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 300000,
            leaveOnEnd: true,
            leaveOnEndCooldown: 300000,
          });
             

		if (!queue.connection) await queue.connect(completeMember.voice.channel)

		let embed = new EmbedBuilder()
        
        let url = interaction.options.getString("searchterms")
        const result = await client.player.search(url, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        })

        if (!result.hasTracks())
            return interaction.editReply("No results")

        if (result.playlist) {
            await queue.addTrack(result.playlist.tracks)
            playlist = result.playlist;
            embed
            .setDescription(`**${playlist.title}**\nHas been added to the Queue`)
            .setThumbnail(playlist.thumbnail)
            .setFooter({ text: `Musics: ${playlist.tracks.length}`})
        } else {
            await queue.addTrack(result.tracks[0])
            song = result.tracks[0];
            embed
            .setDescription(`**${song.title}**\nHas been added to the Queue`)
            .setThumbnail(song.thumbnail)
            .setFooter({ text: `Duration: ${song.duration}`})
        }
		
        if (!queue.isPlaying()) await queue.node.play()
        await interaction.editReply({
            embeds: [embed]
        })
	},
}