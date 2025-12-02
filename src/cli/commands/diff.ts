import { DesignTokens } from '../../types';
import { readFileSync, existsSync } from 'node:fs';

interface DiffOptions {
  file1: string;
  file2: string;
  format?: 'text' | 'json';
}

interface TokenDiff {
  added: Array<{ path: string; value: any }>;
  removed: Array<{ path: string; value: any }>;
  changed: Array<{ path: string; from: any; to: any }>;
}

/**
 * Flatten a nested object into dot-notation paths
 */
function flattenTokens(obj: any, prefix = ''): Map<string, any> {
  const result = new Map<string, any>();

  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const nested = flattenTokens(value, path);
      for (const [nestedPath, nestedValue] of nested) {
        result.set(nestedPath, nestedValue);
      }
    } else {
      result.set(path, value);
    }
  }

  return result;
}

/**
 * Compare two token files and return the differences
 */
function compareTokens(tokens1: DesignTokens, tokens2: DesignTokens): TokenDiff {
  const flat1 = flattenTokens(tokens1);
  const flat2 = flattenTokens(tokens2);

  const diff: TokenDiff = {
    added: [],
    removed: [],
    changed: [],
  };

  // Find removed and changed tokens
  for (const [path, value] of flat1) {
    if (!flat2.has(path)) {
      diff.removed.push({ path, value });
    } else if (flat2.get(path) !== value) {
      diff.changed.push({ path, from: value, to: flat2.get(path) });
    }
  }

  // Find added tokens
  for (const [path, value] of flat2) {
    if (!flat1.has(path)) {
      diff.added.push({ path, value });
    }
  }

  return diff;
}

/**
 * Format diff output for terminal
 */
function formatTextDiff(diff: TokenDiff): string {
  const lines: string[] = [];

  if (diff.added.length === 0 && diff.removed.length === 0 && diff.changed.length === 0) {
    return 'No differences found.';
  }

  if (diff.added.length > 0) {
    lines.push('\n+ Added tokens:');
    for (const { path, value } of diff.added) {
      lines.push(`  + ${path}: ${JSON.stringify(value)}`);
    }
  }

  if (diff.removed.length > 0) {
    lines.push('\n- Removed tokens:');
    for (const { path, value } of diff.removed) {
      lines.push(`  - ${path}: ${JSON.stringify(value)}`);
    }
  }

  if (diff.changed.length > 0) {
    lines.push('\n~ Changed tokens:');
    for (const { path, from, to } of diff.changed) {
      lines.push(`  ~ ${path}:`);
      lines.push(`      from: ${JSON.stringify(from)}`);
      lines.push(`      to:   ${JSON.stringify(to)}`);
    }
  }

  lines.push('');
  lines.push(`Summary: ${diff.added.length} added, ${diff.removed.length} removed, ${diff.changed.length} changed`);

  return lines.join('\n');
}

export async function diffCommand(options: DiffOptions): Promise<void> {
  const { file1, file2, format = 'text' } = options;

  if (!existsSync(file1)) {
    console.error(`File not found: ${file1}`);
    process.exit(1);
  }

  if (!existsSync(file2)) {
    console.error(`File not found: ${file2}`);
    process.exit(1);
  }

  try {
    const tokens1: DesignTokens = JSON.parse(readFileSync(file1, 'utf-8'));
    const tokens2: DesignTokens = JSON.parse(readFileSync(file2, 'utf-8'));

    const diff = compareTokens(tokens1, tokens2);

    if (format === 'json') {
      console.log(JSON.stringify(diff, null, 2));
    } else {
      console.log(formatTextDiff(diff));
    }

    // Exit with code 1 if there are differences (useful for CI)
    if (diff.added.length > 0 || diff.removed.length > 0 || diff.changed.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Error comparing token files:', error);
    process.exit(1);
  }
}
