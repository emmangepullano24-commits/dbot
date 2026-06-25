const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lockdown')
    .setDescription('Lock down the current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    try {
      await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false });
      await interaction.editReply({ content: '🔒 Channel locked down.' });
    } catch (error) {
      console.error('Lockdown command error:', error);
      await interaction.editReply({ content: '❌ Failed to lock down channel.', flags: 64 });
    }
  }
};

