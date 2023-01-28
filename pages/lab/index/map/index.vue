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
    },
  };
</script>