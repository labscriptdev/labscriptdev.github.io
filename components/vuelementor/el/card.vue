<template>
  <v-card v-if="!editable">
    <v-card-title>
      {{ title }}
    </v-card-title>
    <v-card-text class="border-b">
      {{ body }}
    </v-card-text>
    <v-card-actions>
      {{ footer }}
    </v-card-actions>
  </v-card>

  <div v-if="editable">
    <v-text-field v-model="data.title" />
  </div>
</template>

<script setup>
  import { defineProps, watch, defineEmits, ref } from 'vue';

  const props = defineProps({
    editable: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Title',
    },
    body: {
      type: String,
      default: 'Body',
    },
    footer: {
      type: String,
      default: 'Footer',
    },
  });

  const emit = defineEmits([]);

  const data = ref(JSON.parse(JSON.stringify(props)));

  watch([ data.value ], ([ dataNew ]) => {
    for(let i in dataNew) {
      if (dataNew[i] == props[i]) continue;
      console.log(`update:${i}`, dataNew[i]);
      emit(`update:${i}`, dataNew[i]);
    }
  });
</script>