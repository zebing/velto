import { transformAsync, BabelFileResult } from '@babel/core';
import type { Plugin } from 'vite';
import lite from '@lite/babel-plugin-lite';

export default function solidPlugin(): Plugin {

  let projectRoot = process.cwd();

  return {
    name: 'vite-plugin-lite',
    enforce: 'pre',

    async transform(source, id) {
      if (!(/\.tsx$/i.test(id))) {
        return null;
      }

      id = id.replace(/\?.+$/, '');

      const { code, map } = await transformAsync(source, {
        root: projectRoot,
        filename: id,
        sourceFileName: id,
        plugins: ['typescript', lite],
        ast: false,
        sourceMaps: true,
      }) as BabelFileResult;

      return { code: code ?? undefined, map };
    },
  };
}
