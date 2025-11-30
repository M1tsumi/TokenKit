# 🎨 ThemeKit

A cross-framework, framework-agnostic SDK for managing **design tokens** in modern web applications. ThemeKit serves as a **single source of truth** for design systems across React, Vue, Angular, and vanilla JavaScript projects.

## ✨ Features

- **🔧 Framework Agnostic** - Works with React, Vue, Angular, and vanilla JavaScript
- **📝 TypeScript First** - Full TypeScript support with auto-generated types
- **🎯 Dynamic Theme Switching** - Light/dark mode and custom themes with persistence
- **🛠️ CLI Tooling** - Generate CSS variables, SCSS, TypeScript, and more
- **🔍 Token Validation** - Enforce naming conventions and detect duplicates
- **📦 Modular Architecture** - Easy to extend with new token categories
- **⚡ Performance Optimized** - Tree-shakable and minimal runtime overhead

## 🚀 Installation

```bash
npm install theme-kit
# or
yarn add theme-kit
# or
pnpm add theme-kit
```

## 📖 Quick Start

### 1. Define Your Tokens

Create a `tokens.json` file:

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

### 2. Initialize ThemeKit

```typescript
import { ThemeKit } from 'theme-kit';
import tokens from './tokens.json';

const theme = new ThemeKit({
  defaultTheme: 'light',
  tokens,
});
```

### 3. Framework Integration

#### React

```tsx
import { ThemeProvider, useTheme } from 'theme-kit/react';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Button>Click Me</Button>
    </ThemeProvider>
  );
}

function Button() {
  const { getToken } = useTheme();
  const primaryColor = getToken('colors.primary');
  
  return <button style={{ backgroundColor: primaryColor }}>Click Me</button>;
}
```

#### Vue

```typescript
import { createApp } from 'vue';
import { ThemeKitPlugin } from 'theme-kit/vue';

const app = createApp(App);
app.use(ThemeKitPlugin, { theme });
```

```vue
<template>
  <button :style="{ backgroundColor: primaryColor }">Click Me</button>
</template>

<script setup>
import { useColor } from 'theme-kit/vue';

const primaryColor = useColor('primary');
</script>
```

#### Angular

```typescript
import { ThemeKitModule } from 'theme-kit/angular';

@NgModule({
  imports: [ThemeKitModule.forRoot({ theme })],
})
export class AppModule {}
```

```typescript
import { Component } from '@angular/core';
import { ThemeKitService } from 'theme-kit/angular';

@Component({
  template: '<button [style.backgroundColor]="primaryColor">Click Me</button>',
})
export class ButtonComponent {
  primaryColor = this.themeKit.getColor('primary');

  constructor(private themeKit: ThemeKitService) {}
}
```

#### Vanilla JavaScript

```typescript
import { ThemeKit, createVanillaThemeKit } from 'theme-kit/vanilla';

const theme = new ThemeKit({ tokens });
const vanillaTheme = createVanillaThemeKit(theme);

// CSS variables are automatically injected
document.body.style.backgroundColor = vanillaTheme.getColor('background');
```

## 🎨 Theme Switching

### Programmatic Switching

```typescript
// Switch to predefined theme
theme.switch('dark');

// Switch with custom tokens
theme.switch('custom', {
  colors: {
    primary: '#FF6B6B',
    background: '#1A1A1A',
  },
});

// Get current theme
console.log(theme.getCurrentTheme()); // 'dark'
```

### React Theme Switching

```tsx
import { useTheme } from 'theme-kit/react';

function ThemeToggle() {
  const { currentTheme, switchTheme } = useTheme();
  
  return (
    <button onClick={() => switchTheme(currentTheme === 'light' ? 'dark' : 'light')}>
      Switch to {currentTheme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
}
```

### Vue Theme Switching

```vue
<template>
  <button @click="switchTheme(currentTheme === 'light' ? 'dark' : 'light')">
    Switch to {{ currentTheme === 'light' ? 'Dark' : 'Light' }} Mode
  </button>
</template>

<script setup>
import { useThemeKit } from 'theme-kit/vue';

const { currentTheme, switchTheme } = useThemeKit();
</script>
```

## 🛠️ CLI Usage

### Generate CSS Variables

```bash
npx theme-kit generate --format css
```

Output (`tokens.css`):
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

### Generate SCSS Variables

```bash
npx theme-kit generate --format scss --prefix myapp
```

Output (`tokens.scss`):
```scss
$myapp-colors-primary: #4A90E2;
$myapp-colors-secondary: #50E3C2;
$myapp-colors-background: #FFFFFF;
$myapp-colors-text: #333333;
$myapp-typography-fontFamily: Inter, sans-serif;
$myapp-spacing-sm: 4px;
$myapp-spacing-md: 8px;
$myapp-spacing-lg: 16px;
```

### Generate TypeScript Types

```bash
npx theme-kit generate --format ts
```

Output (`tokens.ts`):
```typescript
export interface DesignTokens {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
}

export interface Colors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
}

export const tokens: DesignTokens = {
  colors: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    background: '#FFFFFF',
    text: '#333333',
  },
  // ... rest of tokens
};
```

### Validate Tokens

```bash
npx theme-kit validate
# Tokens are valid!
```

### Initialize a New Project

```bash
npx theme-kit init --template basic
# Initialized ThemeKit project with basic template
```

## ⚙️ Configuration

Create a `themekit.config.js` file:

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
        message: 'Token names should use camelCase or kebab-case',
        severity: 'warning',
      },
      {
        name: 'color-format',
        pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(|^rgba\(/,
        message: 'Color values should be valid hex, rgb, or rgba format',
        severity: 'error',
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
```

## 📚 API Reference

### ThemeKit Class

#### Constructor

```typescript
new ThemeKit(config?: ThemeKitConfig)
```

#### Methods

- `registerTheme(theme: ThemeConfig)` - Register a new theme
- `switch(themeName: string, customTokens?: DesignTokens)` - Switch to a theme
- `getCurrentTheme(): string` - Get current theme name
- `getCurrentTokens(): DesignTokens` - Get current theme tokens
- `getToken(path: string): any` - Get a specific token by path
- `getAvailableThemes(): string[]` - Get list of available themes
- `addThemeChangeListener(listener: Function): Function` - Add theme change listener
- `validateTokens(tokens: DesignTokens): ValidationResult` - Validate tokens

### React Hooks

- `useTheme()` - Access theme context
- `useToken<T>(path: string): T` - Get specific token
- `useColor(colorName: string): string` - Get color token
- `useTypography(tokenName: string): any` - Get typography token
- `useSpacing(spacingName: string): string` - Get spacing token

### Vue Composables

- `useThemeKit()` - Access theme instance
- `useToken<T>(path: string): T` - Get specific token
- `useColor(colorName: string): string` - Get color token
- `useTypography(tokenName: string): any` - Get typography token
- `useSpacing(spacingName: string): string` - Get spacing token

### Angular Service

- `ThemeKitService` - Injectable theme service
- Methods: `switchTheme()`, `getToken()`, `getColor()`, `getTypography()`, `getSpacing()`

### Vanilla JavaScript

- `createVanillaThemeKit(theme: ThemeKit): VanillaThemeKit` - Create vanilla instance
- Methods: `switchTheme()`, `getToken()`, `getCSSVariable()`, `applyStyles()`

## 🏗️ Architecture

ThemeKit is built with a modular architecture:

```
src/
├── core/           # Core ThemeKit class
├── types/          # TypeScript definitions
├── react/          # React adapter
├── vue/            # Vue adapter
├── angular/        # Angular adapter
├── vanilla/        # Vanilla JS adapter
└── cli/            # CLI tooling
```

## 🎯 Best Practices

### Token Organization

- **Keep tokens atomic** rather than semantic
- **Use consistent naming** conventions
- **Group related tokens** under logical categories
- **Version control** your token files

### Performance

- **Use tree-shaking** to reduce bundle size
- **Generate static files** when possible
- **Avoid frequent theme switches** in production
- **Cache generated assets** in CI/CD

### Team Collaboration

- **Run validation** in CI/CD pipelines
- **Document token usage** guidelines
- **Use semantic versioning** for token changes
- **Establish review process** for token updates

## 🛣️ Roadmap

- [ ] Plugin ecosystem for community adapters (Svelte, SolidJS)
- [ ] Design tool syncing (Figma, Sketch)
- [ ] Multi-brand token support
- [ ] Performance and tree-shaking improvements
- [ ] Token transformation pipeline
- [ ] Visual token editor
- [ ] Component theme generators

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/themekit/theme-kit.git
cd theme-kit
npm install
npm run dev
```

### Running Tests

```bash
npm test
npm run test:watch
```

### Building

```bash
npm run build
```

## 📄 License

MIT © [ThemeKit Contributors](LICENSE)

## 🙏 Acknowledgments

- Inspired by design systems at major tech companies
- Built with modern web standards and best practices
- Community feedback and contributions

## 📞 Support

- 📖 [Documentation](https://themekit.dev)
- 🐛 [Issue Tracker](https://github.com/themekit/theme-kit/issues)
- 💬 [Discussions](https://github.com/themekit/theme-kit/discussions)
- 📧 [Email](mailto:support@themekit.dev)

---

Made with ❤️ by the ThemeKit team
