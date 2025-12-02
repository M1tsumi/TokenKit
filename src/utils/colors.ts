/**
 * Color manipulation utilities for ThemeKit
 */

/**
 * Parse a hex color to RGB components
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    // Try 3-digit hex
    const short = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hex);
    if (short) {
      return {
        r: parseInt(short[1] + short[1], 16),
        g: parseInt(short[2] + short[2], 16),
        b: parseInt(short[3] + short[3], 16),
      };
    }
    return null;
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Lighten a color by a percentage (0-100)
 */
export function lighten(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const factor = amount / 100;
  return rgbToHex(
    rgb.r + (255 - rgb.r) * factor,
    rgb.g + (255 - rgb.g) * factor,
    rgb.b + (255 - rgb.b) * factor
  );
}

/**
 * Darken a color by a percentage (0-100)
 */
export function darken(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const factor = 1 - amount / 100;
  return rgbToHex(rgb.r * factor, rgb.g * factor, rgb.b * factor);
}

/**
 * Adjust the opacity of a color
 */
export function alpha(color: string, opacity: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.max(0, Math.min(1, opacity))})`;
}

/**
 * Mix two colors together
 */
export function mix(color1: string, color2: string, weight = 50): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  if (!rgb1 || !rgb2) return color1;

  const w = weight / 100;
  return rgbToHex(
    rgb1.r * w + rgb2.r * (1 - w),
    rgb1.g * w + rgb2.g * (1 - w),
    rgb1.b * w + rgb2.b * (1 - w)
  );
}

/**
 * Get the contrast ratio between two colors (WCAG)
 */
export function contrastRatio(color1: string, color2: string): number {
  const luminance = (color: string): number => {
    const rgb = hexToRgb(color);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = luminance(color1);
  const l2 = luminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a color is light or dark
 */
export function isLight(color: string): boolean {
  const rgb = hexToRgb(color);
  if (!rgb) return true;
  // Using perceived brightness formula
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128;
}

/**
 * Generate a readable text color (black or white) for a background
 */
export function readableOn(backgroundColor: string): string {
  return isLight(backgroundColor) ? '#000000' : '#FFFFFF';
}
