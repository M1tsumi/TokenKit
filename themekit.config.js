module.exports = {
  tokens: './tokens.json',
  defaultTheme: 'default',
  persistence: {
    enabled: true,
    key: 'themekit-theme',
    storage: 'localStorage',
  },
  validation: {
    enabled: true,
    strict: false,
    rules: [
      {
        name: 'naming-convention',
        pattern: /^[a-z][a-zA-Z0-9-_]*$/,
        message: 'Token names should use camelCase or kebab-case',
        severity: 'warning',
      },
      {
        name: 'color-format',
        pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(|^rgba\(/,
        message: 'Color values should be valid hex, rgb, or rgba format',
        severity: 'error',
      },
      {
        name: 'spacing-unit',
        pattern: /^\d+(px|rem|em|%)$/,
        message: 'Spacing values should include units (px, rem, em, %)',
        severity: 'warning',
      },
    ],
  },
  cli: {
    inputFile: './tokens.json',
    outputFile: './dist',
    format: 'css',
    watch: false,
  },
};
