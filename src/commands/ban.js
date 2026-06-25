const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warning = require('../database/models/Warning');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a member')
    .addUserOption(option => option.setName('user').setDescription('User to ban').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reason').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    try {
      const target = interaction.options.getMember('user');
      const reason = interaction.options.getString('reason') || 'No reason provided';

      if (!target) {
        return await interaction.editReply({ content: '❌ User not found.', flags: 64 });
      }
      if (!target.bannable) {
        return await interaction.editReply({ content: '❌ I cannot ban that user.', flags: 64 });
      }

      await target.ban({ reason });
      
      // Try to log to database, but don't fail if it doesn't work
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

      await interaction.editReply({ content: `✅ Banned ${target.user.tag} for: ${reason}` });
    } catch (error) {
      console.error('Ban command error:', error);
      await interaction.editReply({ content: '❌ Failed to ban user.', flags: 64 });
    }
  }
};

