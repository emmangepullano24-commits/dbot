const { SlashCommandBuilder } = require('discord.js');
const Suggestion = require('../database/models/Suggestion');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Submit a suggestion')
    .addStringOption(option => option.setName('suggestion').setDescription('Your suggestion').setRequired(true)),
  async execute(interaction) {
    try {
      const suggestion = interaction.options.getString('suggestion');
      const channel = interaction.guild.channels.cache.get(process.env.SUGGESTION_CHANNEL_ID) || interaction.channel;
      
      const message = await channel.send({ content: suggestion });
      
      try {
        await Suggestion.create({ 
          guildId: interaction.guildId, 
          messageId: message.id, 
          authorId: interaction.user.id, 
          content: suggestion 
        });
      } catch (dbError) {
        console.warn('Failed to save suggestion to database:', dbError.message);
      }

      await interaction.editReply({ content: '✅ Suggestion submitted.', flags: 64 });
    } catch (error) {
      console.error('Suggest command error:', error);
      await interaction.editReply({ content: '❌ Failed to submit suggestion.', flags: 64 });
    }
  }
};

