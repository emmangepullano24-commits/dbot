const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('Unlock the current channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    try {
      await interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: null });
      await interaction.editReply({ content: '🔓 Channel unlocked.' });
    } catch (error) {
      console.error('Unlock command error:', error);
      await interaction.editReply({ content: '❌ Failed to unlock channel.', flags: 64 });
    }
  }
};

