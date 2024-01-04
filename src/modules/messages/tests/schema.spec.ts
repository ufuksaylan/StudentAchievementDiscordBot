import { omit } from 'lodash/fp';
import { parse, parseInsertable, parseUpdatable } from '../schema';
import { messageFactoryFull, messageFactory } from './utils';

it('parses a valid record', () => {
  const record = messageFactoryFull();
  expect(parse(record)).toEqual(record);
});

it('throws an error due to empty properties (generic)', () => {
  const messageWithoutUserId = omit(['userId'], messageFactoryFull());
  const messageWithoutTemplateId = omit(['templateId'], messageFactoryFull());
  const messageWithoutSprintId = omit(['sprintId'], messageFactoryFull());
  const messageWithoutTimestamp = omit(['timestamp'], messageFactoryFull());

  expect(() => parse(messageWithoutTemplateId)).toThrow(/templateId/i);
  expect(() => parse(messageWithoutSprintId)).toThrow(/sprintId/i);
  expect(() => parse(messageWithoutTimestamp)).toThrow(/timestamp/i);
  expect(() => parse(messageWithoutUserId)).toThrow(/userId/i);
});

it('throws an error due to properties being less than minimum length (generic)', () => {
  const messageWithShortUserId = messageFactoryFull({ userId: 0 });
  const messageWithShortTemplateId = messageFactoryFull({ templateId: 0 });
  const messageWithShortSprintId = messageFactoryFull({ sprintId: 0 });

  expect(() => parse(messageWithShortUserId)).toThrow(/userId/i);
  expect(() => parse(messageWithShortTemplateId)).toThrow(/templateId/i);
  expect(() => parse(messageWithShortSprintId)).toThrow(/sprintId/i);
});

describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(messageFactoryFull());

    expect(parsed).not.toHaveProperty('id');
  });
});

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdatable(messageFactoryFull());

    expect(parsed).not.toHaveProperty('id');
  });
});
