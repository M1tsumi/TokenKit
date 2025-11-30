export interface ColorTokens {
  [key: string]: string;
}

export interface TypographyTokens {
  fontFamily?: string;
  fontSize?: {
    [key: string]: string;
  };
  fontWeight?: {
    [key: string]: string | number;
  };
  lineHeight?: {
    [key: string]: string | number;
  };
  letterSpacing?: {
    [key: string]: string;
  };
}

export interface SpacingTokens {
  [key: string]: string;
}

export interface ShadowTokens {
  [key: string]: string;
}

export interface BorderTokens {
  width?: {
    [key: string]: string;
  };
  radius?: {
    [key: string]: string;
  };
  style?: {
    [key: string]: string;
  };
}

export interface BreakpointTokens {
  [key: string]: string;
}

export interface AnimationTokens {
  duration?: {
    [key: string]: string;
  };
  easing?: {
    [key: string]: string;
  };
  delay?: {
    [key: string]: string;
  };
}

export interface CustomTokens {
  [key: string]: any;
}

export interface DesignTokens {
  colors?: ColorTokens;
  typography?: TypographyTokens;
  spacing?: SpacingTokens;
  shadows?: ShadowTokens;
  borders?: BorderTokens;
  breakpoints?: BreakpointTokens;
  animations?: AnimationTokens;
  custom?: CustomTokens;
}

export interface ThemeConfig {
  name: string;
  tokens: DesignTokens;
  extends?: string;
}

export interface ThemeRegistry {
  [themeName: string]: ThemeConfig;
}
