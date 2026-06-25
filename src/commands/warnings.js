const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warning = require('../database/models/Warning');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a user')
    .addUserOption(option => option.setName('user').setDescription('User to inspect').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    try {
      const target = interaction.options.getUser('user');
      if (!target) {
        return await interaction.editReply({ content: '❌ User not found.', flags: 64 });
      }

      try {
        const warnings = await Warning.find({ guildId: interaction.guildId, userId: target.id });
        const list = warnings.length ? warnings.map((w, i) => `${i + 1}. ${w.reason}`).join('\n') : 'No warnings found.';
        await interaction.editReply({ content: `📋 Warnings for ${target.tag}:\n${list}` });
      } catch (dbError) {
        console.warn('Failed to fetch warnings from database:', dbError.message);
        await interaction.editReply({ content: `📋 Warnings for ${target.tag}:\nNo warnings found (database unavailable).` });
      }
    } catch (error) {
      console.error('Warnings command error:', error);
      await interaction.editReply({ content: '❌ Failed to fetch warnings.', flags: 64 });
    }
  }
};

