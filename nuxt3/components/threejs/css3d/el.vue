<template>
  <div ref="elementRef">
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";

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
  rx: { type: Number, default: 0 },
  ry: { type: Number, default: 0 },
  rz: { type: Number, default: 0 },
});

const emit = defineEmits(["update:modelValue"]);

const elementRef = ref(null);

const threeInit = () => {
  const object = new CSS3DObject(elementRef.value);
  object.position.set(props.x, props.y, props.z);
  object.rotation.x = props.xr;
  object.rotation.y = props.xy;
  object.rotation.z = props.xz;

  if (!instance.ctx.$parent.threeApp.css3dGroup) {
    instance.ctx.$parent.threeApp.css3dGroup = new THREE.Group();
    instance.ctx.$parent.threeApp.scene.add(
      instance.ctx.$parent.threeApp.css3dGroup
    );
  }

  instance.ctx.$parent.threeApp.css3dGroup.add(object);

  console.log({ ...props });
};

onMounted(() => {
  setTimeout(() => {
    // console.clear();
    // console.log(instance.ctx.$parent.threeApp);
    threeInit();
  }, 100);
});
</script>
