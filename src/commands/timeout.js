const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout a member')
    .addUserOption(option => option.setName('user').setDescription('User to timeout').setRequired(true))
    .addIntegerOption(option => option.setName('minutes').setDescription('Timeout duration in minutes').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    try {
      const target = interaction.options.getMember('user');
      const minutes = interaction.options.getInteger('minutes');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      if (!target) {
        return await interaction.editReply({ content: '❌ User not found.', flags: 64 });
      }

      const duration = minutes * 60 * 1000;
      await target.timeout(duration, reason);
      await interaction.editReply({ content: `✅ Timed out ${target.user.tag} for ${minutes} minute(s).` });
    } catch (error) {
      console.error('Timeout command error:', error);
      await interaction.editReply({ content: '❌ Failed to timeout user.', flags: 64 });
    }
  }
};

