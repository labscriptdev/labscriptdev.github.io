<template>
  <app-layout :container-card="false" container-width="100%">

    <app-device
      :type="item.device"
      :src="`${route.path}/${route.query.path || defaultPath}`"
      style="height: calc(100vh - 130px);"
    />

    <!-- <ul>
      <template v-for="_item in items">
        <li><nuxt-link :to="`/lab/clone/${_item.path}`">{{ _item.name }}</nuxt-link></li>
      </template>
    </ul> -->

    <template #drawer>
      <v-list>
        <v-list-item
          v-for="_item in items"
          :key="_item.to"
          :to="`?path=${_item.path}`"
          :prepend-icon="_item.icon"
        >{{ _item.name }}</v-list-item>
      </v-list>
    </template>
  </app-layout>
</template>

<script setup>
  import { computed } from 'vue';

  const defaultPath = 'nubank';
  const route = useRoute();

  const items = (() => {
    const files = Object.entries(import.meta.glob('./**/info.js', { import: 'default', eager: true }));
    return files.map(([file, info]) => {
      const path = file.replace('./', '').replace('/info.js', '');
      const device = info.device || 'mobile';
      const figma = info.figma || '';
      return { icon: false, path, name: '', device, figma, ...info };
    });
  })();

  const item = computed(() => {
    return items.filter((o) => o.path == (route.query.path || defaultPath)).at(0);
  });
</script>

<script>
  export default {
    meta: {
      active: false,
      icon: 'mdi-content-copy',
      name: 'App Clone',
      description: 'Vuetify app clone view',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/clone',
    },
  };
</script>