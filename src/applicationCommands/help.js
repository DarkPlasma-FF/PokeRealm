const {
  MessageEmbed,
  MessageSelectMenu,
  MessageActionRow,
} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows the help menu of the bot.'),
  async execute(client, interaction) {
    await interaction.deferReply();
    const categories = [
      'Miscellaneous',
      'Getting Started',
      'Pokémon',
      'Market',
    ];

    const embed = new MessageEmbed()
      .setTitle(`${client.user.username} commands`)
      .setDescription(
        `Type \`/help <command>\` to view details of a command.

__**Categories :**__
${categories.join(
  '\n'
)} \n\n__**🖇️ Important Links :**__ \n[Support server](https://discord.gg/GVjeprBnmx) | [Invite me](https://discord.com/api/oauth2/authorize?client_id=${
          client.user.id
        }&permissions=277025769472&scope=bot%20applications.commands)

`
      )
      .setTimestamp()
      .setColor(client.config.colors.default);

    const emoji = {
      Miscellaneous: 'ℹ️',
      Market: '🛒',
    };

    const row = new MessageActionRow().addComponents([
      new MessageSelectMenu()
        .setCustomId('help')
        .setPlaceholder(`Choose a category`)
        .addOptions([
          categories.map((category) => {
            return {
              label: `${category[0].toUpperCase() + category.slice(1)}`,
              value: category,
              emoji: emoji[category],
            };
          }),
        ]),
    ]);

    const expired_row = new MessageActionRow().addComponents([
      new MessageSelectMenu()
        .setDisabled(true)
        .setCustomId('help')
        .setPlaceholder(`Choose a category`)
        .addOptions([
          categories.map((category) => {
            return {
              label: `${category[0].toUpperCase() + category.slice(1)}`,
              value: category,
              emoji: emoji[category],
            };
          }),
        ]),
    ]);

    interaction
      .editReply({ embeds: [embed], components: [row] })
      .then(async (msg) => {
        let collector = await msg.createMessageComponentCollector({
          time: '60000',
        });
        collector.on('collect', async (i) => {
          if (i.user.id !== interaction.user.id)
            return i.reply({
              content: client.config.errors.componentNotRequestedByUser,
              ephemeral: true,
            });
          if (i.customId === 'help') {
            await i.deferUpdate();
            let [directory] = i.values;

            let embed = new MessageEmbed()
              .setColor(client.config.colors.default)
              .setAuthor(`${directory} Commands`)
              .setDescription(
                ` ${client.commands
                  .filter((cmd) => cmd.category === directory)
                  .map((cmd) => {
                    return [
                      `\`${client.config.prefix}${cmd.name}\` → ${
                        cmd.description || 'No description'
                      }`,
                    ];
                  })
                  .join(
                    '\n'
                  )} \n\n __**🖇️ Important Links :**__ \n[Support server](https://discord.gg/GVjeprBnmx) | [Invite me](https://discord.com/api/oauth2/authorize?client_id=${
                  client.user.id
                }&permissions=277025769472&scope=bot%20applications.commands) `
              );

            msg.edit({ embeds: [embed] });
          }
        });
        collector.on('end', () => {
          msg.edit({ components: [expired_row] });
        });
      });
  },
};
