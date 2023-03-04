<template>
  <v-card v-if="!editable">
    <v-card-title>
      {{ modelValue.title }}
    </v-card-title>
    <v-card-text class="border-b">
      {{ modelValue.body }}
    </v-card-text>
    <v-card-actions>
      {{ modelValue.footer }}
    </v-card-actions>
  </v-card>

  <div v-if="editable">
    <v-text-field v-model="modelValue.title" label="Title" />
    <v-text-field v-model="modelValue.body" label="Body" />
    <v-text-field v-model="modelValue.footer" label="Footer" />
  </div>
</template>

<script>export default { name: 'vuelementor-el-card' };</script>

<script setup>
  import { defineProps, watch, defineEmits, ref, computed } from 'vue';

  const props = defineProps({
    editable: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  });

  const emit = defineEmits([]);

  const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
  });
</script>