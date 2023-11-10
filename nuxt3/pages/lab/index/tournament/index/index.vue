<template>
  <div>
    Default page
  </div>
</template>

<script>
  export default {
    meta: {
      icon: 'mdi-numeric-0',
      name: 'Home',
    },

    data() {
      return {
        test: true,
      };
    },

    methods: {
      say(text) {
        console.log(text);
      },
    },
  };
</script>