<template>
  <div ref="mermaidRef">{{ props.modelValue }}</div>
</template>

<script setup>
  import mermaid from 'mermaid';
  import { ref, reactive, watch, defineProps, defineEmits, onMounted } from 'vue';

  const props = defineProps({
    modelValue: {
      type: [ String ],
      default: '',
    },
  });

  const emit = defineEmits([
    'update:modelValue',
  ]);

  const mermaidRef = ref(null);

  watch([ props ], ([ propsNew ]) => {
    mermaidRef.value.removeAttribute('data-processed');
    setTimeout(() => {
      mermaid.run({ nodes: [ mermaidRef.value ] });
    }, 0);
  });

  onMounted(() => {
    mermaid.initialize({ startOnLoad: false });
    mermaid.run({ nodes: [ mermaidRef.value ] });
  });
</script>