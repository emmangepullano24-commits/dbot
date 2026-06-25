const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Ticket = require('../database/models/Ticket');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('claim')
    .setDescription('Assign yourself to the current ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    try {
      try {
        const ticket = await Ticket.findOne({ guildId: interaction.guildId, channelId: interaction.channelId });
        if (!ticket) {
          return await interaction.editReply({ content: '❌ This channel is not a ticket.', flags: 64 });
        }

        ticket.assignedTo = interaction.user.id;
        await ticket.save();
      } catch (dbError) {
        console.warn('Failed to claim ticket in database:', dbError.message);
      }

      await interaction.editReply({ content: `✅ You are now assigned to this ticket.` });
    } catch (error) {
      console.error('Claim command error:', error);
      await interaction.editReply({ content: '❌ Failed to claim ticket.', flags: 64 });
    }
  }
};

