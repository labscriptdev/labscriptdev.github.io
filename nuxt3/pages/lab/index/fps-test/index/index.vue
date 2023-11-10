<template>
  <div>
    Selecione um teste
  </div>
</template>

<script>
  export default {
    meta: {
      icon: false,
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