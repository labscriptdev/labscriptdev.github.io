<template>
  <app-layout>
    <pre>{{ $route.path }}</pre>
  </app-layout>
</template>

<script>
  export default {
    meta: {
      active: false,
      icon: 'mdi-check',
      name: 'OpenAPI',
      description: 'Alternativa para visualização e consumo de endpoints de API',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/openapi',
    },
  };
</script>