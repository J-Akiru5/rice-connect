export default {
  singleQuote: true,
  semi: true,
  trailingComma: 'none',
  printWidth: 120,
  endOfLine: 'lf',
  overrides: [
    { files: ['apps/**'], options: { tabWidth: 2 } },
    { files: ['packages/**'], options: { tabWidth: 4 } }
  ]
};
