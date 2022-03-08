const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Shows the ping of the bot.'),
  async execute(client, interaction) {
    const sent = await interaction.reply({
      content: 'Reticulating splines...',
      fetchReply: true,
    });
    interaction.editReply(
      `🏓 | Pong! Gateway ping : \`${client.ws.ping}ms\`, Rest ping : \`${
        sent.createdTimestamp - interaction.createdTimestamp
      }ms\`.`
    );
  },
};
