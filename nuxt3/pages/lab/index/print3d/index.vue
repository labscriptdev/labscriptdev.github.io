<template>
  <app-layout>
    <pre>{{ $route.path }}</pre>
  </app-layout>
</template>

<script>
  export default {
    meta: {
      active: false,
      icon: 'mdi-cube',
      name: 'Print 3D Simulator',
      description: 'Aplicação para simular artes em ambientes tridimensionais',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/print3d',
    },
  };
</script>