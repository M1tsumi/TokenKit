#!/usr/bin/env node

import { Command } from 'commander';
import { generateCommand } from './commands/generate';
import { validateCommand } from './commands/validate';
import { initCommand } from './commands/init';
import { diffCommand } from './commands/diff';

const program = new Command();

program
  .name('theme-kit')
  .description('CLI tool for managing design tokens')
  .version('1.2.0');

program
  .command('init')
  .description('Initialize a new theme-kit project')
  .option('-t, --template <template>', 'Template to use (basic, advanced)', 'basic')
  .action(initCommand);

program
  .command('generate')
  .description('Generate token files in various formats')
  .option('-f, --format <format>', 'Output format (json, css, scss, ts, js)', 'css')
  .option('-i, --input <path>', 'Input tokens file', './tokens.json')
  .option('-o, --output <path>', 'Output directory', './dist')
  .option('-t, --theme <theme>', 'Specific theme to generate')
  .option('-p, --prefix <prefix>', 'CSS variable prefix', 'tk')
  .option('-w, --watch', 'Watch for changes', false)
  .option('--resolve-aliases', 'Resolve token aliases before generating', false)
  .action(generateCommand);

program
  .command('validate')
  .description('Validate token files')
  .option('-i, --input <path>', 'Input tokens file', './tokens.json')
  .option('--strict', 'Enable strict validation', false)
  .action(validateCommand);

program
  .command('diff')
  .description('Compare two token files and show differences')
  .argument('<file1>', 'First token file')
  .argument('<file2>', 'Second token file')
  .option('-f, --format <format>', 'Output format (text, json)', 'text')
  .action((file1: string, file2: string, options: { format?: 'text' | 'json' }) => {
    diffCommand({ file1, file2, format: options.format });
  });

program.parse();
