const { EmbedBuilder } = require('discord.js');
const GuildSettings = require('../database/models/GuildSettings');
const AutoRole = require('../database/models/AutoRole');
const Welcome = require('../database/models/Welcome');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member, client) {
    try {
      // Auto-role assignment
      try {
        const autoRole = await AutoRole.findOne({ guildId: member.guild.id });
        if (autoRole?.roleId) {
          const role = member.guild.roles.cache.get(autoRole.roleId);
          if (role) {
            await member.roles.add(role).catch(err => {
              console.warn(`Failed to add auto-role to ${member.user.tag}:`, err.message);
            });
          }
        }
      } catch (dbError) {
        console.warn('Failed to fetch auto-role settings:', dbError.message);
      }

      // Welcome message
      try {
        const welcome = await Welcome.findOne({ guildId: member.guild.id });
        
        if (welcome?.channelId) {
          const channel = member.guild.channels.cache.get(welcome.channelId);
          
          if (channel) {
            // Create welcome embed
            const accountCreatedTimestamp = Math.floor(member.user.createdTimestamp / 1000);
            const joinedTimestamp = Math.floor(member.joinedTimestamp / 1000);
            
            const embed = new EmbedBuilder()
              .setColor('#00ff88')
              .setTitle('🎉 Welcome to the Server!')
              .setDescription(
                welcome.message
                  .replace('{user}', `<@${member.id}>`)
                  .replace('{server}', member.guild.name)
              )
              .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
              .addFields(
                { 
                  name: '👤 Member', 
                  value: `${member.user.tag}`, 
                  inline: true 
                },
                { 
                  name: '📊 Member Count', 
                  value: `${member.guild.memberCount}`, 
                  inline: true 
                },
                { 
                  name: '📅 Account Created', 
                  value: `<t:${accountCreatedTimestamp}:R>`, 
                  inline: true 
                },
                { 
                  name: '🚪 Joined Server', 
                  value: `<t:${joinedTimestamp}:R>`, 
                  inline: true 
                }
              )
              .setImage(member.guild.iconURL({ dynamic: true, size: 256 }))
              .setFooter({ 
                text: `${member.guild.name} • Member #${member.guild.memberCount}`, 
                iconURL: member.guild.iconURL({ dynamic: true }) 
              })
              .setTimestamp();

            await channel.send({ embeds: [embed] }).catch(err => {
              console.warn(`Failed to send welcome message to ${channel.name}:`, err.message);
            });
          }
        }

        // Send DM if enabled
        if (welcome?.dmEnabled) {
          try {
            const dmEmbed = new EmbedBuilder()
              .setColor('#00d4ff')
              .setTitle(`Welcome to ${member.guild.name}!`)
              .setDescription(
                welcome.dmMessage
                  .replace('{user}', member.user.username)
                  .replace('{server}', member.guild.name)
              )
              .setThumbnail(member.guild.iconURL({ dynamic: true, size: 256 }))
              .addFields(
                { 
                  name: '📊 Server Members', 
                  value: `${member.guild.memberCount}`, 
                  inline: true 
                },
                { 
                  name: '📅 Account Created', 
                  value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, 
                  inline: true 
                }
              )
              .setFooter({ 
                text: member.guild.name, 
                iconURL: member.guild.iconURL({ dynamic: true }) 
              })
              .setTimestamp();

            await member.send({ embeds: [dmEmbed] }).catch(err => {
              console.warn(`Failed to send DM to ${member.user.tag}:`, err.message);
            });
          } catch (dmError) {
            console.warn(`DM error for ${member.user.tag}:`, dmError.message);
          }
        }
      } catch (dbError) {
        console.warn('Failed to fetch welcome settings:', dbError.message);
      }
    } catch (error) {
      console.error('Error in guildMemberAdd event:', error);
    }
  }
};

