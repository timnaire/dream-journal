/**
 * Checks if a value is equivalent to `true`, including case-insensitive string 'true'.
 *
 * @param value - The value to check for truthiness.
 * @returns `true` if the value is equivalent to `true`, `false` otherwise.
 */
export const isTrue = (value: boolean | string): boolean => {
  return value === true || (typeof value === 'string' && value.toLowerCase() === 'true');
};
