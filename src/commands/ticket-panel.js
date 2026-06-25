const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-panel')
    .setDescription('Create a ticket panel')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction) {
    try {
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('ticket:create').setLabel('Open Ticket').setStyle(ButtonStyle.Primary)
      );

      await interaction.channel.send({ content: 'Click the button below to open a support ticket.', components: [row] });
      await interaction.editReply({ content: '✅ Ticket panel created.', flags: 64 });
    } catch (error) {
      console.error('Ticket-panel command error:', error);
      await interaction.editReply({ content: '❌ Failed to create ticket panel.', flags: 64 });
    }
  }
};

