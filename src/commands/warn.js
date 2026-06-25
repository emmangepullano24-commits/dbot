const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warning = require('../database/models/Warning');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warn a member')
    .addUserOption(option => option.setName('user').setDescription('User to warn').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    try {
      const target = interaction.options.getUser('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      if (!target) {
        return await interaction.editReply({ content: '❌ User not found.', flags: 64 });
      }

      try {
        await Warning.create({ 
          guildId: interaction.guildId, 
          userId: target.id, 
          moderatorId: interaction.user.id, 
          reason 
        });
      } catch (dbError) {
        console.warn('Failed to log warning to database:', dbError.message);
      }

      await interaction.editReply({ content: `✅ Warned ${target.tag} for: ${reason}` });
    } catch (error) {
      console.error('Warn command error:', error);
      await interaction.editReply({ content: '❌ Failed to warn user.', flags: 64 });
    }
  }
};

