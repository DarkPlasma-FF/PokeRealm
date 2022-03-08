module.exports = (client) => {
  console.log(`${client.user.tag} is now online.`);
  client.user.setPresence({
    activities: [{ name: `${client.config.prefix}help`, type: 'LISTENING' }],
  });
};
