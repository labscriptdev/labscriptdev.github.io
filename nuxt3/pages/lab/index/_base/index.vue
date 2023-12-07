<template>
  <app-layout>
    <nuxt-page />

    <template #drawer>
      <v-list>
        <template v-for="p in pages">
          <v-list-item :title="p.name" :prepend-icon="p.icon" :to="p.url" />
        </template>
      </v-list>
    </template>
  </app-layout>
</template>

<script>
export default {
  meta: {
    active: false,
    icon: "mdi-circle",
    name: "Base",
    baseUrl: "/lab/_base",
    description: "Base file structure",
    source:
      "https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/base",
  },

  data() {
    return {
      pages: (() => {
        let files = Object.entries(
          import.meta.glob("./index/**/*.vue", {
            import: "default",
            eager: true,
            // as: 'raw',
          })
        );

        return files
          .filter(([path, file]) => !!file.meta)
          .map(([path, file]) => {
            const url =
              this.$options.meta.baseUrl +
              path.replace("/index.vue", "").replace("./index", "");
            return {
              url,
              icon: "mdi-circle",
              name: "Default",
              active: false,
              order: 0,
              ...(file.meta || {}),
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
