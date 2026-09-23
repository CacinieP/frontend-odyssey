/**
 * Automated Test Runner for CSS Challenge 01
 * Uses only native Node.js 'fs' and 'path' modules — zero external dependencies.
 */

const fs = require('fs');
const path = require('path');

// Allow checking start.css by default or specifying another file (e.g. solution.css)
const targetFilename = process.argv[2] || process.env.CSS_FILE || 'start.css';
const targetPath = path.resolve(__dirname, targetFilename);

// ANSI color escape codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

console.log(`\n${colors.bold}${colors.cyan}====================================================${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}  Frontend Odyssey — CSS Challenge 01 Test Runner  ${colors.reset}`);
console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}\n`);
console.log(`Testing file: ${colors.bold}${targetFilename}${colors.reset}\n`);

if (!fs.existsSync(targetPath)) {
  console.error(`${colors.red}✗ Error: File not found: ${targetPath}${colors.reset}\n`);
  process.exit(1);
}

const cssContent = fs.readFileSync(targetPath, 'utf-8');

// Strip CSS comments before testing to ensure student actually wrote code, not just comments
const cssWithoutComments = cssContent.replace(/\/\*[\s\S]*?\*\//g, '');

const tests = [
  {
    name: 'Container uses display: grid',
    description: 'The .card-grid container must be declared with `display: grid;`',
    check: (css) => {
      // Matches .card-grid { ... display: grid ... }
      const gridRegex = /\.card-grid\s*\{[^}]*display\s*:\s*grid\s*[;}]/i;
      return gridRegex.test(css) || /display\s*:\s*grid/i.test(css);
    },
    hint: 'Add `display: grid;` inside your `.card-grid` selector rule.'
  },
  {
    name: 'Uses grid-template-columns property',
    description: 'Grid column structure must be defined using `grid-template-columns`',
    check: (css) => {
      return /grid-template-columns\s*:/i.test(css);
    },
    hint: 'Define columns using `grid-template-columns: 1fr;` or `repeat(...)`.'
  },
  {
    name: 'Specifies grid gap',
    description: 'Spacing between cards must be configured with `gap`',
    check: (css) => {
      return /(?:grid-)?gap\s*:/i.test(css);
    },
    hint: 'Add a spacing gutter like `gap: 1.5rem;` to the `.card-grid`.'
  },
  {
    name: 'Contains @media queries for responsive adaptation',
    description: 'Media queries must be used to adapt columns across viewport sizes',
    check: (css) => {
      const mediaRegex = /@media\s*\(\s*min-width\s*:[^)]+\)/i;
      return mediaRegex.test(css);
    },
    hint: 'Use `@media (min-width: 640px)` or `@media (min-width: 768px)` to define tablet/desktop breakpoints.'
  },
  {
    name: 'Defines 2 columns for tablet view',
    description: 'Must set 2 columns on tablet (e.g. repeat(2, 1fr) or 1fr 1fr)',
    check: (css) => {
      const tabletRegex = /grid-template-columns\s*:\s*(?:repeat\(\s*2\s*,\s*(?:1fr|minmax\([^)]+\)|[0-9%pxremvw]+)\s*\)|1fr\s+1fr|repeat\(2,\s*1fr\))/i;
      return tabletRegex.test(css);
    },
    hint: 'Inside your tablet media query, set `grid-template-columns: repeat(2, 1fr);`'
  },
  {
    name: 'Defines 3 columns for desktop view',
    description: 'Must set 3 columns on desktop (e.g. repeat(3, 1fr) or 1fr 1fr 1fr)',
    check: (css) => {
      const desktopRegex = /grid-template-columns\s*:\s*(?:repeat\(\s*3\s*,\s*(?:1fr|minmax\([^)]+\)|[0-9%pxremvw]+)\s*\)|1fr\s+1fr\s+1fr|repeat\(3,\s*1fr\))/i;
      return desktopRegex.test(css);
    },
    hint: 'Inside your desktop media query, set `grid-template-columns: repeat(3, 1fr);`'
  }
];

let passedCount = 0;
let failedCount = 0;

tests.forEach((test, index) => {
  const isPassed = test.check(cssWithoutComments);
  if (isPassed) {
    passedCount++;
    console.log(`  ${colors.green}✓ PASS${colors.reset} [${index + 1}/${tests.length}] ${test.name}`);
  } else {
    failedCount++;
    console.log(`  ${colors.red}✗ FAIL${colors.reset} [${index + 1}/${tests.length}] ${test.name}`);
    console.log(`         ${colors.yellow}Requirement:${colors.reset} ${test.description}`);
    console.log(`         ${colors.cyan}Hint:${colors.reset} ${test.hint}\n`);
  }
});

console.log(`\n${colors.bold}----------------------------------------------------${colors.reset}`);
console.log(`Results: ${colors.green}${passedCount} passed${colors.reset}, ${failedCount > 0 ? colors.red : colors.gray}${failedCount} failed${colors.reset}, ${tests.length} total`);
console.log(`${colors.bold}----------------------------------------------------${colors.reset}\n`);

if (failedCount > 0) {
  console.log(`${colors.yellow}Keep going! Inspect the hints above and update ${targetFilename}.${colors.reset}\n`);
  process.exit(1);
} else {
  console.log(`${colors.green}${colors.bold}🎉 Congratulations! All challenge requirements met!${colors.reset}\n`);
  process.exit(0);
}
