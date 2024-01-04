import { GatewayIntentBits } from 'discord.js';
import Discord from './discord';
import * as utils from './utils';

export default function (
  guildId: string = process.env.GUILD_ID!,
  channelName: string = 'accomplishments'
): Discord {
  const discord = new Discord({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  });

  discord.on('ready', async () => {
    const guild = utils.getGuild(discord, guildId);
    const channel = utils.getChannel(guild, channelName);

    discord.guild = guild;
    discord.channel = channel;
  });

  discord.on('messageCreate', async (message) => {
    if (message.content === 'ping') {
      message.reply({
        content: `${discord.channel.name} ${discord.guild.name}}`,
      });
    }
  });

  discord.on('message', function (message) {
    message.channel.send('My Message');
  });

  return discord;
}
