import { existsSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface ConfigFile {
  tokens?: string | object;
  defaultTheme?: string;
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
    rules?: Array<{
      name: string;
      pattern: RegExp;
      message: string;
      severity: 'error' | 'warning';
    }>;
  };
  cli?: {
    inputFile?: string;
    outputFile?: string;
    format?: 'json' | 'css' | 'scss' | 'ts' | 'js';
    watch?: boolean;
  };
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: ConfigFile = {};
  private configPath: string | null = null;

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  loadConfig(configPath?: string): ConfigFile {
    const possiblePaths = [
      configPath,
      './themekit.config.js',
      './themekit.config.json',
      './.themekitrc',
      './.themekitrc.json',
    ].filter(Boolean) as string[];

    for (const path of possiblePaths) {
      const resolvedPath = resolve(path);
      if (existsSync(resolvedPath)) {
        this.configPath = resolvedPath;
        this.config = this.loadConfigFile(resolvedPath);
        break;
      }
    }

    return this.config;
  }

  private loadConfigFile(configPath: string): ConfigFile {
    try {
      const configContent = readFileSync(configPath, 'utf-8');
      
      if (configPath.endsWith('.json')) {
        return JSON.parse(configContent);
      } else {
        // Handle JavaScript config files
        // Note: In a real implementation, you'd use a dynamic import or require
        // For now, we'll return a default config
        return this.getDefaultConfig();
      }
    } catch (error) {
      console.warn(`Warning: Could not load config file ${configPath}:`, error);
      return this.getDefaultConfig();
    }
  }

  private getDefaultConfig(): ConfigFile {
    return {
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
  }

  getConfig(): ConfigFile {
    return this.config;
  }

  getConfigPath(): string | null {
    return this.configPath;
  }

  mergeWithDefaults(userConfig: Partial<ConfigFile>): ConfigFile {
    const defaultConfig = this.getDefaultConfig();
    
    return {
      ...defaultConfig,
      ...userConfig,
      persistence: {
        ...defaultConfig.persistence,
        ...userConfig.persistence,
      },
      validation: {
        ...defaultConfig.validation,
        ...userConfig.validation,
      },
      cli: {
        ...defaultConfig.cli,
        ...userConfig.cli,
      },
    };
  }

  validateConfig(config: ConfigFile): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validate tokens path
    if (config.tokens && typeof config.tokens === 'string') {
      if (!existsSync(resolve(config.tokens))) {
        errors.push(`Tokens file not found: ${config.tokens}`);
      }
    }

    // Validate CLI config
    if (config.cli) {
      const { format } = config.cli;
      if (format && !['json', 'css', 'scss', 'ts', 'js'].includes(format)) {
        errors.push(`Invalid CLI format: ${format}. Must be one of: json, css, scss, ts, js`);
      }
    }

    // Validate storage type
    if (config.persistence?.storage) {
      const validStorages = ['localStorage', 'sessionStorage', 'custom'];
      if (!validStorages.includes(config.persistence.storage)) {
        errors.push(`Invalid storage type: ${config.persistence.storage}. Must be one of: ${validStorages.join(', ')}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

export function loadConfig(configPath?: string): ConfigFile {
  return ConfigManager.getInstance().loadConfig(configPath);
}

export function getConfig(): ConfigFile {
  return ConfigManager.getInstance().getConfig();
}
