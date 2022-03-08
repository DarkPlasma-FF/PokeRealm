const { SlashCommandBuilder } = require('@discordjs/builders');
const process = require('process');
const prettyMilliseconds = require('pretty-ms');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const { cpus } = require('os');
const user = require('../../models/user.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Shows the statistics of the bot.'),
  async execute(client, interaction) {
    await interaction.deferReply();
    const load = cpus()
      .map((u) => {
        let { user, nice, irq, sys, idle } = u.times;
        return (
          ((((user + nice + sys + irq) / idle) * 10000) / 100).toFixed(2) + '%'
        );
      })
      .join(' | ');

    const uptime = prettyMilliseconds(client.uptime, {
      verbose: true,
      secondsDecimalDigits: 0,
    });

    const users = await user.countDocuments();
    let heap = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    let totalheap = (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2);

    let embed = new MessageEmbed()
      .setAuthor({
        name: `${client.user.username} statistics`,
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(
        `\`\`\` • Servers : ${
          client.guilds.cache.size
        } \n • Members : ${client.guilds.cache
          .reduce((a, c) => a + c.memberCount, 0)
          .toLocaleString()} \n • Users : ${users} \n • Channels : ${
          client.channels.cache.size
        } \n • Uptime : ${uptime} \n • Heap Used : ${heap} MB \n • Total Heap : ${totalheap} MB \n • CPU load : ${load}\`\`\``
      )
      .setColor(client.config.colors.default)
      .setTimestamp();
    interaction.editReply({ embeds: [embed] });
  },
};
