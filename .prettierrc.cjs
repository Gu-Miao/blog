module.exports = {
  arrowParens: 'avoid',
  bracketSpacing: true,
  endOfLine: 'lf',
  printWidth: 100,
  semi: false,
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  trailingComma: 'all',
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
}
