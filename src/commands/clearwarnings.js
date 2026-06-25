const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warning = require('../database/models/Warning');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription('Clear warnings for a user')
    .addUserOption(option => option.setName('user').setDescription('User to clear warnings for').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    try {
      const target = interaction.options.getUser('user');
      if (!target) {
        return await interaction.editReply({ content: '❌ User not found.', flags: 64 });
      }

      try {
        await Warning.deleteMany({ guildId: interaction.guildId, userId: target.id });
      } catch (dbError) {
        console.warn('Failed to clear warnings from database:', dbError.message);
      }

      await interaction.editReply({ content: `✅ Cleared warnings for ${target.tag}.` });
    } catch (error) {
      console.error('Clearwarnings command error:', error);
      await interaction.editReply({ content: '❌ Failed to clear warnings.', flags: 64 });
    }
  }
};

