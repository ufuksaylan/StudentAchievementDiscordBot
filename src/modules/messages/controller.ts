import { Router } from 'express';
import buildRepository from './repository';
import buildUserRepository from '../users/repository';
import buildSprintRepository from '../sprints/repository';
import buildTemplateRepository from '../templatess/repository';
import { jsonRoute } from '@/utils/middleware';
import { Database } from '@/database';
import NotFound from '@/utils/errors/NotFound';
import ApiError from '@/utils/errors/ApiError';
import * as schema from './schema';
import Discord from '@/modules/discord/discord';
import gifCreate from '@/modules/giphy/';
import * as userSchema from '../users/schema';
import * as sprintSchema from '../sprints/schema';

export default (db: Database, discordClient: Discord) => {
  const router = Router();
  const messages = buildRepository(db);
  const users = buildUserRepository(db);
  const sprints = buildSprintRepository(db);
  const templates = buildTemplateRepository(db);

  router
    .route('/')
    .get(
      // jsonRoute(async (req) => {
      //   const id = schema.parseId(req.params.id);
      //   const record = await users.findById(id);

      //   if (!record) {
      //     throw new NotFound('User not found');
      //   }

      //   return record;
      // })
      jsonRoute(async (req) => {
        const { userName, sprint } = req.query;

        if (!userName && !sprint) {
          const messageList = await messages.findAll();
          return messageList;
        }

        if (userName) {
          const user = await users.find(({ eb }) =>
            eb('userName', '=', userName as string)
          );

          if (user.length === 0) {
            throw new NotFound('user not found');
          }

          const messageList = await messages.find(({ eb }) =>
            eb('userId', '=', user[0].id)
          );

          return messageList;
        }

        const sprintList = await sprints.find(({ eb }) =>
          eb('sprintCode', '=', sprint as string)
        );

        if (sprintList.length === 0) {
          throw new NotFound('sprint not found');
        }

        const messageList = await messages.find(({ eb }) =>
          eb('sprintId', '=', sprintList[0].id)
        );

        return messageList;
      })
    )
    .post(
      jsonRoute(async (req) => {
        const body = req.body;

        const user = await users.find(({ eb }) =>
          eb('userName', '=', body.userName)
        );
        const sprint = await sprints.find(({ eb }) =>
          eb('sprintCode', '=', body.sprintCode)
        );

        if (user.length === 0 || sprint.length === 0) {
          throw new NotFound('user or sprint not found');
        }

        const templateList = await templates.findAll();

        const index = Math.floor(Math.random() * templateList.length);

        const template = templateList[index];

        const message = schema.parseInsertable({
          userId: user[0].id,
          sprintId: sprint[0].id,
          templateId: template.id,
        });

        try {
          const gifUrl = await gifCreate();

          if (!gifUrl) {
            throw new ApiError('giphy is not working');
          }

          const member = discordClient.getUserByUserName(user[0].userName);
          discordClient.sendAccomplishment(
            member,
            sprint[0].sprintName,
            gifUrl,
            template.messageTemplate
          );
        } catch (error) {
          throw new ApiError('discord is not working');
        }

        return messages.create(message);
      }, 201)
    );

  router.route('/:userId').get(
    jsonRoute(async (req) => {
      const id = userSchema.parseId(parseInt(req.params.userId));

      if (!id) {
        throw new NotFound('user not found');
      }

      const messageList = await messages.find(({ eb }) =>
        eb('userId', '=', id)
      );

      return messageList;
    })
  );

  router.route('/sprint/:sprintId').get(
    jsonRoute(async (req) => {
      const id = userSchema.parseId(parseInt(req.params.sprintId));

      if (!id) {
        throw new NotFound('user not found');
      }

      const messageList = await messages.find(({ eb }) =>
        eb('sprintId', '=', id)
      );

      return messageList;
    })
  );
  return router;
};
