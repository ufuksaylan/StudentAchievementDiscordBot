import 'dotenv/config';
import createApp from './app';
import createDatabase from './database';
import initializeUserDatabase from './addAllUsers';
import Discord from './modules/discord/discord';
import { GatewayIntentBits } from 'discord.js';
import initializeDiscord from './modules/discord';

const { DATABASE_URL } = process.env;
const PORT = 3000;

if (!DATABASE_URL) {
  throw new Error('Provide DATABASE_URL in your environment variables.');
}

// const discord = new Discord({
//   intents: [
//     GatewayIntentBits.Guilds,
//     GatewayIntentBits.GuildMessages,
//     GatewayIntentBits.MessageContent,
//     GatewayIntentBits.GuildMembers,
//   ],
// });

const discord = initializeDiscord();

// const discordClient = createDiscordClient();

const database = createDatabase(DATABASE_URL);
const app = createApp(database, discord);
initializeUserDatabase(database, discord);

// discordClient.login(process.env.DISCORD_BOT_ID);
discord.login(process.env.DISCORD_BOT_ID);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${PORT}`);
});
