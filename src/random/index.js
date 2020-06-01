/**
 * Returns a pseudorandom number between two inclusive numbers.
 * @param {Number} min The minimum rollable number
 * @param {Number} max The maximum rollable number
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values_inclusive
 */
export const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  if (min > max || Math.min(min, max) < 0) {
    throw new Error('min and max must be a positive integer range');
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
};
