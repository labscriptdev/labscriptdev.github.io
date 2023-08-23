<template>
  <div v-if="!props.editor">
    <v-sheet elevation="5" width="400" height="400" class="d-flex align-center justify-center">
      <div style="white-space:pre; text-align:center;" v-html="modelValue.text"></div>
    </v-sheet>
  </div>
  
  <div v-if="props.editor">
    <v-textarea label="title" v-model="modelValue.text" />
  </div>
</template>

<script setup>
  import { reactive, defineProps, defineEmits } from 'vue';

  const props = defineProps({
    editor: { type: Boolean, default: false },
    modelValue: {
      type: Object,
      default: () => ({
        text: 'Hello World',
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