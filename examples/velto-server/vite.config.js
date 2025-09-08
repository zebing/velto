import { transformAsync, BabelFileResult } from '@babel/core';
import velto from '@velto/babel-plugin-velto-server';
import { defineConfig } from 'vite'

export default defineConfig({
  mode: 'development',
  build: {
    minify: false,
  },
  plugins: [vitePluginLite()],
})

function vitePluginLite() {

  let projectRoot = process.cwd();

  return {
    name: 'vite-plugin-velto',
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
        presets: [],
        plugins: [velto, ['@babel/plugin-transform-typescript', { isTSX: true, allowExtensions: true }]],
        ast: false,
        sourceMaps: true,
      });

      return { code: code ?? undefined, map };
    },
  };
}