<template>
  <app-layout :container-card="false" container-width="100%">

    <div class="rounded overflow-hidden">
      <v-system-bar
        color="primary"
        style="position:static!important; width:100%!important;"
        class="pa-4"
      >
        <v-icon icon="mdi-wifi-strength-4"></v-icon>
        <v-icon icon="mdi-signal" class="ms-2"></v-icon>
        <v-icon icon="mdi-battery" class="ms-2"></v-icon>
        <span class="ms-2">{{ $dayjs().format('HH:mm') }}</span>
      </v-system-bar>
      <div class="page-lab-clone-system-content bg-white" :style="style">
        <nuxt-page />
        <!-- <div style="position:relative; max-width:1200px; height:50%; margin:0 auto; border:solid 1px red;">
          <nuxt-page />
        </div> -->
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