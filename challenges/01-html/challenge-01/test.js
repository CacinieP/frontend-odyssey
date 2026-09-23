const fs = require('fs');
const path = require('path');

const targetFileName = process.argv[2] || 'start.html';
const filePath = path.resolve(__dirname, targetFileName);

console.log(`\n========================================`);
console.log(`Running Challenge 01 Tests on: ${targetFileName}`);
console.log(`========================================\n`);

if (!fs.existsSync(filePath)) {
  console.error(`❌ Error: File not found: ${filePath}`);
  process.exit(1);
}

const htmlContent = fs.readFileSync(filePath, 'utf-8');

const checks = [
  {
    name: 'Contains <header> element',
    test: (content) => /<header[\s>]/i.test(content) && /<\/header>/i.test(content),
    hint: 'Replace <div class="header"> and its closing tag with <header>...</header>'
  },
  {
    name: 'Contains <nav> element',
    test: (content) => /<nav[\s>]/i.test(content) && /<\/nav>/i.test(content),
    hint: 'Replace <div class="nav"> and its closing tag with <nav>...</nav>'
  },
  {
    name: 'Contains <main> element',
    test: (content) => /<main[\s>]/i.test(content) && /<\/main>/i.test(content),
    hint: 'Replace <div class="main-content"> and its closing tag with <main>...</main>'
  },
  {
    name: 'Contains <article> element',
    test: (content) => /<article[\s>]/i.test(content) && /<\/article>/i.test(content),
    hint: 'Replace <div class="article"> and its closing tag with <article>...</article>'
  },
  {
    name: 'Contains <footer> element',
    test: (content) => /<footer[\s>]/i.test(content) && /<\/footer>/i.test(content),
    hint: 'Replace <div class="footer"> and its closing tag with <footer>...</footer>'
  },
  {
    name: 'Div soup classes removed',
    test: (content) => {
      const soupDivRegex = /<div\s+class="(header|nav|main-content|article|footer)"/i;
      return !soupDivRegex.test(content);
    },
    hint: 'Ensure you replaced the old div wrapper classes (header, nav, main-content, article, footer)'
  }
];

let passedCount = 0;
let failedCount = 0;

for (const check of checks) {
  const passed = check.test(htmlContent);
  if (passed) {
    console.log(`  ✅ PASS: ${check.name}`);
    passedCount++;
  } else {
    console.log(`  ❌ FAIL: ${check.name}`);
    console.log(`     💡 Hint: ${check.hint}`);
    failedCount++;
  }
}

console.log(`\n----------------------------------------`);
console.log(`Summary: ${passedCount} passed, ${failedCount} failed`);
console.log(`----------------------------------------\n`);

if (failedCount > 0) {
  console.log(`❌ Some tests failed. Keep refining your HTML structure!\n`);
  process.exit(1);
} else {
  console.log(`🎉 Congratulations! You have successfully replaced the div soup with semantic HTML!\n`);
  process.exit(0);
}
