// scripts/build-tokens.js
const fs = require('fs');
const path = require('path');

const tokensPath = path.resolve(__dirname, '../design/tokens/tokens.json');
const outPath = path.resolve(__dirname, '../design/tokens/dist');

if (!fs.existsSync(outPath)) {
  fs.mkdirSync(outPath, { recursive: true });
}

function readTokens() {
  const rawData = fs.readFileSync(tokensPath, 'utf-8');
  return JSON.parse(rawData);
}

function emitRuntimeJSON(tokens) {
  const outputFile = path.join(outPath, 'tokens.json');
  fs.writeFileSync(outputFile, JSON.stringify(tokens, null, 2), 'utf-8');
  console.log('Emitted', outputFile);
}

function emitTailwindConfig(tokens) {
  const colors = {};
  const spacing = {};

  if (tokens.global.color) {
    for (const [key, val] of Object.entries(tokens.global.color)) {
      colors[key] = val.value;
    }
  }

  if (tokens.global.spacing) {
    for (const [key, val] of Object.entries(tokens.global.spacing)) {
      spacing[key] = val.value + 'px';
    }
  }

  const configContent = `module.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(colors, null, 2)},\n      spacing: ${JSON.stringify(spacing, null, 2)}\n    }\n  }\n};\n`;

  const outputFile = path.join(outPath, 'tailwind.config.js');
  fs.writeFileSync(outputFile, configContent, 'utf-8');
  console.log('Emitted', outputFile);
}

function emitCSSCustomProperties(tokens) {
  let cssVars = ':root {\n';

  if (tokens.global.color) {
    for (const [key, val] of Object.entries(tokens.global.color)) {
      cssVars += `  --color-${key}: ${val.value};\n`;
    }
  }

  if (tokens.global.spacing) {
    for (const [key, val] of Object.entries(tokens.global.spacing)) {
      cssVars += `  --spacing-${key}: ${val.value}px;\n`;
    }
  }

  cssVars += '}\n';

  const outputFile = path.join(outPath, 'custom-properties.css');
  fs.writeFileSync(outputFile, cssVars, 'utf-8');
  console.log('Emitted', outputFile);
}

function build() {
  const tokens = readTokens();
  emitRuntimeJSON(tokens);
  emitTailwindConfig(tokens);
  emitCSSCustomProperties(tokens);
}

build();
