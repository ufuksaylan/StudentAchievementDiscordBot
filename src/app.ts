import express from 'express';
import messages from './modules/messages/controller';
import users from './modules/users/controller';
import templates from './modules/templatess/controller';
import sprints from './modules/sprints/controller';
import jsonErrorHandler from './middleware/jsonErrors';
import { type Database } from './database';
import Discord from './modules/discord/discord';
import { GatewayIntentBits } from 'discord.js';

export default function createApp(
  db: Database,
  discordClient: Discord = new Discord({
    intents: [GatewayIntentBits.Guilds],
  })
) {
  const app = express();

  app.use(express.json());

  app.use('/messages', messages(db, discordClient));
  app.use('/sprints', sprints(db));
  app.use('/users', users(db));
  app.use('/templates', templates(db));

  app.use(jsonErrorHandler);

  return app;
}
