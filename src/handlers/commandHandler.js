const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const config = require('../config');

function loadCommands(client) {
  const commandsDir = path.join(__dirname, '../commands');
  const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js') && file !== '.gitkeep');

  for (const file of commandFiles) {
    const command = require(path.join(commandsDir, file));
    client.commands.set(command.data.name, command);
  }
}

async function registerCommands(client) {
  if (!config.token) {
    throw new Error('DISCORD_TOKEN is required for slash command registration');
  }

  const rest = new REST({ version: '10' }).setToken(config.token);
  const slashCommands = Array.from(client.commands.values()).map(command => command.data.toJSON());
  const clientId = client.application?.id || config.clientId;

  if (!clientId) {
    throw new Error('CLIENT_ID is required for slash command registration');
  }

  if (config.guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, config.guildId), { body: slashCommands });
    console.log(`Slash commands registered to guild ${config.guildId}`);
  } else {
    await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
    console.log('Slash commands registered globally');
  }
}

module.exports = { loadCommands, registerCommands };
