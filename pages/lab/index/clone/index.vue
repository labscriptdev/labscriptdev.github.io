<template>
  <app-layout :container-card="false" container-width="100%">

    <nuxt-page />

    <template #drawer>
      <v-list>
        <v-list-item
          v-for="_item in items"
          :key="_item.to"
          :to="_item.to"
          :prepend-icon="_item.icon"
        >{{ _item.name }}</v-list-item>
      </v-list>
      <v-slider :label="`Zoom: ${style.zoom}`" v-model.number="style.zoom" :min=".5" :max="2" :step="0.01" />
    </template>
  </app-layout>
</template>

<style>
  .page-lab-clone-system-content > * {
    position: relative;
    height: calc(100vh - 150px) !important;
    overflow: auto;
  }

  /* .page-lab-clone-system-content * {
    outline: dashed 1px #00000011;
  } */
</style>

<script>
  export default {
    meta: {
      active: false,
      icon: 'mdi-content-copy',
      name: 'App Clone',
      description: 'Vuetify app clone view',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/clone',
    },

    data() {
      return {
        style: {
          zoom: .9,
        },
        items: (() => {
          let files = Object.entries(import.meta.glob('./index/**/info.js', {
            import: 'default',
            eager: true,
          }));

          return files.map(([file, info]) => {
            const paths = this.$route.path.split('/').filter(path => path);
            return {
              icon: false,
              to: file.replace(/.+index\/(.+?)\/.+/g, `/${paths[0]}/${paths[1]}/$1`),
              name: '',
              ...info
            };
          });
        })(),
      };
    },
  };
</script>