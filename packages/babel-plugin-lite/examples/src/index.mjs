import fs from 'fs';
import { transformSync } from '@babel/core';
const code = fs.readFileSync(`${process.cwd()}/src/code.mjs`, { encoding: 'utf-8' });
import babelPluginLite from '../../dist/index.js';

const result = transformSync(code, {
  plugins: [babelPluginLite],
});

fs.writeFileSync(`${process.cwd()}/src/result.mjs`, result.code);
