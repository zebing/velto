import { transformAsync, BabelFileResult } from '@babel/core';
import lite from '@lite/babel-plugin-lite';

export default {
  mode: 'development',
  build: {
    minify: false,
  },
  plugins: [vitePluginLite()],
}

function vitePluginLite() {

  let projectRoot = process.cwd();

  return {
    name: 'vite-plugin-lite',
    enforce: 'pre',

    async transform(source, id) {
      if (!(/\.ts[x]?$/i.test(id))) {
        return null;
      }

      id = id.replace(/\?.+$/, '');

      const { code, map } = await transformAsync(source, {
        root: projectRoot,
        filename: id,
        sourceFileName: id,
        presets: ['@babel/preset-typescript'],
        plugins: [lite],
        ast: false,
        sourceMaps: true,
      });

      return { code: code ?? undefined, map };
    },
  };
}