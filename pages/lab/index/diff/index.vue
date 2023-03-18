<template>
  <app-layout title="Diff" v-bind="{ drawerShow: false, fluid: false }">
    <v-row>
      <v-col cols="12" md="6">
        <div>Original</div>
        <app-monaco style="height:40vh;" v-model="original" @update:modelValue="parseDiffGit($event)"></app-monaco>
      </v-col>
      <v-col cols="12" md="6">
        <div>Modified</div>
        <app-monaco style="height:40vh;" v-model="modified"></app-monaco>
      </v-col>
      <v-col cols="12" md="12">
        <div>Diff</div>
        <app-monaco-diff style="height:40vh;" :model-value="original" :modified="modified"></app-monaco-diff>
      </v-col>
    </v-row>
  </app-layout>
</template>

<script>
  export default {
    meta: {
      active: true,
      icon: 'mdi-set-left',
      name: 'Ferramenta diff',
      description: 'Comparação de códigos, textos e afins',
      source: 'https://github.com/labscriptdev/labscriptdev.github.io/tree/main/pages/lab/index/diff',
    },

    data: () => ({
      original: '',
      modified: '',
    }),

    methods: {
      parseDiffGit(code) {
        if (111 == ['<<<<<<<', '=======', '>>>>>>>'].map(src => code.includes(src) ? 1 : 0).join('')) {
          let [ original, modified ] = code.split('=======');
          
          original = original.split("\n");
          original.shift();
          this.original = original.join("\n");

          modified = modified.split("\n");
          modified.shift();
          modified.pop();
          modified.pop();
          this.modified = modified.join("\n");
        }
      },
    },
  };
</script>