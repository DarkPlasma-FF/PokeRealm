const { MessageEmbed } = require('discord.js');
const user = require('../../models/profile.js');

module.exports = {
  name: 'bal',
  aliases: ['balance', 'coins'],
  category: 'Pokémon',
  execute: async (client, message, args) => {
    const data = await user.findOne({ Id: message.author.id });
    if (!data) return message.channel.send(client.config.errors.userNotStarted);
    const embed = new MessageEmbed()
      .setTitle(`${message.author.username}'s balance`)
      .setThumbnail(message.author.displayAvatarURL())
      .setColor(client.config.colors.default)
      .setDescription(
        ` ${
          client.config.emotes.gold
        } Gold : \`${data.bal.gold.toLocaleString()}\` \n${
          client.config.emotes.gems
        } Gems : \`${data.bal.gems.toLocaleString()}\` \n${
          client.config.emotes.redeems
        } Redeems : \`${data.bal.redeems.toLocaleString()}\``
      )
      .setTimestamp();
    message.channel.send({ embeds: [embed] });
  },
};
