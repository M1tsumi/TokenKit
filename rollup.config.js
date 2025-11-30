// rollup.config.js
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';
import babel from '@rollup/plugin-babel';

const baseConfig = {
  plugins: [
    resolve(),
    commonjs(),
    json(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
    }),
  ],
  external: ['react', 'vue', '@angular/core', 'react/jsx-runtime'],
};

const reactConfig = {
  ...baseConfig,
  input: 'src/react/index.ts',
  output: [
    {
      file: 'react/index.esm.js',
      format: 'es',
    },
    {
      file: 'react/index.js',
      format: 'cjs',
    },
  ],
  plugins: [
    ...baseConfig.plugins,
    babel({
      babelHelpers: 'bundled',
      presets: [
        ['@babel/preset-react', { runtime: 'automatic' }],
        '@babel/preset-typescript',
      ],
      extensions: ['.ts', '.tsx'],
    }),
  ],
};

const frameworkConfig = (framework) => ({
  ...baseConfig,
  input: `src/${framework}/index.ts`,
  output: [
    {
      file: `${framework}/index.esm.js`,
      format: 'es',
    },
    {
      file: `${framework}/index.js`,
      format: 'cjs',
    },
  ],
});

export default [
  // ES Module build
  {
    ...baseConfig,
    input: 'src/index.ts',
    output: {
      file: 'dist/index.esm.js',
      format: 'es',
    },
  },
  // CommonJS build
  {
    ...baseConfig,
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'cjs',
    },
  },
  // CLI build
  {
    ...baseConfig,
    input: 'src/cli.ts',
    output: {
      file: 'dist/cli.js',
      format: 'cjs',
      banner: '#!/usr/bin/env node',
    },
  },
  // React adapter (with JSX support)
  reactConfig,
  // Vue adapter  
  frameworkConfig('vue'),
  // Angular adapter
  frameworkConfig('angular'),
  // Vanilla adapter
  frameworkConfig('vanilla'),
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];