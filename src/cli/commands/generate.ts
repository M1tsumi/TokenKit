import { DesignTokens } from '../../types';
import { resolveAliases } from '../../utils/aliases';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { watch } from 'chokidar';

interface GenerateOptions {
  format: 'json' | 'css' | 'scss' | 'ts' | 'js';
  input: string;
  output: string;
  theme?: string;
  prefix?: string;
  watch?: boolean;
  resolveAliases?: boolean;
}

export async function generateCommand(options: GenerateOptions): Promise<void> {
  const { format, input, output, theme, prefix = 'tk', watch: watchMode, resolveAliases: shouldResolveAliases } = options;

  if (!existsSync(input)) {
    console.error(`❌ Input file not found: ${input}`);
    process.exit(1);
  }

  const generate = () => {
    try {
      const tokensContent = readFileSync(input, 'utf-8');
      let tokens: DesignTokens = JSON.parse(tokensContent);
      
      // Resolve aliases if requested
      if (shouldResolveAliases) {
        try {
          tokens = resolveAliases(tokens);
          console.log('✅ Aliases resolved');
        } catch (err) {
          console.error('❌ Error resolving aliases:', err);
          process.exit(1);
        }
      }
      
      if (!existsSync(output)) {
        mkdirSync(output, { recursive: true });
      }

      switch (format) {
        case 'json':
          generateJSON(tokens, output, theme);
          break;
        case 'css':
          generateCSS(tokens, output, theme, prefix);
          break;
        case 'scss':
          generateSCSS(tokens, output, theme, prefix);
          break;
        case 'ts':
          generateTypeScript(tokens, output, theme);
          break;
        case 'js':
          generateJavaScript(tokens, output, theme);
          break;
        default:
          console.error(`❌ Unsupported format: ${format}`);
          process.exit(1);
      }

      console.log(`✅ Generated ${format} files in ${output}`);
    } catch (error) {
      console.error('❌ Error generating files:', error);
      process.exit(1);
    }
  };

  generate();

  if (watchMode) {
    console.log(`👀 Watching ${input} for changes...`);
    const watcher = watch(input);
    
    watcher.on('change', () => {
      console.log('📝 File changed, regenerating...');
      generate();
    });
  }
}

function generateJSON(tokens: DesignTokens, output: string, theme?: string): void {
  const filename = theme ? `${theme}.tokens.json` : 'tokens.json';
  const outputPath = join(output, filename);
  writeFileSync(outputPath, JSON.stringify(tokens, null, 2));
}

function generateCSS(tokens: DesignTokens, output: string, theme?: string, prefix = 'tk'): void {
  const filename = theme ? `${theme}.tokens.css` : 'tokens.css';
  const outputPath = join(output, filename);
  
  const cssVariables = tokensToCSSVariables(tokens, prefix);
  writeFileSync(outputPath, cssVariables);
}

function generateSCSS(tokens: DesignTokens, output: string, theme?: string, prefix = 'tk'): void {
  const filename = theme ? `${theme}.tokens.scss` : 'tokens.scss';
  const outputPath = join(output, filename);
  
  const scssVariables = tokensToSCSSVariables(tokens, prefix);
  writeFileSync(outputPath, scssVariables);
}

function generateTypeScript(tokens: DesignTokens, output: string, theme?: string): void {
  const filename = theme ? `${theme}.tokens.ts` : 'tokens.ts';
  const outputPath = join(output, filename);
  
  const tsContent = tokensToTypeScript(tokens);
  writeFileSync(outputPath, tsContent);
}

function generateJavaScript(tokens: DesignTokens, output: string, theme?: string): void {
  const filename = theme ? `${theme}.tokens.js` : 'tokens.js';
  const outputPath = join(output, filename);
  
  const jsContent = tokensToJavaScript(tokens);
  writeFileSync(outputPath, jsContent);
}

function tokensToCSSVariables(tokens: DesignTokens, prefix: string): string {
  const lines: string[] = [':root {'];
  
  const addVariables = (obj: any, path: string = ''): void => {
    for (const [key, value] of Object.entries(obj)) {
      const variableName = path ? `${prefix}-${path}-${key}` : `${prefix}-${key}`;
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        addVariables(value, key);
      } else {
        lines.push(`  --${variableName}: ${value};`);
      }
    }
  };
  
  addVariables(tokens);
  lines.push('}');
  
  return lines.join('\n');
}

function tokensToSCSSVariables(tokens: DesignTokens, prefix: string): string {
  const lines: string[] = [];
  
  const addVariables = (obj: any, path: string = ''): void => {
    for (const [key, value] of Object.entries(obj)) {
      const variableName = path ? `$${prefix}-${path}-${key}` : `$${prefix}-${key}`;
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        addVariables(value, key);
      } else {
        lines.push(`${variableName}: ${value};`);
      }
    }
  };
  
  addVariables(tokens);
  
  return lines.join('\n');
}

function tokensToTypeScript(tokens: DesignTokens): string {
  const interfaces = generateInterfaces(tokens);
  const exports = generateExports(tokens);
  
  return `// Auto-generated design tokens
${interfaces}

${exports}`;
}

function generateInterfaces(tokens: DesignTokens): string {
  const lines: string[] = [];
  
  const generateInterface = (obj: any, name: string, depth = 0): void => {
    if (depth > 3) return; // Prevent infinite recursion
    
    const indent = '  '.repeat(depth);
    const properties: string[] = [];
    
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        const childName = `${name}${key.charAt(0).toUpperCase() + key.slice(1)}`;
        generateInterface(value, childName, depth + 1);
        properties.push(`${indent}  ${key}: ${childName};`);
      } else {
        const type = typeof value === 'string' ? 'string' : typeof value;
        properties.push(`${indent}  ${key}: ${type};`);
      }
    }
    
    lines.push(`${indent}export interface ${name} {`);
    lines.push(...properties);
    lines.push(`${indent}}`);
    lines.push('');
  };
  
  generateInterface(tokens, 'DesignTokens');
  return lines.join('\n');
}

function generateExports(tokens: DesignTokens): string {
  const lines = ['export const tokens: DesignTokens = {'];
  
  const addObject = (obj: any, depth = 1): void => {
    const indent = '  '.repeat(depth);
    
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        lines.push(`${indent}${key}: {`);
        addObject(value, depth + 1);
        lines.push(`${indent}},`);
      } else {
        const stringValue = typeof value === 'string' ? `'${value}'` : String(value);
        lines.push(`${indent}${key}: ${stringValue},`);
      }
    }
  };
  
  addObject(tokens);
  lines.push('};');
  
  return lines.join('\n');
}

function tokensToJavaScript(tokens: DesignTokens): string {
  const lines = ['// Auto-generated design tokens', 'export const tokens = {'];
  
  const addObject = (obj: any, depth = 1): void => {
    const indent = '  '.repeat(depth);
    
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        lines.push(`${indent}${key}: {`);
        addObject(value, depth + 1);
        lines.push(`${indent}},`);
      } else {
        const stringValue = typeof value === 'string' ? `'${value}'` : String(value);
        lines.push(`${indent}${key}: ${stringValue},`);
      }
    }
  };
  
  addObject(tokens);
  lines.push('};');
  
  return lines.join('\n');
}
