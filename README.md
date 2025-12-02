# ThemeKit

Design tokens shouldn't be scattered across your codebase. ThemeKit gives you one place to define colors, typography, spacing—everything—and use them anywhere. React, Vue, Angular, vanilla JS. Doesn't matter.

## Why ThemeKit?

If you've ever had to update a primary color in 47 different files, you know the pain. ThemeKit fixes that. Define your tokens once, use them everywhere, switch themes on the fly.

**What you get:**
- Works with React, Vue, Angular, or plain JavaScript
- Full TypeScript support (types are auto-generated)
- Light/dark mode with persistence built in
- CLI to spit out CSS variables, SCSS, TypeScript—whatever you need
- Validation so your tokens stay consistent

## Install

```bash
npm install @quefep/theme-kit
```

## Getting Started

### 1. Set up your tokens

Create a `tokens.json`:

```json
{
  "colors": {
    "primary": "#4A90E2",
    "secondary": "#50E3C2",
    "background": "#FFFFFF",
    "text": "#333333"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "fontSize": {
      "sm": "12px",
      "md": "16px",
      "lg": "20px"
    }
  },
  "spacing": {
    "sm": "4px",
    "md": "8px",
    "lg": "16px"
  }
}
```

### 2. Initialize

```typescript
import { ThemeKit } from '@quefep/theme-kit';
import tokens from './tokens.json';

const theme = new ThemeKit({
  defaultTheme: 'light',
  tokens,
});
```

### 3. Use it in your framework

**React:**

```tsx
import { ThemeProvider, useTheme } from '@quefep/theme-kit/react';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MyButton />
    </ThemeProvider>
  );
}

function MyButton() {
  const { getToken } = useTheme();
  return (
    <button style={{ backgroundColor: getToken('colors.primary') }}>
      Click me
    </button>
  );
}
```

**Vue:**

```typescript
import { createApp } from 'vue';
import { ThemeKitPlugin } from '@quefep/theme-kit/vue';

createApp(App).use(ThemeKitPlugin, { theme });
```

```vue
<template>
  <button :style="{ backgroundColor: primaryColor }">Click me</button>
</template>

<script setup>
import { useColor } from '@quefep/theme-kit/vue';
const primaryColor = useColor('primary');
</script>
```

**Angular:**

```typescript
import { ThemeKitModule } from '@quefep/theme-kit/angular';

@NgModule({
  imports: [ThemeKitModule.forRoot({ theme })],
})
export class AppModule {}
```

**Vanilla JS:**

```typescript
import { ThemeKit, createVanillaThemeKit } from '@quefep/theme-kit/vanilla';

const theme = new ThemeKit({ tokens });
const vanillaTheme = createVanillaThemeKit(theme);

document.body.style.backgroundColor = vanillaTheme.getColor('background');
```

## Switching Themes

```typescript
// Switch to dark mode
theme.switch('dark');

// Or pass custom tokens on the fly
theme.switch('custom', {
  colors: {
    primary: '#FF6B6B',
    background: '#1A1A1A',
  },
});

// Check what's active
console.log(theme.getCurrentTheme()); // 'dark'
```

In React:

```tsx
function ThemeToggle() {
  const { currentTheme, switchTheme } = useTheme();
  
  return (
    <button onClick={() => switchTheme(currentTheme === 'light' ? 'dark' : 'light')}>
      {currentTheme === 'light' ? 'Go dark' : 'Go light'}
    </button>
  );
}
```

## Token Aliases

Reference other tokens using curly braces. Keeps things DRY:

```json
{
  "colors": {
    "blue500": "#4A90E2",
    "primary": "{colors.blue500}",
    "buttonBackground": "{colors.primary}"
  }
}
```

Aliases get resolved at build time or runtime—your call.

## Color Utilities

Built-in functions for color manipulation:

```typescript
import { lighten, darken, alpha, mix, contrastRatio, readableOn } from '@quefep/theme-kit';

lighten('#4A90E2', 20);        // 20% lighter
darken('#4A90E2', 20);         // 20% darker
alpha('#4A90E2', 0.5);         // rgba with 50% opacity
mix('#4A90E2', '#FF6B6B', 50); // 50/50 blend
contrastRatio('#000', '#fff'); // WCAG contrast ratio
readableOn('#4A90E2');         // returns black or white for text
```

## CLI

Generate token files in different formats:

```bash
# CSS variables
npx @quefep/theme-kit generate --format css

# SCSS with custom prefix
npx @quefep/theme-kit generate --format scss --prefix myapp

# TypeScript types
npx @quefep/theme-kit generate --format ts

# Resolve aliases before generating
npx @quefep/theme-kit generate --format css --resolve-aliases

# Validate your tokens
npx @quefep/theme-kit validate

# Compare two token files
npx @quefep/theme-kit diff tokens-v1.json tokens-v2.json

# Start a new project
npx @quefep/theme-kit init --template basic
```

**CSS output looks like:**

```css
:root {
  --tk-colors-primary: #4A90E2;
  --tk-colors-secondary: #50E3C2;
  --tk-colors-background: #FFFFFF;
  --tk-colors-text: #333333;
  --tk-typography-fontFamily: Inter, sans-serif;
  --tk-spacing-sm: 4px;
  --tk-spacing-md: 8px;
  --tk-spacing-lg: 16px;
}
```

## Configuration

Drop a `themekit.config.js` in your project root:

```javascript
module.exports = {
  tokens: './tokens.json',
  defaultTheme: 'light',
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
        message: 'Use camelCase or kebab-case for token names',
        severity: 'warning',
      },
      {
        name: 'color-format',
        pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(|^rgba\(/,
        message: 'Colors should be hex, rgb, or rgba',
        severity: 'error',
      },
    ],
  },
};
```

## API

### ThemeKit

```typescript
const theme = new ThemeKit(config);

theme.registerTheme({ name: 'dark', tokens: {...} });
theme.switch('dark');
theme.getCurrentTheme();      // 'dark'
theme.getCurrentTokens();     // { colors: {...}, ... }
theme.getToken('colors.primary');
theme.getAvailableThemes();   // ['light', 'dark']
theme.addThemeChangeListener((name, tokens) => { ... });
theme.validateTokens(tokens); // { valid: true, errors: [] }
```

### React Hooks

- `useTheme()` — full theme context
- `useToken(path)` — grab a specific token
- `useColor(name)` — shorthand for colors
- `useTypography(name)` — typography tokens
- `useSpacing(name)` — spacing tokens

### Vue Composables

Same deal: `useThemeKit()`, `useToken()`, `useColor()`, `useTypography()`, `useSpacing()`

### Angular

Inject `ThemeKitService` and call `switchTheme()`, `getToken()`, etc.

## Project Structure

```
src/
├── core/      # The main ThemeKit class
├── types/     # TypeScript definitions
├── react/     # React bindings
├── vue/       # Vue bindings
├── angular/   # Angular bindings
├── vanilla/   # Vanilla JS adapter
└── cli/       # CLI commands
```

## Tips

- Keep tokens atomic (e.g., `blue-500`) rather than semantic (e.g., `button-background`)
- Version control your token files
- Run validation in CI so bad tokens don't slip through
- Generate static CSS for production when you can

## What's Next

- Svelte and SolidJS adapters
- Figma/Sketch sync
- Multi-brand support
- Visual token editor

## Contributing

```bash
git clone https://github.com/M1tsumi/Theme-Kit.git
cd Theme-Kit
npm install
npm run dev
```

Run tests with `npm test`, build with `npm run build`.

## License

MIT
