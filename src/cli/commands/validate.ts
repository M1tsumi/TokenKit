import { ThemeKit } from '../../core/ThemeKit';
import { DesignTokens } from '../../types';
import { readFileSync, existsSync } from 'node:fs';

interface ValidateOptions {
  input: string;
  strict?: boolean;
}

export async function validateCommand(options: ValidateOptions): Promise<void> {
  const { input, strict = false } = options;

  if (!existsSync(input)) {
    console.error(`❌ Input file not found: ${input}`);
    process.exit(1);
  }

  try {
    const tokensContent = readFileSync(input, 'utf-8');
    const tokens: DesignTokens = JSON.parse(tokensContent);
    
    const themeKit = new ThemeKit({
      validation: {
        enabled: true,
        strict,
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
    });

    const validation = themeKit.validateTokens(tokens);
    
    if (validation.valid) {
      console.log('✅ Tokens are valid!');
    } else {
      console.log('❌ Validation failed:');
      validation.errors.forEach(error => {
        console.log(`  - ${error}`);
      });
    }

    if (validation.errors.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error validating tokens:', error);
    process.exit(1);
  }
}
