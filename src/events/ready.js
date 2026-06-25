const { registerCommands } = require('../handlers/commandHandler');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    try {
      console.log(`\n🚀 ELIJAHSEC is starting up...`);
      console.log(`📡 Connected as ${client.user.tag}`);
      console.log(`📦 Loaded ${client.commands.size} commands\n`);
      
      await registerCommands(client);
      
      client.user.setActivity({ name: 'ELIJAHSEC • Live Security', type: 3 });
      console.log(`\n✅ ELIJAHSEC is ready for live protection!\n`);
    } catch (error) {
      console.error('\n❌ Error during startup:', error.message);
      console.error('⚠️  Bot is running but slash commands may not be available.\n');
    }
  }
};

