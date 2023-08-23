<template>
  <app-layout>
    <vuelementor v-model="content" />
    <pre>content: {{ content }}</pre>
  </app-layout>
</template>

<script>
  export default {
    meta: {
      active: false,
      icon: 'mdi-vuejs',
      name: 'Vuelementor',
      description: 'Vuelementor component',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/vuelementor',
    },

    data() {
      return {
        content: {
          sections: [
            {
              columns: [
                {
                  elements: [
                    { file: 'card.vue' },
                    { file: 'test.vue' },
                  ],
                },
              ],
            },
          ],
        },
      };
    },
  };
</script>