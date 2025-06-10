import fs from 'fs';
import { transformSync } from '@babel/core';
const code = fs.readFileSync(`${process.cwd()}/src/code.mjs`, { encoding: 'utf-8' });
import veltoServer from '@velto/babel-plugin-velto-server';

const result = transformSync(code, {
  plugins: [veltoServer],
});

fs.writeFileSync(`${process.cwd()}/src/result.mjs`, result.code);
