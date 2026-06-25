# Welcome System Guide

## Overview

ELIJAHSEC includes a comprehensive Welcome System that greets new members with customizable embeds and optional direct messages.

## Features

### 📢 Welcome Channel Messages
- Beautiful embed with member information
- Member avatar display
- Server icon display
- Member count
- Account creation date
- Join timestamp
- Customizable message with placeholders

### 📧 Optional DM to New Members
- Send personalized welcome DM
- Customizable message
- Server information included
- Graceful handling if DM fails

### 🎯 Auto-Role Assignment
- Automatically assign roles to new members
- Configurable per server
- Works alongside welcome messages

---

## Setup Instructions

### Step 1: Set Welcome Channel

```
/welcome-setup channel: #welcome
```

This sets the channel where welcome messages will be posted.

### Step 2: Customize Welcome Message (Optional)

```
/welcome-setup message: Welcome {user} to {server}! We're excited to have you here! 🎉
```

**Placeholders:**
- `{user}` - Mentions the new member (e.g., @John)
- `{server}` - Server name (e.g., My Awesome Server)

**Default message:** `Welcome {user} to {server}!`

### Step 3: Enable Welcome DM (Optional)

```
/welcome-setup dm: true
```

This enables sending a welcome DM to new members.

### Step 4: Customize DM Message (Optional)

```
/welcome-setup dm-message: Hey {user}! Welcome to {server}. We're glad you joined us! 💙
```

**Placeholders:**
- `{user}` - Member's username
- `{server}` - Server name

**Default message:** `Welcome to {server}!`

### Step 5: Set Auto-Role (Optional)

```
/autorole-setup set: @Member
```

This automatically assigns the "Member" role to new members.

---

## View Current Settings

### View Welcome Settings
```
/welcome-setup view
```

Shows:
- Welcome channel
- Welcome message
- DM enabled status
- DM message
- Available placeholders

### View Auto-Role Settings
```
/autorole-setup view
```

Shows:
- Current auto-role
- Description

---

## Example Setup

### Complete Setup Example

1. **Set welcome channel:**
   ```
   /welcome-setup channel: #welcome
   ```

2. **Customize message:**
   ```
   /welcome-setup message: 🎉 Welcome {user} to {server}! 
   
   We're excited to have you join our community. Make sure to read the rules and introduce yourself!
   ```

3. **Enable DM:**
   ```
   /welcome-setup dm: true
   ```

4. **Set DM message:**
   ```
   /welcome-setup dm-message: Hey {user}! 👋
   
   Welcome to {server}! We're glad you're here. If you have any questions, feel free to ask in #general.
   ```

5. **Set auto-role:**
   ```
   /autorole-setup set: @Member
   ```

---

## Welcome Embed Display

When a new member joins, they'll see an embed like this:

```
┌─────────────────────────────────────┐
│ 🎉 Welcome to the Server!           │
│                                     │
│ Welcome @John to My Server!         │
│                                     │
│ [Member Avatar]                     │
│                                     │
│ 👤 Member: John#1234       │ 📊 Member Count: 42    │
│ 📅 Account Created: 2 years ago     │
│ 🚪 Joined Server: just now          │
│                                     │
│ [Server Icon]                       │
│                                     │
│ My Server • Member #42              │
└─────────────────────────────────────┘
```

---

## Troubleshooting

### Welcome messages not appearing?

1. **Check channel permissions:**
   - Bot must have `Send Messages` permission in the welcome channel
   - Bot must have `Embed Links` permission

2. **Check if welcome is configured:**
   ```
   /welcome-setup view
   ```
   Make sure a channel is set.

3. **Check bot role:**
   - Bot role must be high enough in the role hierarchy
   - Bot must have `Send Messages` permission

### DM not being sent?

1. **Check if DM is enabled:**
   ```
   /welcome-setup view
   ```

2. **Member may have DMs disabled:**
   - Some members disable DMs from server members
   - This is not an error - the bot will silently skip the DM

3. **Check bot permissions:**
   - Bot needs `Send Messages` permission (global)

### Auto-role not being assigned?

1. **Check if auto-role is set:**
   ```
   /autorole-setup view
   ```

2. **Check role permissions:**
   - Bot role must be higher than the auto-role in the role hierarchy
   - Bot must have `Manage Roles` permission

3. **Check role exists:**
   - The role may have been deleted
   - Run `/autorole-setup view` to verify

---

## Customization Tips

### Make it Personal

Use the placeholders to create personalized messages:

```
/welcome-setup message: Hey {user}! 👋 Welcome to {server}! 
We're a community of [X] members who love [topic]. 
Check out #introductions to say hi!
```

### Add Emojis

Make your welcome message more engaging:

```
/welcome-setup message: 🎉 {user} just joined {server}! 🎉
Welcome aboard! 🚀
```

### Multiple Roles

If you want to assign multiple roles, you can:
1. Create a "Member" role that includes other roles
2. Or use the auto-role for the main role and manually assign others

---

## Database Models

### Welcome Schema
```javascript
{
  guildId: String,           // Server ID
  channelId: String,         // Welcome channel ID
  message: String,           // Welcome message template
  dmEnabled: Boolean,        // DM enabled?
  dmMessage: String          // DM message template
}
```

### AutoRole Schema
```javascript
{
  guildId: String,           // Server ID
  roleId: String             // Role to assign
}
```

---

## Best Practices

✅ **Do:**
- Set a welcome channel for visibility
- Use placeholders for personalization
- Enable DM for direct communication
- Set auto-role for new member identification
- Keep messages friendly and welcoming

❌ **Don't:**
- Use overly long messages (keep it concise)
- Spam with too many emojis
- Require DM responses (members may have DMs disabled)
- Set auto-role too high in hierarchy (may cause issues)

---

## Support

If you encounter issues:
1. Check the bot logs in Railway
2. Verify all permissions are set correctly
3. Make sure the bot role is high enough in the hierarchy
4. Try `/welcome-setup view` to verify settings

