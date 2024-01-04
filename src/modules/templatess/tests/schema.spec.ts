import { omit } from 'lodash/fp';
import { parse, parseInsertable, parseUpdatable } from '../schema';
import { templateFactoryFull } from './utils';

it('parses a valid record', () => {
  const record = templateFactoryFull();

  expect(parse(record)).toEqual(record);
});

it('throws an error due to empty/missing messageTemplate (generic)', () => {
  const templateWithoutMessageTemplate = omit(
    ['messageTemplate'],
    templateFactoryFull()
  );
  const templateEmptyMessageTemplate = templateFactoryFull({
    messageTemplate: '',
  });

  expect(() => parse(templateWithoutMessageTemplate)).toThrow(
    /messageTemplate/i
  );
  expect(() => parse(templateEmptyMessageTemplate)).toThrow(/messageTemplate/i);
});

// every other function is a derivative of parse()
describe('parseInsertable', () => {
  it('omits id', () => {
    const parsed = parseInsertable(templateFactoryFull());

    expect(parsed).not.toHaveProperty('id');
  });
});

describe('parseUpdateable', () => {
  it('omits id', () => {
    const parsed = parseUpdatable(templateFactoryFull());

    expect(parsed).not.toHaveProperty('id');
  });
});
