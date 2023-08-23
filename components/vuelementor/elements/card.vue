<template>
  <div v-if="!props.editor">
    <v-card>
      <v-card-title>{{ modelValue.title }}</v-card-title>
      <v-card-text>{{ modelValue.text }}</v-card-text>
    </v-card>
  </div>
  
  <div v-if="props.editor">
    <v-text-field label="title" v-model="modelValue.title" />
    <v-textarea label="title" v-model="modelValue.text" />
  </div>
</template>

<script setup>
  import { reactive, defineProps, watch, defineEmits } from 'vue';

  const props = defineProps({
    editor: { type: Boolean, default: false },
    modelValue: {
      type: Object,
      default: () => ({
        title: 'Card Title',
        text: 'Card Text',
      }),
    },
  });

  const emit = defineEmits([
    'update:modelValue',
  ]);

  const modelValue = reactive({ ...props.modelValue });

  watch([ props ], ([ propsNew ]) => {
    for(let i in propsNew.modelValue) {
      modelValue[i] = propsNew.modelValue[i];
    }
  });

  watch([ modelValue ], (modelValueNew) => {
    emit('update:modelValue', modelValue);
  });
</script>