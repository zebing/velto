import vitePluginLite from '@lite/vite-plugin-lite';

export default {
  mode: 'development',
  build: {
    minify: false,
  },
  plugins: [vitePluginLite()],
}