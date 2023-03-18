<template>
  <app-layout>
    <pre>{{ $route.path }}</pre>
  </app-layout>
</template>

<script>
  export default {
    meta: {
      active: false,
      icon: 'mdi-brain',
      name: 'MBTI',
      description: 'Teste MBTi',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/mbti',
    },
  };
</script>