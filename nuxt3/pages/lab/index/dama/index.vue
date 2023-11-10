<template>
  <app-layout>
    <pre>checkers: {{ checkers }}</pre>
  </app-layout>
</template>

<script setup>
  import { reactive } from 'vue';

  const useCheckers = () => {
    const r = reactive({
      turn: 1,
      positions: Array(8).fill().map((n, i) => Array(8).fill().map((n, i) => null)),
    });
    return r;
  };

  const checkers = useCheckers();
</script>

<script>
  export default {
    meta: {
      active: false,
      icon: 'arcticons:checkers',
      name: 'Dama',
      description: 'Base file structure',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/base',
    },
  };
</script>