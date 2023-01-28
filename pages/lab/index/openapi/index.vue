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
    },
  };
</script>