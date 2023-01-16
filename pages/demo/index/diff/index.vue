<template>
  <app-layout title="Diff" v-bind="{ drawerShow: false, fluid: false }">
    <v-row>
      <v-col cols="12" md="6">
        <div>Original</div>
        <app-monaco style="height:40vh;" v-model="original"></app-monaco>
      </v-col>
      <v-col cols="12" md="6">
        <div>Modified</div>
        <app-monaco style="height:40vh;" v-model="modified"></app-monaco>
      </v-col>
      <v-col cols="12" md="12">
        <div>Diff</div>
        <app-monaco-diff style="height:40vh;" :model-value="original" :modified="modified"></app-monaco-diff>
      </v-col>
      <v-col cols="12">
        <pre>{{ $data }}</pre>
      </v-col>
    </v-row>
  </app-layout>
</template>

<script>
  export default {
    data: () => ({
      original: '',
      modified: '',
    }),
  };
</script>