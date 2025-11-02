import fs from 'fs';
import { transformSync } from '@babel/core';
const code = fs.readFileSync(`${process.cwd()}/src/code.mjs`, { encoding: 'utf-8' });
import veltoServer from '@velto/babel-plugin-velto-server';
const id = '/Users/zebing/project/velto/examples/babel-plugin-velto-server/src/index.mjs';

const result = transformSync(code, {
  filename: id,
  sourceFileName: id,
  plugins: [veltoServer],
});

fs.writeFileSync(`${process.cwd()}/src/result.mjs`, result.code);
