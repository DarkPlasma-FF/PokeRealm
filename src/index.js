const fs = require('fs');
const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
  ],
  partials: ['CHANNEL'],
});
client.config = require('./config');
client.applicationCommands = new Discord.Collection();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200).end(`Express server is running.`);
});
server.listen(3000, () => {
  console.log('Express server is ready.');
});

fs.readdirSync('./commands/').forEach((dir) => {
  const commandFiles = fs
    .readdirSync(`./commands/${dir}/`)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${dir}/${file}`);
    console.log(`[ Command ] Loaded ${command.name}`);
    client.commands.set(command.name, command);
    if (command.aliases)
      command.aliases.forEach((alias) =>
        client.aliases.set(alias, command.name)
      );
  }
});

fs.readdirSync('./events/').forEach((file) => {
  const event = require(`./events/${file}`);
  let eventName = file.split('.')[0];
  console.log(`[ Event ] Loaded ${eventName}`);
  client.on(eventName, event.bind(null, client));
});

const commands = [];
const clientId = '938368950620786709';
const guildId = '924680013196955708';
fs.readdirSync('./applicationCommands/').forEach((dir) => {
  const commandFiles = fs
    .readdirSync(`./applicationCommands/${dir}/`)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./applicationCommands/${dir}/${file}`);
    commands.push(command.data.toJSON());
    console.log(`[ Application Command ] Loaded ${command.data.name}`);
    client.applicationCommands.set(command.data.name, command);
  }
});

const rest = new REST({ version: '9' }).setToken(process.env.Token);

(async () => {
  try {
    console.log('Registering Application Commands.');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands,
    });

    console.log('Registered Application Commands.');
  } catch (error) {
    console.error(error);
  }
})();

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection : ', reason, promise);
});

process.on('uncaughtException', (err) => {
  console.log('Uncaught Error :', err);
});

client.login(process.env.Token);
