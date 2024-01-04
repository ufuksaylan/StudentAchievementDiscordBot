import { omit } from 'lodash/fp';
import { parse, parseInsertable, parseUpdatable } from '../schema';
import { sprintFactoryFull } from './utils';

it('parses a valid record', () => {
  const record = sprintFactoryFull();

  expect(parse(record)).toEqual(record);
});

it('throws an error due to empty/missing messageTemplate (generic)', () => {
  const templateWithoutMessageTemplate = omit(
    ['sprintCode'],
    sprintFactoryFull()
  );
  const templateEmptyMessageTemplate = sprintFactoryFull({
    sprintCode: '',
  });

  expect(() => parse(templateWithoutMessageTemplate)).toThrow(/sprintCode/i);
  expect(() => parse(templateEmptyMessageTemplate)).toThrow(/sprintCode/i);
});

// every other function is a derivative of parse()
describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(sprintFactoryFull());

    expect(parsed).not.toHaveProperty('id');
  });
});

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdatable(sprintFactoryFull());

    expect(parsed).not.toHaveProperty('id');
  });
});
