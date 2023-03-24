<template>
  <app-layout>
    <nuxt-page :pages="pages" />

    <template #drawer>
      <v-list>
        <v-list-item
          v-for="p in pages"
          :key="p.slug"
          :title="p.name"
          :prepend-icon="p.icon"
          :to="`/lab/algorithm/${p.slug}`"
          :exact="true"
        ></v-list-item>
      </v-list>
    </template>
  </app-layout>
</template>

<script>
  export default {
    meta: {
      active: true,
      icon: 'mdi-code-json',
      name: 'Algorithms',
      description: 'Types of algorithms',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/algorithm',
    },

    data() {
      return {
        pages: (() => {
          let files = Object.entries(import.meta.glob('./index/**/*.vue', {
            import: 'default',
            eager: true,
            // as: 'raw',
          }));

          return files
            .filter(([path, file]) => !!file.meta)
            .map(([path, file]) => {
              return {
                slug: path.split('/').at(-2).replace(/^index$/g, ''),
                icon: null,
                name: 'Default',
                active: false,
                order: 0,
                ...(file.meta || {})
              };
            })
            .sort((a, b) => {
              if (a.order < b.order) return -1;
              if (a.order > b.order) return 1;
              return 0;
            });
        })(),
      };
    },
  };
</script>