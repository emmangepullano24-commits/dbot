# ELIJAHSEC Discord Security Bot

ELIJAHSEC is a production-grade Discord moderation and security bot built with Node.js 22, Discord.js v14, and MongoDB Atlas. It supports slash commands only, modular handlers, automatic command registration, and deployment on Railway.

## Features
- Moderation: /ban, /kick, /timeout, /warn, /warnings, /clearwarnings
- Logging: joins, leaves, bans, kicks, timeouts, warns, deletes, edits, ticket events, anti-raid events
- Welcome system with embeds, optional DM, member count, account age, avatar and server icon
- Automatic role assignment
- Ticket system with transcripts and MongoDB persistence
- Anti-link, anti-invite, anti-spam, and advanced anti-raid protections
- Lockdown system with /lockdown and /unlock
- Suggestions with upvote/downvote buttons
- Premium-style help dashboard with interactive buttons

## Project Structure
- src/index.js — entry point
- src/commands — slash commands
- src/events — Discord event handlers
- src/handlers — feature and command-loading logic
- src/database/models — MongoDB models
- src/utils — shared helpers

## Installation
1. Install Node.js 22+
2. Run npm install
3. Copy .env.example to .env and fill the values
4. Run npm start

## Railway Deployment
1. Create a new Railway project
2. Connect the repository
3. Set the environment variables from .env.example
4. Deploy

## Database
Create a MongoDB Atlas cluster and provide the connection string in MONGODB_URI.

## Notes
- The bot uses slash commands only.
- Command registration is automatic on startup.
- All security events are logged to MongoDB.
