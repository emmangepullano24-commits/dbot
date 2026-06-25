const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove a user from the current ticket')
    .addUserOption(option => option.setName('user').setDescription('User to remove').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    try {
      const target = interaction.options.getUser('user');
      if (!target) {
        return await interaction.editReply({ content: '❌ User not found.', flags: 64 });
      }

      await interaction.channel.permissionOverwrites.edit(target.id, { ViewChannel: false, SendMessages: false });
      await interaction.editReply({ content: `✅ Removed ${target.tag} from the ticket.` });
    } catch (error) {
      console.error('Remove command error:', error);
      await interaction.editReply({ content: '❌ Failed to remove user from ticket.', flags: 64 });
    }
  }
};

