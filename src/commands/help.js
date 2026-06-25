const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('View the ELIJAHSEC dashboard'),
  async execute(interaction) {
    try {
      const embed = new EmbedBuilder()
        .setColor('#00d4ff')
        .setTitle('ELIJAHSEC Dashboard')
        .setDescription('Secure moderation, live protection, and smart support tools for your server.')
        .addFields(
          { name: 'Moderation', value: '/ban, /kick, /timeout, /warn, /warnings, /clearwarnings' },
          { name: 'Security', value: 'Anti-link, anti-invite, anti-spam, anti-raid, lockdown' },
          { name: 'Tickets', value: '/ticket-panel, /close, /add, /remove, /claim, /rename' },
          { name: 'Suggestions', value: '/suggest and live reaction buttons' }
        )
        .setFooter({ text: 'ELIJAHSEC • Live Protection' });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('help:moderation').setLabel('Moderation').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('help:security').setLabel('Security').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('help:tickets').setLabel('Tickets').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('help:stats').setLabel('Statistics').setStyle(ButtonStyle.Danger)
      );

      await interaction.editReply({ embeds: [embed], components: [row] });
    } catch (error) {
      console.error('Help command error:', error);
      await interaction.editReply({ content: '❌ Failed to load help.', flags: 64 });
    }
  }
};

