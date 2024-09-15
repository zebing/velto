import fs from 'fs';
import { transformSync } from '@babel/core';
import babelPluginLite from '../../dist';

const code = fs.readFileSync(`${__dirname}/jsxElement.ts`, { encoding: 'utf-8' });

describe('compile', () => {
  it('program', () => {
    const result = transformSync(code, {
      filename: 'index.js',
      plugins: [babelPluginLite],
    });
  
    expect(result?.code).toMatchSnapshot();
  })
})