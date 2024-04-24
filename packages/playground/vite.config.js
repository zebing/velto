import vitePluginLite from '@lite/vite-plugin-lite';

export default {
  build: {
    minify: false,
  },
  plugins: [vitePluginLite()],
}