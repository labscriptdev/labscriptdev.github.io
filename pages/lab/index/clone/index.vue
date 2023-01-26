<template>
  <app-layout :container-card="false" container-width="100%">

    <div class="rounded overflow-hidden">
      <v-system-bar
        color="grey-lighten-3"
        style="position:static!important; width:100%!important;"
        class="pa-4"
      >
        <v-icon icon="mdi-wifi-strength-4"></v-icon>
        <v-icon icon="mdi-signal" class="ms-2"></v-icon>
        <v-icon icon="mdi-battery" class="ms-2"></v-icon>
        <span class="ms-2">{{ $dayjs().format('HH:mm') }}</span>
      </v-system-bar>
      <div class="page-lab-clone-system-content bg-white">
        <div style="max-width:1200px; margin:0 auto;">
          <nuxt-page />
        </div>
      </div>
    </div>

    <template #drawer>
      <v-list>
        <v-list-item
          v-for="_item in items"
          :key="_item.to"
          :to="_item.to"
          :prepend-icon="_item.icon"
        >{{ _item.name }}</v-list-item>
      </v-list>
    </template>
  </app-layout>
</template>

<style>
  .page-lab-clone-system-content > * {
    height: calc(100vh - 150px) !important;
    overflow: auto;
    zoom: .8;
  }

  .page-lab-clone-system-content * {
    outline: dashed 1px blue;
  }
</style>

<script>
  export default {
    data() {
      return {
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