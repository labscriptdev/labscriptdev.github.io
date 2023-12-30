<template>
  <div ref="elementRef">
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { CSS3DObject } from "three/addons/renderers/CSS3DRenderer.js";

import {
  reactive,
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
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

let app, object;
const threeInit = () => {
  app = instance.ctx.$parent.app;

  object = new CSS3DObject(elementRef.value);
  object.position.set(props.x, props.y, props.z);

  object.rotateX(props.rx);
  object.rotateY(props.ry);
  object.rotateZ(props.rz);

  const holder = new THREE.Group();
  holder.add(object);

  const geometry = new THREE.BoxGeometry(100, 100, 100);
  const material = new THREE.MeshBasicMaterial();
  material.color.set("black");
  material.opacity = 0;
  material.blending = THREE.NoBlending;
  material.side = THREE.DoubleSide;
  holder.add(new THREE.Mesh(geometry, material));

  app.scene.add(holder);
};

onMounted(() => {
  setTimeout(() => {
    threeInit();
  }, 100);
});

// onUnmounted(() => {
//   app.scene.remove(object);
// });
</script>
