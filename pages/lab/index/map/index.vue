<template>
  <app-layout>
    <pre>{{ $route.path }}</pre>
  </app-layout>
</template>

<script>
  export default {
    meta: {
      active: false,
      icon: 'mdi-map-search',
      name: 'Mapa',
      description: 'Visualizador de mapa',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/map',
    },
  };
</script>