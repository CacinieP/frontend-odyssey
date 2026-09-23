/**
 * Chapter III: JavaScript Challenge 01
 * Implement the 5 utility functions below.
 * Run tests with: `pnpm test` (or `node test.js`)
 */

/**
 * Capitalizes the first letter of each word in a string.
 * Words are separated by whitespace.
 *
 * @example
 * capitalize('hello') // 'Hello'
 * capitalize('frontend odyssey') // 'Frontend Odyssey'
 * capitalize('') // ''
 *
 * @param {string} str - Input string
 * @returns {string} String with capitalized words
 */
export function capitalize(str) {
  // TODO: Implement this function
  return '';
}

/**
 * Computes the sum of all numbers in an array.
 * Returns 0 if the array is empty or input is invalid.
 *
 * @example
 * sum([1, 2, 3]) // 6
 * sum([-1, 1]) // 0
 * sum([]) // 0
 *
 * @param {number[]} arr - Array of numbers
 * @returns {number} The sum of numbers
 */
export function sum(arr) {
  // TODO: Implement this function
  return 0;
}

/**
 * Returns a new array with duplicate values removed, preserving
 * the order of first appearance.
 *
 * @example
 * unique([1, 2, 2, 3, 1]) // [1, 2, 3]
 * unique(['a', 'b', 'a']) // ['a', 'b']
 *
 * @template T
 * @param {T[]} arr - Input array
 * @returns {T[]} New array with duplicates removed
 */
export function unique(arr) {
  // TODO: Implement this function
  return [];
}

/**
 * Creates a debounced function that delays invoking `fn` until after
 * `ms` milliseconds have elapsed since the last time it was invoked.
 *
 * @example
 * const debounced = debounce(myFn, 200);
 * debounced('arg1');
 * debounced('arg2'); // resets timer; myFn will only execute with 'arg2' after 200ms
 *
 * @template {(...args: any[]) => any} T
 * @param {T} fn - The function to debounce
 * @param {number} ms - The number of milliseconds to delay
 * @returns {(...args: Parameters<T>) => void} The debounced function
 */
export function debounce(fn, ms) {
  // TODO: Implement this function
}

/**
 * Asynchronously fetches a URL and returns the parsed JSON response.
 * Throws an Error if the HTTP response status is not OK (!response.ok).
 *
 * @example
 * const data = await fetchJSON('https://api.example.com/items');
 *
 * @param {string} url - Target URL to fetch
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} When network request fails or response status is not ok
 */
export async function fetchJSON(url) {
  // TODO: Implement this function
}
