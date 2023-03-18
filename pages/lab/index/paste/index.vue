<template>
  <app-layout>
    <pre>{{ $route.path }}</pre>
  </app-layout>
</template>

<script>
  export default {
    meta: {
      active: false,
      icon: 'mdi-content-paste',
      name: 'Paste',
      description: 'Cole, edite e baixe arquivos de maneira rápida',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/paste',
    },
  };
</script>