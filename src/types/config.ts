import { DesignTokens } from './tokens';

export interface ThemeKitConfig {
  tokens?: string | DesignTokens | Record<string, DesignTokens>;
  defaultTheme?: string;
  aliasing?: AliasingConfig;
  persistence?: {
    enabled?: boolean;
    key?: string;
    storage?: 'localStorage' | 'sessionStorage' | 'custom';
    customStorage?: {
      get: (key: string) => string | null;
      set: (key: string, value: string) => void;
      remove: (key: string) => void;
    };
  };
  validation?: {
    enabled?: boolean;
    strict?: boolean;
    rules?: ValidationRule[];
  };
  cli?: {
    inputFile?: string;
    outputFile?: string;
    format?: 'json' | 'css' | 'scss' | 'ts' | 'js';
    watch?: boolean;
  };
}

export interface AliasingConfig {
  enabled?: boolean;
  maxDepth?: number;
}

export interface ValidationRule {
  name: string;
  pattern: RegExp;
  message: string;
  severity: 'error' | 'warning';
}

export interface GenerateOptions {
  format: 'json' | 'css' | 'scss' | 'ts' | 'js';
  outputPath?: string;
  theme?: string;
  prefix?: string;
  variables?: {
    css?: boolean;
    scss?: boolean;
  };
}

export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
  rule: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}
