# ELIJAHSEC Discord Bot - Setup Instructions

## ⚠️ If Slash Commands Are Not Showing

### Step 1: Re-invite Your Bot with Correct Scopes

Your bot needs the `applications.commands` OAuth2 scope to register slash commands.

**Option A: Automatic (Recommended)**
1. Check the bot logs - you'll see a URL like:
   ```
   https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot%20applications.commands&permissions=1099511627775
   ```
2. Copy and paste this URL into your browser
3. Select your server and authorize

**Option B: Manual**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to **OAuth2** → **URL Generator**
4. Select these **Scopes**:
   - ✅ `bot`
   - ✅ `applications.commands`
5. Select these **Permissions**:
   - ✅ Send Messages
   - ✅ Embed Links
   - ✅ Read Message History
   - ✅ Manage Channels
   - ✅ Manage Roles
   - ✅ Moderate Members
   - ✅ Ban Members
   - ✅ Kick Members
   - ✅ Manage Messages
   - ✅ Manage Webhooks
6. Copy the generated URL and open it in your browser
7. Select your server and authorize

### Step 2: Restart the Bot

After re-inviting:
1. Redeploy the bot on Railway
2. Wait for it to start
3. Check the logs - you should see:
   ```
   ✅ Slash commands registered to guild [GUILD_ID]
   ✅ Successfully registered 17 commands:
      • /ban
      • /kick
      • /timeout
      • /warn
      • /warnings
      • /clearwarnings
      • /help
      • /status
      • /ticket-panel
      • /close
      • /add
      • /remove
      • /claim
      • /rename
      • /lockdown
      • /unlock
      • /suggest
   ```

### Step 3: Test in Discord

1. Open your Discord server
2. Type `/` in any channel
3. You should see all ELIJAHSEC commands appear
4. Click on any command to use it

---

## 🔧 Environment Variables Required

Make sure these are set in Railway:

```
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here
GUILD_ID=your_server_id_here (optional, for guild-specific commands)
MONGODB_URI=your_mongodb_connection_string
OWNER_ID=your_discord_user_id
WELCOME_CHANNEL_ID=channel_id_for_welcome_messages
MOD_LOG_CHANNEL_ID=channel_id_for_moderation_logs
TICKET_CATEGORY_ID=category_id_for_tickets
SUGGESTION_CHANNEL_ID=channel_id_for_suggestions
ANTI_LINK_WHITELIST=example.com,trusted-site.com (comma-separated)
```

---

## 📋 Features

### Moderation
- `/ban` - Ban a member
- `/kick` - Kick a member
- `/timeout` - Timeout a member
- `/warn` - Warn a member
- `/warnings` - View member warnings
- `/clearwarnings` - Clear member warnings

### Tickets
- `/ticket-panel` - Create a ticket panel
- `/close` - Close current ticket
- `/add` - Add user to ticket
- `/remove` - Remove user from ticket
- `/claim` - Claim a ticket
- `/rename` - Rename ticket channel

### Security
- `/lockdown` - Lock down a channel
- `/unlock` - Unlock a channel
- Anti-link detection
- Anti-invite detection
- Anti-spam detection
- Anti-raid protection

### Other
- `/help` - View bot dashboard
- `/status` - Show bot status
- `/suggest` - Submit a suggestion

---

## 🐛 Troubleshooting

### Commands still not showing?
1. **Check bot permissions**: Make sure bot has "Manage Guild" and "Use Application Commands" permissions
2. **Check bot role**: Bot role should be high enough in the role hierarchy
3. **Wait a few minutes**: Discord sometimes takes time to sync commands
4. **Clear Discord cache**: Close Discord completely and reopen it
5. **Check logs**: Look at Railway logs for error messages

### Commands show but don't work?
1. Check that bot has required permissions for each command
2. Make sure MongoDB is connected (check logs for connection status)
3. Check that all environment variables are set correctly

### Still having issues?
Check the bot logs in Railway for detailed error messages and share them for debugging.

