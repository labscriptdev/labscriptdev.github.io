<template>
  <app-layout title="Ferramentas de texto" :fluid="false">
    <v-textarea v-model="text" label="Texto" auto-grow></v-textarea>
    <nuxt-page :text="text" />

    <template #drawer>
      <v-list>
        <v-list-item
          v-for="(_tool, i) in tools"
          :key="i"
          :prepend-icon="_tool.icon"
          :to="_tool.to"
        >
          <v-list-item-title>
            {{ _tool.name }}
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
        tools: (() => {
          let files = Object.entries(import.meta.glob('./index/**/info.js', {
            import: 'default',
            eager: true,
          }));

          files = files.map(([file, info]) => {
            return {
              icon: false,
              to: file.replace(/.+index\/(.+?)\/.+/g, `/tool/text/$1`),
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