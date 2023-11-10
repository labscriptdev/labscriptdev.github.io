<template>
  <app-layout containerWidth="100%">
    <!-- <template #drawer> drawer </template> -->
    <app-dashboard />
  </app-layout>
</template>

<script>
export default {
  meta: {
    active: false,
    icon: "mdi-circle",
    name: "Dashboard",
    description: "Base file structure",
    source:
      "https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/base",
  },
};
</script>
