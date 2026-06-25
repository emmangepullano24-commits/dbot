const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rename')
    .setDescription('Rename the current ticket channel')
    .addStringOption(option => option.setName('name').setDescription('New channel name').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    try {
      const newName = interaction.options.getString('name');
      const formattedName = newName.replace(/\s+/g, '-').toLowerCase();
      
      await interaction.channel.setName(formattedName);
      await interaction.editReply({ content: `✅ Renamed the ticket to ${newName}.` });
    } catch (error) {
      console.error('Rename command error:', error);
      await interaction.editReply({ content: '❌ Failed to rename ticket.', flags: 64 });
    }
  }
};

