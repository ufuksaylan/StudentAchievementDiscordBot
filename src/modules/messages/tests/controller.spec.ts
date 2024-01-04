import supertest from 'supertest';
import createTestDatabase from '@tests/utils/createTestDatabase';
import { createFor } from '@tests/utils/records';
import { messageFactory, messageMatcher } from '@/modules/messages/tests/utils';
import { userFactory } from '@/modules/users/tests/utils';
import { templateFactory } from '@/modules/templatess/tests/utils';
import { sprintFactory } from '@/modules/sprints/tests/utils';
import createApp from '@/app';

import { expect, it, vi } from 'vitest';
import Discord from '@/modules/discord/discord';
import { GatewayIntentBits } from 'discord.js';

vi.mock('@/modules/discord/discord');

const db = await createTestDatabase();
const discord = new Discord({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const app = createApp(db, discord);
// builds helper function to create messages, users, templates, sprints
const createMessages = createFor(db, 'messages');
const createUsers = createFor(db, 'users');
const createTemplates = createFor(db, 'templates');
const createSprints = createFor(db, 'sprints');

afterEach(async () => {
  await db.deleteFrom('messages').execute();
});

beforeEach(async () => {
  await db.deleteFrom('messages').execute();
});

afterAll(() => db.destroy());

// arrange (Given we have...)
await createUsers([
  userFactory({
    userName: 'User1',
  }),
  userFactory({
    userName: 'User2',
  }),
]);

await createTemplates([
  templateFactory({
    messageTemplate: 'Template1',
  }),
  templateFactory({
    messageTemplate: 'Template2',
  }),
]);

await createSprints([
  sprintFactory({
    sprintCode: 'Sprint1',
  }),
  sprintFactory({
    sprintCode: 'Sprint2',
  }),
]);

describe('GET', () => {
  it('should return an empty array when there are no messages', async () => {
    // ACT (When we request...)
    const { body } = await supertest(app).get('/messages').expect(200);

    // ASSERT (Then we should get...)
    expect(body).toEqual([]);
  });

  it('should return a list of existing messages', async () => {
    // ARRANGE (Given we have...)
    await createMessages([
      messageFactory(),
      messageFactory({
        userId: 2,
        templateId: 2,
        sprintId: 2,
      }),
    ]);

    const { body } = await supertest(app).get('/messages').expect(200);

    expect(body).toEqual([
      messageMatcher(),
      messageMatcher({
        userId: 2,
        templateId: 2,
        sprintId: 2,
      }),
    ]);
  });
});

describe('POST', async () => {
  it.only('should send a congratulatory message and return a success response 201', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({
        userName: 'User1',
        sprintCode: 'Sprint1',
      })
      .expect(201);

    // ASSERT (Then we should get...)
    const expectedMessage = messageMatcher({
      id: expect.any(Number),
      userId: 1,
      templateId: expect.any(Number),
      sprintId: 1,
      timestamp: expect.any(String),
    });

    expect(body).toEqual(expectedMessage);
  });

  it('should return a 404 error when the user does not exist', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({
        userName: 'not exitsting user',
        sprintCode: 'Sprint1',
      })
      .expect(404);
    expect(body.error.message).toMatch(/not found/i);
  });

  it('should return a 404 error when the sprint does not exist', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({
        userName: 'User1',
        sprintCode: 'testSprintnotexists',
      })
      .expect(404);

    expect(body.error.message).toMatch(/not found/i);
  });

  it('should return 404 if userName is missing', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({
        sprintCode: 'Sprint1',
      })
      .expect(404);
  });

  it('should return 404 if sprintCode is missing', async () => {
    const { body } = await supertest(app)
      .post('/messages')
      .send({
        userName: 'User1',
      })
      .expect(404);
  });
});
