/**
 * Chapter III: JavaScript Challenge 01 - Reference Solution
 */

/**
 * Capitalizes the first letter of each word in a string.
 *
 * @param {string} str - Input string
 * @returns {string} String with capitalized words
 */
export function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) return '';
  return str.replace(/(?:^|\s)\S/g, (char) => char.toUpperCase());
}

/**
 * Computes the sum of all numbers in an array.
 *
 * @param {number[]} arr - Array of numbers
 * @returns {number} The sum of numbers
 */
export function sum(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return arr.reduce((acc, val) => acc + (typeof val === 'number' ? val : 0), 0);
}

/**
 * Returns a new array with duplicate values removed, preserving first-seen order.
 *
 * @template T
 * @param {T[]} arr - Input array
 * @returns {T[]} New array with duplicates removed
 */
export function unique(arr) {
  if (!Array.isArray(arr)) return [];
  return Array.from(new Set(arr));
}

/**
 * Creates a debounced function that delays invoking `fn` until after
 * `ms` milliseconds have elapsed since the last time it was invoked.
 *
 * @template {(...args: any[]) => any} T
 * @param {T} fn - The function to debounce
 * @param {number} ms - The number of milliseconds to delay
 * @returns {(...args: Parameters<T>) => void} The debounced function
 */
export function debounce(fn, ms) {
  let timerId = null;

  return function (...args) {
    if (timerId !== null) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn.apply(this, args);
      timerId = null;
    }, ms);
  };
}

/**
 * Asynchronously fetches a URL and returns the parsed JSON response.
 * Throws an Error if the HTTP response status is not OK (!response.ok).
 *
 * @param {string} url - Target URL to fetch
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} When network request fails or response status is not ok
 */
export async function fetchJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status} ${response.statusText || ''}`.trim());
  }
  return await response.json();
}
