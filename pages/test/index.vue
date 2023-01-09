<template>
  <app-layout>
    <nuxt-page />

    <template #drawer>
      <v-list>
        <v-list-item
          v-for="_file in files"
          :key="_file.to"
          :to="_file.to"
        >
          {{ _file.name }}
        </v-list-item>
      </v-list>
    </template>
  </app-layout>
</template>

<script>
  export default {
    data: () => ({
      files: (() => {
        let files = Object.values(import.meta.glob('./**/index.vue', {
          import: 'default',
          eager: true,
        }));
        
        return files.map(file => {
          const name = file.__file.replace(/.+\/index\/(.+?)\/index.vue/g, '$1');
          return { name, to: `/test/${name}`};
        });
      })(),
    }),
  };
</script>