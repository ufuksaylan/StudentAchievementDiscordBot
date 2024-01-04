import * as discordUtils from '@/modules/discord/utils';
import { type Database } from './database';
import buildRepository from '@/modules/users/repository';
import Discord from './modules/discord/discord';
export default function createApp(db: Database, discordClient: Discord) {
  discordClient.on('ready', async () => {
    const guild = discordUtils.getGuild(discordClient);
    const members = await guild.members.fetch();
    const users = buildRepository(db);

    const members1 = await Promise.all(
      members
        .filter((member) => !member.user.bot)
        .map((member) => {
          return member.user.username;
        })
        .map(async (username) => {
          return await users.create({ userName: username });
        })
    );

    const channel = discordUtils.getChannel(guild);
    console.log(channel);
  });
}
