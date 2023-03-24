<template>
  <div>
    Choose one of the algorithms
  </div>
</template>

<script>
  export default {
    meta: {
      icon: null,
      name: 'Home',
      order: -1,
    },

    props: {
      pages: {
        type: Array,
        default: () => ([]),
      },
    },
  };
</script>