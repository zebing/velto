import fs from 'fs';
import { transformSync } from '@babel/core';
const code = fs.readFileSync(`${process.cwd()}/src/code.mjs`, { encoding: 'utf-8' });
import velto from '@velto/babel-plugin-velto';

const result = transformSync(code, {
  plugins: [velto],
});

fs.writeFileSync(`${process.cwd()}/src/result.mjs`, result.code);
