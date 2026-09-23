/**
 * Automated test runner for Chapter III: JavaScript Challenge 01
 * Uses Node.js native assert module — zero external dependencies.
 */

import assert from 'node:assert/strict';

// Determine whether to test start.js (default) or solution.js
const targetFile =
  process.argv[2] === 'solution' || process.env.TEST_SOLUTION === '1'
    ? './solution.js'
    : './start.js';

console.log(`\n==============================================`);
console.log(`  Frontend Odyssey — Chapter III Challenge 01`);
console.log(`  Target: ${targetFile}`);
console.log(`==============================================\n`);

let modules;
try {
  modules = await import(targetFile);
} catch (err) {
  console.error(`❌ Failed to import "${targetFile}":`, err.message);
  process.exit(1);
}

const { capitalize, sum, unique, debounce, fetchJSON } = modules;

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

/**
 * Helper to run a test case and format console output
 */
async function test(description, testFn) {
  totalTests++;
  try {
    await testFn();
    console.log(`  ✅ PASS: ${description}`);
    passedTests++;
  } catch (err) {
    console.log(`  ❌ FAIL: ${description}`);
    console.log(`     Error: ${err.message}\n`);
    failedTests++;
  }
}

// -----------------------------------------------------------------------------
// Suite 1: capitalize(str)
// -----------------------------------------------------------------------------
console.log('📌 Testing capitalize(str)...');

await test('capitalizes a single word', () => {
  assert.equal(capitalize('hello'), 'Hello');
  assert.equal(capitalize('javascript'), 'Javascript');
});

await test('capitalizes multiple words separated by space', () => {
  assert.equal(capitalize('frontend odyssey'), 'Frontend Odyssey');
  assert.equal(capitalize('make the web come alive'), 'Make The Web Come Alive');
});

await test('handles empty string and non-string inputs gracefully', () => {
  assert.equal(capitalize(''), '');
  assert.equal(capitalize(null), '');
  assert.equal(capitalize(undefined), '');
});

// -----------------------------------------------------------------------------
// Suite 2: sum(arr)
// -----------------------------------------------------------------------------
console.log('\n📌 Testing sum(arr)...');

await test('calculates the sum of positive integers', () => {
  assert.equal(sum([1, 2, 3, 4]), 10);
  assert.equal(sum([10, 20, 30]), 60);
});

await test('handles negative numbers and floating point numbers', () => {
  assert.equal(sum([-5, 5, 10]), 10);
  assert.equal(sum([1.5, 2.5, 3.0]), 7.0);
});

await test('returns 0 for empty arrays and invalid inputs', () => {
  assert.equal(sum([]), 0);
  assert.equal(sum(null), 0);
  assert.equal(sum(undefined), 0);
});

// -----------------------------------------------------------------------------
// Suite 3: unique(arr)
// -----------------------------------------------------------------------------
console.log('\n📌 Testing unique(arr)...');

await test('removes duplicate numbers while preserving order', () => {
  assert.deepEqual(unique([1, 2, 2, 3, 1, 4]), [1, 2, 3, 4]);
});

await test('removes duplicate strings', () => {
  assert.deepEqual(unique(['apple', 'banana', 'apple', 'orange', 'banana']), [
    'apple',
    'banana',
    'orange',
  ]);
});

await test('does not mutate the original array', () => {
  const original = [1, 2, 1, 3];
  const result = unique(original);
  assert.deepEqual(original, [1, 2, 1, 3], 'Original array was mutated!');
  assert.notEqual(result, original, 'Should return a new array instance');
});

// -----------------------------------------------------------------------------
// Suite 4: debounce(fn, ms)
// -----------------------------------------------------------------------------
console.log('\n📌 Testing debounce(fn, ms)...');

await test('delays function invocation and drops earlier calls in burst', async () => {
  let executions = 0;
  let lastMessage = null;

  const fn = debounce((msg) => {
    executions++;
    lastMessage = msg;
  }, 60);

  assert.equal(typeof fn, 'function', 'debounce must return a function');

  fn('burst 1');
  fn('burst 2');
  fn('burst 3');

  // Immediately, function should not have run yet
  assert.equal(executions, 0, 'Debounced function executed immediately without delay');

  // Wait for debounce timer to fire
  await new Promise((resolve) => setTimeout(resolve, 100));

  assert.equal(executions, 1, `Expected 1 execution, but got ${executions}`);
  assert.equal(lastMessage, 'burst 3', 'Expected the last arguments passed to be used');
});

await test('allows function to be invoked again after delay has passed', async () => {
  let count = 0;
  const fn = debounce(() => {
    count++;
  }, 40);

  assert.equal(typeof fn, 'function', 'debounce must return a function');

  fn();
  await new Promise((resolve) => setTimeout(resolve, 60));
  assert.equal(count, 1);

  fn();
  await new Promise((resolve) => setTimeout(resolve, 60));
  assert.equal(count, 2);
});

// -----------------------------------------------------------------------------
// Suite 5: fetchJSON(url)
// -----------------------------------------------------------------------------
console.log('\n📌 Testing fetchJSON(url)...');

await test('fetches and parses JSON successfully when response.ok is true', async () => {
  const originalFetch = globalThis.fetch;
  try {
    const mockData = { id: 42, title: 'Learn JavaScript' };
    let requestedUrl = null;

    globalThis.fetch = async (url) => {
      requestedUrl = url;
      return {
        ok: true,
        status: 200,
        json: async () => mockData,
      };
    };

    const result = await fetchJSON('https://api.example.com/item/42');
    assert.deepEqual(result, mockData);
    assert.equal(requestedUrl, 'https://api.example.com/item/42');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

await test('throws an error when response.ok is false', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => {
      return {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'Not found' }),
      };
    };

    let didThrow = false;
    try {
      await fetchJSON('https://api.example.com/missing');
    } catch (err) {
      didThrow = true;
      assert(err instanceof Error, 'Thrown value must be an instance of Error');
    }

    assert.equal(didThrow, true, 'fetchJSON should throw an error when response.ok is false');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n==============================================');
console.log(`  Results: ${passedTests}/${totalTests} passed (${failedTests} failed)`);
console.log('==============================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 All tests passed successfully!\n');
  process.exit(0);
}
