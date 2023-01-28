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
    },
  };
</script>