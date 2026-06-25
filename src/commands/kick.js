const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a member')
    .addUserOption(option => option.setName('user').setDescription('User to kick').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  async execute(interaction) {
    try {
      const target = interaction.options.getMember('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      if (!target) {
        return await interaction.editReply({ content: '❌ User not found.', flags: 64 });
      }
      if (!target.kickable) {
        return await interaction.editReply({ content: '❌ I cannot kick that user.', flags: 64 });
      }

      await target.kick(reason);
      await interaction.editReply({ content: `✅ Kicked ${target.user.tag} for: ${reason}` });
    } catch (error) {
      console.error('Kick command error:', error);
      await interaction.editReply({ content: '❌ Failed to kick user.', flags: 64 });
    }
  }
};

