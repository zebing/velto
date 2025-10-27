import { transformAsync, BabelFileResult } from '@babel/core';
import veltoServer from '@velto/babel-plugin-velto-server';
import velto from '@velto/babel-plugin-velto';
import { defineConfig } from 'vite'

export default defineConfig((option) =>{
  return {
    mode: 'development',
    build: {
      minify: false,
    },
    plugins: [vitePluginLite()],
  }
})

function vitePluginLite() {

  let projectRoot = process.cwd();

  return {
    name: 'vite-plugin-velto',
    enforce: 'pre',

    async transform(source, id, option) {
      const isSSR = this.environment.config.consumer === 'server';
      if (!(/\.ts[x]?$/i.test(id))) {
        return null;
      }

      id = id.replace(/\?.+$/, '');
      const veltoPlugin = isSSR ? veltoServer : velto;

      const { code, map } = await transformAsync(source, {
        root: projectRoot,
        filename: id,
        sourceFileName: id,
        presets: [],
        plugins: [veltoPlugin, ['@babel/plugin-transform-typescript', { isTSX: true, allowExtensions: true }]],
        ast: false,
        sourceMaps: true,
      });

      return { code: code ?? undefined, map };
    },
  };
}