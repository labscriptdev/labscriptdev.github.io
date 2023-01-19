<template>
  <app-layout title="Ferramentas de texto" :fluid="false" container-style="max-width:1000px;">
    <v-textarea v-model="text" label="Texto"></v-textarea>
    <nuxt-page :text="text" />

    <template #drawer>
      <v-list>
        <v-list-item
          v-for="(_demo, i) in demos"
          :key="i"
          :prepend-icon="_demo.icon"
          :to="_demo.to"
        >
          <v-list-item-title>
            {{ _demo.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </app-layout>
</template>

<script>
  export default {
    data() {
      return {
        text: '',
        demos: (() => {
          let files = Object.entries(import.meta.glob('./index/**/info.js', {
            import: 'default',
            eager: true,
          }));

          files = files.map(([file, info]) => {
            return {
              icon: false,
              to: file.replace(/.+index\/(.+?)\/.+/g, `/lab/text/$1`),
              name: '',
              ...info
            };
          });

          return files;
        })(),
      };
    },
  };
</script>