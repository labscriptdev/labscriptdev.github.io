<template>
  <app-layout>
    <pre>{{ $route.path }}</pre>
  </app-layout>
</template>

<script>
  export default {
    meta: {
      active: false,
      icon: 'mdi-laravel',
      name: 'Gerador Laravel',
      description: 'Criar arquivos para o frameworl Laravel baseado em estrutura de banco de dados',
    },
  };
</script>