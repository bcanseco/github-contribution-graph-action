import {getRandomInt} from '.';

it('should disallow negative values', () => {
  expect(() => getRandomInt(-5, 1)).toThrow();
  expect(() => getRandomInt(-5, -1)).toThrow();
  expect(() => getRandomInt(1, -5)).toThrow();
});

it('should disallow min greater than max', () => {
  expect(() => getRandomInt(1, 2)).not.toThrow();
  expect(() => getRandomInt(1, 1)).not.toThrow();
  expect(() => getRandomInt(1, 0)).toThrow();
  expect(() => getRandomInt(0, 0)).not.toThrow();
});

it('should work with numeric strings', () => {
  expect(() => getRandomInt(1, 5)).not.toThrow();
  expect(() => getRandomInt('1', '5')).not.toThrow();
});

it('should be inclusive on min and max', () => {
  expect(getRandomInt(0, 0)).toEqual(0);
  expect(getRandomInt(1, 1)).toEqual(1);
});
