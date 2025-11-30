import { DesignTokens, ThemeConfig, ThemeRegistry, ThemeKitConfig } from '../types';

export type { DesignTokens, ThemeConfig, ThemeRegistry, ThemeKitConfig };

export class ThemeKit {
  private themes: ThemeRegistry = {};
  private currentTheme: string = '';
  private config: Required<ThemeKitConfig>;
  private listeners: Set<(theme: string, tokens: DesignTokens) => void> = new Set();

  constructor(config: ThemeKitConfig = {}) {
    this.config = {
      tokens: {},
      defaultTheme: 'default',
      persistence: {
        enabled: true,
        key: 'themekit-theme',
        storage: 'localStorage',
        customStorage: {
          get: () => null,
          set: () => {},
          remove: () => {},
        },
      },
      validation: {
        enabled: true,
        strict: false,
        rules: [],
      },
      cli: {
        inputFile: './tokens.json',
        outputFile: './dist',
        format: 'json',
        watch: false,
      },
      ...config,
    };

    this.loadInitialTheme();
  }

  private loadInitialTheme(): void {
    const savedTheme = this.getPersistedTheme();
    if (savedTheme && this.themes[savedTheme]) {
      this.switch(savedTheme);
    } else if (this.config.defaultTheme && this.themes[this.config.defaultTheme]) {
      this.switch(this.config.defaultTheme);
    }
  }

  private getPersistedTheme(): string | null {
    if (!this.config.persistence.enabled) return null;

    const { key, storage, customStorage } = this.config.persistence;

    if (storage === 'custom' && customStorage) {
      return customStorage.get(key!);
    }

    try {
      const storageObj = storage === 'sessionStorage' ? sessionStorage : localStorage;
      return storageObj.getItem(key!);
    } catch {
      return null;
    }
  }

  private persistTheme(themeName: string): void {
    if (!this.config.persistence.enabled) return;

    const { key, storage, customStorage } = this.config.persistence;

    if (storage === 'custom' && customStorage) {
      customStorage.set(key!, themeName);
      return;
    }

    try {
      const storageObj = storage === 'sessionStorage' ? sessionStorage : localStorage;
      storageObj.setItem(key!, themeName);
    } catch {
      // Silently fail if storage is not available
    }
  }

  registerTheme(theme: ThemeConfig): void {
    this.themes[theme.name] = theme;
    
    // If this is the first theme and no default is set, make it default
    if (Object.keys(this.themes).length === 1 && !this.currentTheme) {
      this.switch(theme.name);
    }
  }

  registerThemes(themes: ThemeConfig[]): void {
    themes.forEach(theme => this.registerTheme(theme));
  }

  unregisterTheme(themeName: string): void {
    if (this.themes[themeName]) {
      delete this.themes[themeName];
      
      // If we removed the current theme, switch to default
      if (this.currentTheme === themeName) {
        const availableThemes = Object.keys(this.themes);
        if (availableThemes.length > 0) {
          this.switch(availableThemes[0]);
        }
      }
    }
  }

  switch(themeName: string, customTokens?: DesignTokens): void {
    let targetTheme = this.themes[themeName];
    
    if (!targetTheme && customTokens) {
      // Create a temporary theme with custom tokens
      targetTheme = {
        name: themeName,
        tokens: customTokens,
      };
    } else if (!targetTheme) {
      throw new Error(`Theme '${themeName}' not found`);
    }

    const resolvedTokens = this.resolveTokens(targetTheme);
    this.currentTheme = themeName;
    this.persistTheme(themeName);
    
    // Notify all listeners
    this.listeners.forEach(listener => listener(themeName, resolvedTokens));
  }

  private resolveTokens(theme: ThemeConfig): DesignTokens {
    let tokens = { ...theme.tokens };
    
    // Handle theme extension
    if (theme.extends && this.themes[theme.extends]) {
      const parentTokens = this.resolveTokens(this.themes[theme.extends]);
      tokens = this.mergeTokens(parentTokens, tokens);
    }
    
    return tokens;
  }

  private mergeTokens(base: DesignTokens, override: DesignTokens): DesignTokens {
    const result = { ...base };
    
    for (const [key, value] of Object.entries(override)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const baseValue = (result as any)[key];
        if (baseValue && typeof baseValue === 'object' && !Array.isArray(baseValue)) {
          (result as any)[key] = this.mergeTokens(baseValue as DesignTokens, value as DesignTokens);
        } else {
          (result as any)[key] = value;
        }
      } else {
        (result as any)[key] = value;
      }
    }
    
    return result;
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }

  getCurrentTokens(): DesignTokens {
    if (!this.currentTheme || !this.themes[this.currentTheme]) {
      return {};
    }
    
    return this.resolveTokens(this.themes[this.currentTheme]);
  }

  getTokens(themeName?: string): DesignTokens {
    const targetTheme = themeName || this.currentTheme;
    
    if (!targetTheme || !this.themes[targetTheme]) {
      return {};
    }
    
    return this.resolveTokens(this.themes[targetTheme]);
  }

  getToken(path: string, themeName?: string): any {
    const tokens = this.getTokens(themeName);
    return this.getNestedValue(tokens, path);
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? undefined;
  }

  getAvailableThemes(): string[] {
    return Object.keys(this.themes);
  }

  addThemeChangeListener(listener: (theme: string, tokens: DesignTokens) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  validateTokens(tokens: DesignTokens): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.config.validation.enabled) {
      return { valid: true, errors };
    }

    // Basic validation
    if (!tokens || typeof tokens !== 'object') {
      errors.push('Tokens must be a valid object');
      return { valid: false, errors };
    }

    // Custom validation rules
    if (this.config.validation.rules && this.config.validation.rules.length > 0) {
      for (const rule of this.config.validation.rules) {
        if (rule) {
          const violations = this.validateRule(tokens, rule);
          errors.push(...violations);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  private validateRule(tokens: DesignTokens, rule: any): string[] {
    const errors: string[] = [];
    
    if (!rule || !rule.pattern || !rule.message) {
      return errors;
    }
    
    // Simple key validation based on pattern
    const validateKeys = (obj: any, path: string = ''): void => {
      if (!obj || typeof obj !== 'object') return;
      
      for (const [key, value] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key;
        
        if (!rule.pattern.test(key)) {
          errors.push(`${fullPath}: ${rule.message}`);
        }
        
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          validateKeys(value, fullPath);
        }
      }
    };
    
    validateKeys(tokens);
    return errors;
  }

  static fromTokens(tokens: DesignTokens, config?: ThemeKitConfig): ThemeKit {
    const themeKit = new ThemeKit(config);
    themeKit.registerTheme({
      name: 'default',
      tokens,
    });
    return themeKit;
  }
}
