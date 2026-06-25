const { SlashCommandBuilder, PermissionFlagsBits, ChannelSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const Welcome = require('../database/models/Welcome');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('welcome-setup')
    .setDescription('Configure the welcome system')
    .addSubcommand(sub =>
      sub
        .setName('channel')
        .setDescription('Set the welcome message channel')
        .addChannelOption(option =>
          option
            .setName('channel')
            .setDescription('Channel for welcome messages')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('message')
        .setDescription('Set the welcome message')
        .addStringOption(option =>
          option
            .setName('message')
            .setDescription('Welcome message (use {user} and {server} as placeholders)')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('dm')
        .setDescription('Enable/disable welcome DM')
        .addBooleanOption(option =>
          option
            .setName('enabled')
            .setDescription('Enable welcome DM?')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('dm-message')
        .setDescription('Set the welcome DM message')
        .addStringOption(option =>
          option
            .setName('message')
            .setDescription('DM message (use {user} and {server} as placeholders)')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('view')
        .setDescription('View current welcome settings')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();
      let welcome = await Welcome.findOne({ guildId: interaction.guildId });

      if (!welcome) {
        welcome = new Welcome({ guildId: interaction.guildId });
      }

      if (subcommand === 'channel') {
        const channel = interaction.options.getChannel('channel');
        welcome.channelId = channel.id;
        await welcome.save();
        await interaction.editReply({
          content: `✅ Welcome channel set to ${channel}`
        });
      }

      if (subcommand === 'message') {
        const message = interaction.options.getString('message');
        welcome.message = message;
        await welcome.save();
        await interaction.editReply({
          content: `✅ Welcome message updated:\n\`\`\`\n${message}\n\`\`\``
        });
      }

      if (subcommand === 'dm') {
        const enabled = interaction.options.getBoolean('enabled');
        welcome.dmEnabled = enabled;
        await welcome.save();
        await interaction.editReply({
          content: `✅ Welcome DM ${enabled ? '✅ enabled' : '❌ disabled'}`
        });
      }

      if (subcommand === 'dm-message') {
        const message = interaction.options.getString('message');
        welcome.dmMessage = message;
        await welcome.save();
        await interaction.editReply({
          content: `✅ Welcome DM message updated:\n\`\`\`\n${message}\n\`\`\``
        });
      }

      if (subcommand === 'view') {
        const channelName = welcome.channelId 
          ? `<#${welcome.channelId}>` 
          : 'Not set';

        const viewEmbed = {
          color: 0x00ff88,
          title: '📋 Welcome System Settings',
          fields: [
            {
              name: '📢 Welcome Channel',
              value: channelName,
              inline: false
            },
            {
              name: '💬 Welcome Message',
              value: `\`\`\`\n${welcome.message}\n\`\`\``,
              inline: false
            },
            {
              name: '📧 DM Enabled',
              value: welcome.dmEnabled ? '✅ Yes' : '❌ No',
              inline: true
            },
            {
              name: '📧 DM Message',
              value: `\`\`\`\n${welcome.dmMessage}\n\`\`\``,
              inline: false
            },
            {
              name: '📝 Placeholders',
              value: '`{user}` - Mentions the new member\n`{server}` - Server name',
              inline: false
            }
          ],
          footer: {
            text: 'ELIJAHSEC • Welcome System'
          }
        };

        await interaction.editReply({ embeds: [viewEmbed] });
      }
    } catch (error) {
      console.error('Welcome-setup command error:', error);
      await interaction.editReply({
        content: '❌ Failed to update welcome settings.',
        flags: 64
      });
    }
  }
};

