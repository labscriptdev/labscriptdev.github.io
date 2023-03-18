<template>
  <app-layout>
    <pre>{{ $route.path }}</pre>
  </app-layout>
</template>

<script>
  export default {
    meta: {
      active: false,
      icon: 'mdi-emoticon-poop',
      name: 'Gerador de memes',
      description: 'Aplicação para gerar memes de maneira rápida',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/meme',
    },
  };
</script>