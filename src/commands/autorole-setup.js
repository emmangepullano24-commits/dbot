const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const AutoRole = require('../database/models/AutoRole');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('autorole-setup')
    .setDescription('Configure automatic role assignment')
    .addSubcommand(sub =>
      sub
        .setName('set')
        .setDescription('Set the auto-role')
        .addRoleOption(option =>
          option
            .setName('role')
            .setDescription('Role to assign automatically')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('remove')
        .setDescription('Remove auto-role')
    )
    .addSubcommand(sub =>
      sub
        .setName('view')
        .setDescription('View current auto-role settings')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();
      let autoRole = await AutoRole.findOne({ guildId: interaction.guildId });

      if (subcommand === 'set') {
        const role = interaction.options.getRole('role');
        
        if (!autoRole) {
          autoRole = new AutoRole({ guildId: interaction.guildId });
        }
        
        autoRole.roleId = role.id;
        await autoRole.save();
        
        await interaction.editReply({
          content: `✅ Auto-role set to ${role}\n\nNew members will automatically receive this role when they join.`
        });
      }

      if (subcommand === 'remove') {
        if (autoRole) {
          await AutoRole.deleteOne({ guildId: interaction.guildId });
          await interaction.editReply({
            content: '✅ Auto-role removed. New members will no longer receive automatic roles.'
          });
        } else {
          await interaction.editReply({
            content: '❌ No auto-role is currently set.',
            flags: 64
          });
        }
      }

      if (subcommand === 'view') {
        if (!autoRole || !autoRole.roleId) {
          await interaction.editReply({
            content: '❌ No auto-role is currently set.',
            flags: 64
          });
          return;
        }

        const role = interaction.guild.roles.cache.get(autoRole.roleId);
        const roleName = role ? role.toString() : 'Role not found';

        const viewEmbed = {
          color: 0x00ff88,
          title: '🎯 Auto-Role Settings',
          fields: [
            {
              name: '👤 Auto-Role',
              value: roleName,
              inline: false
            },
            {
              name: '📝 Description',
              value: 'This role is automatically assigned to new members when they join the server.',
              inline: false
            }
          ],
          footer: {
            text: 'ELIJAHSEC • Auto-Role System'
          }
        };

        await interaction.editReply({ embeds: [viewEmbed] });
      }
    } catch (error) {
      console.error('Autorole-setup command error:', error);
      await interaction.editReply({
        content: '❌ Failed to update auto-role settings.',
        flags: 64
      });
    }
  }
};

