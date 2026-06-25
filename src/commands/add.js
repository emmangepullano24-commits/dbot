const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Add a user to the current ticket')
    .addUserOption(option => option.setName('user').setDescription('User to add').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    try {
      const target = interaction.options.getUser('user');
      if (!target) {
        return await interaction.editReply({ content: '❌ User not found.', flags: 64 });
      }

      await interaction.channel.permissionOverwrites.edit(target.id, { ViewChannel: true, SendMessages: true });
      await interaction.editReply({ content: `✅ Added ${target.tag} to the ticket.` });
    } catch (error) {
      console.error('Add command error:', error);
      await interaction.editReply({ content: '❌ Failed to add user to ticket.', flags: 64 });
    }
  }
};

