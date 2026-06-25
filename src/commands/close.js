const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Ticket = require('../database/models/Ticket');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('close')
    .setDescription('Close the current ticket')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    try {
      try {
        const ticket = await Ticket.findOne({ guildId: interaction.guildId, channelId: interaction.channelId });
        if (!ticket) {
          return await interaction.editReply({ content: '❌ This channel is not a ticket.', flags: 64 });
        }

        ticket.status = 'closed';
        ticket.closedAt = new Date();
        await ticket.save();
      } catch (dbError) {
        console.warn('Failed to close ticket in database:', dbError.message);
      }

      await interaction.editReply({ content: '⏳ Closing ticket...' });
      
      // Delete channel after a short delay
      setTimeout(async () => {
        try {
          await interaction.channel.delete();
        } catch (e) {
          console.error('Failed to delete ticket channel:', e);
        }
      }, 1000);
    } catch (error) {
      console.error('Close command error:', error);
      await interaction.editReply({ content: '❌ Failed to close ticket.', flags: 64 });
    }
  }
};

