const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (interaction.isButton()) {
      try {
        if (interaction.customId === 'ticket:create') {
          await interaction.deferReply({ ephemeral: true });
          
          const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: 0,
            parent: process.env.TICKET_CATEGORY_ID || null,
            permissionOverwrites: [
              { id: interaction.guild.id, deny: ['ViewChannel'] },
              { id: interaction.user.id, allow: ['ViewChannel', 'SendMessages'] }
            ]
          });

          const embed = new EmbedBuilder()
            .setColor('#00d4ff')
            .setTitle('Ticket Opened')
            .setDescription(`Your support ticket is ready: ${channel}`);

          await interaction.editReply({ embeds: [embed] });
        }

        if (interaction.customId.startsWith('help:')) {
          const pages = {
            'help:moderation': 'Moderation tools include /ban, /kick, /timeout, /warn, /warnings, and /clearwarnings.',
            'help:security': 'Security tools include anti-link, anti-invite, anti-spam, anti-raid, lockdown, and logging.',
            'help:tickets': 'Tickets can be opened with the panel, managed with /add, /remove, /claim, /rename, and /close.',
            'help:stats': 'Statistics are available through the live dashboard and the logging system.'
          };

          const embed = new EmbedBuilder()
            .setColor('#00d4ff')
            .setTitle('ELIJAHSEC Feature')
            .setDescription(pages[interaction.customId]);

          await interaction.reply({ embeds: [embed], flags: 64 }); // flags: 64 = ephemeral
        }
      } catch (error) {
        console.error('Button interaction error:', error);
        try {
          if (interaction.replied || interaction.deferred) {
            await interaction.editReply({ content: '❌ An error occurred.' });
          } else {
            await interaction.reply({ content: '❌ An error occurred.', flags: 64 });
          }
        } catch (e) {
          console.error('Failed to send error message:', e);
        }
      }
      return;
    }

    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      console.warn(`Command not found: ${interaction.commandName}`);
      return;
    }

    try {
      // Defer reply immediately to avoid timeout
      await interaction.deferReply();
      
      // Execute command
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing command ${interaction.commandName}:`, error);
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.editReply({ 
            content: '❌ An error occurred while running this command.',
            embeds: [],
            components: []
          });
        } else {
          await interaction.reply({ 
            content: '❌ An error occurred while running this command.',
            flags: 64 
          });
        }
      } catch (e) {
        console.error('Failed to send error message:', e);
      }
    }
  }
};

