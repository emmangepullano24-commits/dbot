const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Show ELIJAHSEC live status'),
  async execute(interaction) {
    try {
      const embed = new EmbedBuilder()
        .setColor('#00d4ff')
        .setTitle('ELIJAHSEC Status')
        .setDescription('The bot is online and ready for live protection.')
        .addFields(
          { name: 'Guild', value: interaction.guild.name },
          { name: 'Members', value: `${interaction.guild.memberCount}` },
          { name: 'Uptime', value: 'Live' }
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Status command error:', error);
      await interaction.editReply({ content: '❌ Failed to get status.', flags: 64 });
    }
  }
};

