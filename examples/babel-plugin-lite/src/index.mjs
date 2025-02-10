import fs from 'fs';
import { transformSync } from '@babel/core';
const code = fs.readFileSync(`${process.cwd()}/src/code.mjs`, { encoding: 'utf-8' });
import lite from '@lite/babel-plugin-lite';

const result = transformSync(code, {
  plugins: [lite],
});

fs.writeFileSync(`${process.cwd()}/src/result.mjs`, result.code);
