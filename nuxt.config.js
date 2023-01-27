import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';
import path from 'path';
import fs from 'fs-extra';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      charset: 'utf-16',
      // viewport: 'width=500, initial-scale=1',
      titleTemplate: (title) => {
        return [title, 'Labscript.dev'].filter(value => !!value).join(' | ');
      },
      // title: '',
      meta: [
        { name: 'description', content: 'Labscript.dev Website' },
      ],
    }
  },

  css: [
    '@mdi/font/css/materialdesignicons.css',
    // 'leaflet/dist/leaflet.css',
  ],

  modules: [

    // https://vueuse.org/guide/
    ['@vueuse/nuxt', {}],
    
    // https://content.nuxtjs.org/
    ['@nuxt/content', {}],

  ],

  build: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['javascript', 'html', 'css', 'php'],
      }),
    ],
  },

  hooks: {
    async 'build:done'(nuxt) {
      const pathFrom = path.join(__dirname, '.output', 'public');
      const pathTo = path.join(__dirname, 'docs');
      await fs.rmSync(pathTo, { recursive: true, force: true });
      await fs.copySync(pathFrom, pathTo);
    },
  },
});
