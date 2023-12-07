import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },

  app: {
    head: {
      charset: "utf-16",
      // viewport: 'width=500, initial-scale=1',
      titleTemplate: (title) => {
        return [title, "Labscript.dev"].filter((value) => !!value).join(" | ");
      },
      // title: '',
      meta: [{ name: "description", content: "Labscript.dev Website" }],
    },
  },

  css: ["leaflet/dist/leaflet.css"],

  modules: [
    // https://vueuse.org/guide/
    ["@vueuse/nuxt", {}],

    // https://content.nuxtjs.org/
    ["@nuxt/content", {}],
  ],

  build: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ["javascript", "html", "css", "php"],
      }),
    ],
  },

  // nitro: {
  //   output: {
  //     dir: '.output',
  //     serverDir: '.output/server',
  //     publicDir: '../docs', //.output/public
  //   },
  // },
});
