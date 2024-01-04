import { omit } from 'lodash/fp';
import { parse, parseInsertable, parseUpdatable } from '../schema';
import { userFactoryFull } from './utils';

it('parses a valid record', () => {
  const record = userFactoryFull();

  expect(parse(record)).toEqual(record);
});

it('throws an error due to empty/missing username (generic)', () => {
  const userWithoutUserName = omit(['userName'], userFactoryFull());
  const userEmptyUserName = userFactoryFull({
    userName: '',
  });

  expect(() => parse(userWithoutUserName)).toThrow(/userName/i);
  expect(() => parse(userEmptyUserName)).toThrow(/userName/i);
});

// every other function is a derivative of parse()
describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(userFactoryFull());

    expect(parsed).not.toHaveProperty('id');
  });
});

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdatable(userFactoryFull());

    expect(parsed).not.toHaveProperty('id');
  });
});
