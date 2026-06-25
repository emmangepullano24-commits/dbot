const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Warning = require('../database/models/Warning');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('View warnings for a user')
    .addUserOption(option => option.setName('user').setDescription('User to inspect').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const target = interaction.options.getUser('user');
    if (!target) return interaction.reply({ content: 'User not found.', ephemeral: true });

    const warnings = await Warning.find({ guildId: interaction.guildId, userId: target.id });
    const list = warnings.length ? warnings.map((w, i) => `${i + 1}. ${w.reason}`).join('\n') : 'No warnings found.';
    await interaction.reply({ content: `Warnings for ${target.tag}:\n${list}`, ephemeral: false });
  }
};

