const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Invite PokéRealm to your server.'),
  async execute(client, interaction) {
    await interaction.deferReply();
    const embed = new MessageEmbed()
      .setDescription(
        `[Click here](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=277025769472&scope=bot%20applications.commands) to add me to any of your servers.`
      )
      .setColor(client.config.colors.default)
      .setTimestamp();
    interaction.editReply({ embeds: [embed] });
  },
};
