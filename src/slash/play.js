const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { QueryType } = require("discord-player");
const { YoutubeiExtractor } = require("discord-player-youtubei");
const { SpotifyExtractor } = require("@discord-player/extractor");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Lança as mais brabas no seu chat de voz.")
    .addStringOption((option) =>
      option
        .setName("oqbuscas")
        .setDescription("params for song or playlist")
        .setRequired(true)
    ),
  run: async ({ client, interaction }) => {
    client.player.extractors.register(YoutubeiExtractor);
    client.player.extractors.register(SpotifyExtractor);

    const completeMember = await interaction.guild.members.fetch(
      interaction.member.user.id
    );
    if (!completeMember.voice.channel)
      return interaction.editReply(
        "Entre em um chat de voz para utilizar esse comando"
      );

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

    if (!queue.connection) await queue.connect(completeMember.voice.channel);

    let embed = new EmbedBuilder();

    let url = interaction.options.getString("oqbuscas");
    const result = await client.player.search(url, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!result.hasTracks()) return interaction.editReply("Nada encontrado");

    if (result.playlist) {
      await queue.addTrack(result.playlist.tracks);
      playlist = result.playlist;
      embed
        .setDescription(
          `**${playlist.title}**\nEssa lista de pedrada foi adicionada a sua fila`
        )
        .setThumbnail(playlist.thumbnail)
        .setFooter({ text: `Musicas: ${playlist.tracks.length}` });
    } else {
      await queue.addTrack(result.tracks[0]);
      song = result.tracks[0];
      embed
        .setDescription(
          `**${song.title}**\nEssa pedrada foi adicionada a sua fila`
        )
        .setThumbnail(song.thumbnail)
        .setFooter({ text: `Duração: ${song.duration}` });
    }

    if (!queue.isPlaying()) await queue.node.play();
    await interaction.editReply({
      embeds: [embed],
    });
  },
};
