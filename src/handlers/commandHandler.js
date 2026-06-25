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
    console.log(`📝 Registering ${slashCommands.length} slash commands...`);
    
    if (config.guildId) {
      await rest.put(Routes.applicationGuildCommands(clientId, config.guildId), { body: slashCommands });
      console.log(`✅ Slash commands registered to guild ${config.guildId}`);
    } else {
      await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
      console.log(`✅ Slash commands registered globally`);
    }
    
    console.log(`✅ Successfully registered ${slashCommands.length} commands:`);
    slashCommands.forEach(cmd => console.log(`   • /${cmd.name}`));
    
  } catch (error) {
    console.error('❌ Failed to register slash commands');
    
    if (error.code === 50001) {
      console.error('\n⚠️  ERROR: Missing Access - Bot lacks "applications.commands" scope');
      console.error('\n🔧 FIX: Re-invite your bot with the correct OAuth2 scopes:');
      console.error(`\n📋 Copy this URL and open it in your browser:\n`);
      console.error(`https://discord.com/api/oauth2/authorize?client_id=${clientId}&scope=bot%20applications.commands&permissions=1099511627775`);
      console.error('\n✅ After re-inviting, restart the bot and commands will register automatically.\n');
    } else if (error.code === 50013) {
      console.error('⚠️  ERROR: Missing Permissions - Bot lacks required permissions in the guild');
    } else if (error.status === 401) {
      console.error('⚠️  ERROR: Unauthorized - Invalid bot token');
    } else {
      console.error(`⚠️  ERROR: ${error.message}`);
    }
    
    // Don't throw - allow bot to continue running even if commands fail to register
    console.error('\n⚠️  Bot will continue running, but slash commands may not be available.');
  }
}

module.exports = { loadCommands, registerCommands };

