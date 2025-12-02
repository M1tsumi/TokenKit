import { DesignTokens } from '../types';

/**
 * Token aliasing system - allows tokens to reference other tokens
 * 
 * Example:
 * {
 *   "colors": {
 *     "blue": "#4A90E2",
 *     "primary": "{colors.blue}"
 *   }
 * }
 */

const ALIAS_PATTERN = /^\{([^}]+)\}$/;

/**
 * Check if a value is a token alias reference
 */
export function isAlias(value: unknown): value is string {
  return typeof value === 'string' && ALIAS_PATTERN.test(value);
}

/**
 * Extract the path from an alias reference
 */
export function getAliasPath(alias: string): string | null {
  const match = alias.match(ALIAS_PATTERN);
  return match ? match[1] : null;
}

/**
 * Get a nested value from an object using dot notation
 */
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Resolve all token aliases in a token object
 * Handles circular references by throwing an error
 */
export function resolveAliases(
  tokens: DesignTokens,
  maxDepth = 10
): DesignTokens {
  const resolved = JSON.parse(JSON.stringify(tokens));
  const resolving = new Set<string>();

  function resolveValue(value: any, path: string, depth: number): any {
    if (depth > maxDepth) {
      throw new Error(`Max alias depth exceeded at "${path}". Possible circular reference.`);
    }

    if (isAlias(value)) {
      const aliasPath = getAliasPath(value);
      if (!aliasPath) return value;

      if (resolving.has(aliasPath)) {
        throw new Error(`Circular alias reference detected: "${path}" -> "${aliasPath}"`);
      }

      resolving.add(path);
      const resolvedValue = getNestedValue(resolved, aliasPath);
      
      if (resolvedValue === undefined) {
        throw new Error(`Alias "${value}" at "${path}" references non-existent token "${aliasPath}"`);
      }

      const finalValue = resolveValue(resolvedValue, aliasPath, depth + 1);
      resolving.delete(path);
      return finalValue;
    }

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const result: any = {};
      for (const [key, val] of Object.entries(value)) {
        result[key] = resolveValue(val, path ? `${path}.${key}` : key, depth);
      }
      return result;
    }

    return value;
  }

  return resolveValue(resolved, '', 0);
}

/**
 * Find all aliases in a token object
 */
export function findAliases(tokens: DesignTokens): Array<{ path: string; alias: string; target: string }> {
  const aliases: Array<{ path: string; alias: string; target: string }> = [];

  function traverse(obj: any, path: string): void {
    if (isAlias(obj)) {
      const target = getAliasPath(obj);
      if (target) {
        aliases.push({ path, alias: obj, target });
      }
      return;
    }

    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      for (const [key, value] of Object.entries(obj)) {
        traverse(value, path ? `${path}.${key}` : key);
      }
    }
  }

  traverse(tokens, '');
  return aliases;
}

/**
 * Create an alias reference string
 */
export function createAlias(path: string): string {
  return `{${path}}`;
}
