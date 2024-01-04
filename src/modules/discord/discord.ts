import {
  Client,
  ClientOptions,
  Guild,
  TextChannel,
  GuildMember,
} from 'discord.js';
import 'dotenv/config';
import { sendAccomplishment } from './utils';

export default class Discord extends Client {
  private _guild: Guild | null = null;
  private _channel: TextChannel | null = null;

  constructor(options: ClientOptions, guildId: string = process.env.GUILD_ID!) {
    super(options);
  }

  set guild(guild: Guild) {
    this._guild = guild;
  }

  get guild(): Guild {
    return this._guild!;
  }

  set channel(channel: TextChannel) {
    this._channel = channel;
  }

  get channel(): TextChannel {
    return this._channel!;
  }

  getUserByUserName(username: string) {
    const user = this.guild.members.cache.find(
      (member) => member.user.username === username
    );

    if (!user) {
      throw new Error(`User not found: ${username}`);
    }

    return user;
  }

  sendAccomplishment(
    user: GuildMember,
    sprintName: string,
    gifUrl: string,
    template: string
  ) {
    this.channel.send({
      content: `${user} has just completed the ${sprintName}!\n${template}`,
      files: [
        {
          attachment: `${gifUrl}`,
          name: 'congratulations.gif',
        },
      ],
    });
  }
}
