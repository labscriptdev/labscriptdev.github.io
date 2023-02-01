<template>
  <app-layout>
    <nuxt-page />

    <template #drawer>
      <v-list>
        <v-list-item
          v-for="p in pages"
          :key="p.slug"
          :title="p.name"
          :prepend-icon="p.icon"
          :to="`/lab/base/${p.slug}`"
        ></v-list-item>
      </v-list>
    </template>
  </app-layout>
</template>

<script>
  export default {
    meta: {
      active: false,
      icon: 'mdi-globe',
      name: 'Base',
      description: 'Base file structure',
    },

    data() {
      return {
        pages: (() => {
          let files = Object.entries(import.meta.glob('./index/**/*.vue', {
            import: 'default',
            eager: true,
            // as: 'raw',
          }));

          console.log('/lab/index/base', files);

          return files
            .filter(([path, file]) => !!file.meta)
            .map(([path, file]) => {
              return {
                slug: file.__file.split('/').at(-2).replace(/^index$/g, ''),
                icon: 'mdi-circle',
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