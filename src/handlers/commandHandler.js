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

  try {
    if (config.guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, config.guildId), { body: slashCommands });
      console.log(`✓ Slash commands registered to guild ${config.guildId} (${slashCommands.length} commands)`);
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
      console.log(`✓ Slash commands registered globally (${slashCommands.length} commands)`);
    }
  } catch (error) {
    if (error.code === 50001) {
      console.error('❌ Missing Access: Bot lacks "applications.commands" scope');
      console.error('Fix: Re-invite bot with OAuth2 scopes: "bot" + "applications.commands"');
      console.error('URL: https://discord.com/api/oauth2/authorize?client_id=' + clientId + '&scope=bot%20applications.commands&permissions=0');
    } else if (error.code === 50013) {
      console.error('❌ Missing Permissions: Bot lacks required permissions in the guild');
    } else {
      console.error('❌ Failed to register slash commands:', error.message);
    }
    throw error;
  }
}

module.exports = { loadCommands, registerCommands };

