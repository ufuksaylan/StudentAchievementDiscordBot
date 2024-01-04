import { Guild, TextChannel, User } from 'discord.js';
import 'dotenv/config';
import Discord from './discord';

export function getGuild(
  client: Discord,
  guildId: string = process.env.GUILD_ID!
): Guild {
  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    throw new Error(`Guild not found: ${guildId}`);
  }

  return guild;
}

export function getChannel(
  guild: Guild,
  channelName: string = 'accomplishments'
): TextChannel {
  const channel = guild.channels.cache.find(
    (channel) => channel.name === channelName
  );

  if (!channel || !(channel instanceof TextChannel)) {
    throw new Error(`Channel not found: ${channelName}`);
  }

  return channel;
}

export function getUserByUserName(username: string, guild: Guild) {
  const user = guild.members.cache.find(
    (member) => member.user.username === username
  );

  if (!user) {
    throw new Error(`User not found: ${username}`);
  }

  return user;
}

export function sendAccomplishment(user: User, guild: Guild, message: string) {
  const channel = getChannel(guild);
  return channel.send(`${user} ${message}`);
}
