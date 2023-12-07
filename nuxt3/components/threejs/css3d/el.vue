<template>
  <div>
    <slot>Hello</slot>
  </div>
</template>

<script setup>
import {
  reactive,
  defineProps,
  defineEmits,
  onMounted,
  getCurrentInstance,
} from "vue";
const instance = getCurrentInstance();

const props = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  z: { type: Number, default: 0 },
  xr: { type: Number, default: 0 },
  yr: { type: Number, default: 0 },
  zr: { type: Number, default: 0 },
});

const emit = defineEmits(["update:modelValue"]);

onMounted(() => {
  console.clear();
  console.log({ ...instance.ctx.$parent });
});
</script>
