module.exports = async (client, interaction) => {
  if (interaction.isCommand()) {
    const cmd = client.applicationCommands.get(interaction.commandName);

    if (!cmd) return;
    if (cmd.guildOnly && !interaction.guild)
      return interaction.reply({
        content: `${client.config.emotes.cross} | This command can be executed in \`Guilds\` only.`,
        empheral: true,
      });

    if (cmd.clientPermissions) {
      let neededPerms = [];
      cmd.clientPermissions.forEach((perm) => {
        const perms = perm.toLowerCase().trim().replace(/_/g, ' ');
        const missingPerms = perms.charAt(0).toUpperCase() + perms.slice(1);
        if (interaction.guild && !interaction.guild.me.permissions.has(perm))
          neededPerms.push(`\`${missingPerms}\``);
      });
      if (neededPerms.length)
        return interaction.reply({
          content: `${client.config.emotes.cross} | I need ${neededPerms.join(
            ' and '
          )} permission in this server to execute this command.`,
          empheral: true,
        });
    }
if (cmd.clientPermissions) {
      let neededPerms = [];
      cmd.clientPermissions.forEach((perm) => {
        const perms = perm.toLowerCase().trim().replace(/_/g, ' ');
        const missingPerms = perms.charAt(0).toUpperCase() + perms.slice(1);
        if (
          interaction.guild &&
          !interaction.guild.me.permissionsIn(interaction.channel).has(perm)
        )
          neededPerms.push(`\`${missingPerms}\``);
      });
      if (neededPerms.length)
        return interaction.reply({
          content: `${client.config.emotes.cross} | I need ${neededPerms.join(
            ' and '
          )} permission in this channel to execute this command.`,
          empheral: true,
        });
      }
    cmd.execute(client, interaction).catch((err) => {
      console.log(err);
      interaction.reply({
        content: `⚠️ | An error occurred while executing this command.`,
        ephemeral: true,
      });
    });
  }
};
