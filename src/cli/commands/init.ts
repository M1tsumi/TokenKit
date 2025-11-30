import { writeFileSync, existsSync } from 'node:fs';

interface InitOptions {
  template: 'basic' | 'advanced';
}

export async function initCommand(options: InitOptions): Promise<void> {
  const { template } = options;

  if (existsSync('./tokens.json')) {
    console.log('⚠️  tokens.json already exists. Remove it first or use a different name.');
    return;
  }

  const sampleTokens = template === 'advanced' ? getAdvancedTokens() : getBasicTokens();
  
  writeFileSync('./tokens.json', JSON.stringify(sampleTokens, null, 2));
  
  // Create config file
  const configContent = generateConfig(template);
  writeFileSync('./themekit.config.js', configContent);
  
  console.log(`✅ Initialized ThemeKit project with ${template} template`);
  console.log('📝 Created tokens.json and themekit.config.js');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Edit tokens.json to define your design tokens');
  console.log('  2. Run "npx theme-kit generate" to create CSS variables');
  console.log('  3. Import the generated files in your project');
}

function getBasicTokens() {
  return {
    colors: {
      primary: '#4A90E2',
      secondary: '#50E3C2',
      background: '#FFFFFF',
      text: '#333333',
      border: '#E0E0E0',
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      fontSize: {
        sm: '12px',
        md: '16px',
        lg: '20px',
        xl: '24px',
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        bold: '700',
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        loose: '1.75',
      },
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    },
    borders: {
      radius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      width: {
        thin: '1px',
        normal: '2px',
        thick: '4px',
      },
    },
  };
}

function getAdvancedTokens() {
  return {
    colors: {
      primary: {
        50: '#EBF8FF',
        100: '#BEE3F8',
        200: '#90CDF4',
        300: '#63B3ED',
        400: '#4299E1',
        500: '#4A90E2',
        600: '#3182CE',
        700: '#2C5282',
        800: '#2A4E7C',
        900: '#2B4C7D',
      },
      secondary: {
        50: '#F0FDFA',
        100: '#CCFBF1',
        200: '#99F6E4',
        300: '#5EEAD4',
        400: '#2DD4BF',
        500: '#50E3C2',
        600: '#14B8A6',
        700: '#0F766E',
        800: '#115E59',
        900: '#134E4A',
      },
      neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
      },
      semantic: {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
    },
    typography: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        xs: ['12px', '1.5'],
        sm: ['14px', '1.5'],
        base: ['16px', '1.5'],
        lg: ['18px', '1.5'],
        xl: ['20px', '1.5'],
        '2xl': ['24px', '1.5'],
        '3xl': ['30px', '1.5'],
        '4xl': ['36px', '1.25'],
        '5xl': ['48px', '1.25'],
        '6xl': ['60px', '1.25'],
      },
      fontWeight: {
        thin: '100',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
    },
    spacing: {
      0: '0px',
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      8: '32px',
      10: '40px',
      12: '48px',
      16: '64px',
      20: '80px',
      24: '96px',
      32: '128px',
    },
    shadows: {
      xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    },
    borders: {
      width: {
        0: '0px',
        1: '1px',
        2: '2px',
        4: '4px',
        8: '8px',
      },
      radius: {
        none: '0px',
        sm: '4px',
        base: '6px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    animations: {
      duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      easing: {
        linear: 'linear',
        ease: 'ease',
        'ease-in': 'ease-in',
        'ease-out': 'ease-out',
        'ease-in-out': 'ease-in-out',
      },
    },
  };
}

function generateConfig(template: 'basic' | 'advanced'): string {
  const baseConfig = `module.exports = {
  tokens: './tokens.json',
  defaultTheme: 'default',
  persistence: {
    enabled: true,
    key: 'themekit-theme',
    storage: 'localStorage',
  },
  validation: {
    enabled: true,
    strict: ${template === 'advanced' ? 'true' : 'false'},
    rules: [
      {
        name: 'naming-convention',
        pattern: /^[a-z][a-zA-Z0-9-_]*$/,
        message: 'Token names should use camelCase or kebab-case',
        severity: 'warning',
      },
      {
        name: 'color-format',
        pattern: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\\(|^rgba\\(/,
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
};`;

  return baseConfig;
}
