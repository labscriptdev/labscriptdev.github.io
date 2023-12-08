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
  // const fragment = new DocumentFragment();
  // fragment.appendChild(elementRef.value);
  // const object = new CSS3DObject(fragment);

  const object = new CSS3DObject(elementRef.value);
  object.position.set(props.x, props.y, props.z);

  // object.rotateX(props.rx);
  // object.rotateY(props.ry);
  // object.rotateZ(props.rz);

  object.rotation.x = props.rx;
  object.rotation.y = props.ry;
  object.rotation.z = props.rz;

  // if (!instance.ctx.$parent.threeApp.css3dGroup) {
  //   instance.ctx.$parent.threeApp.css3dGroup = new THREE.Group();
  //   instance.ctx.$parent.threeApp.scene.add(
  //     instance.ctx.$parent.threeApp.css3dGroup
  //   );
  // }

  // instance.ctx.$parent.threeApp.css3dGroup.add(object);

  instance.ctx.$parent.threeApp.scene.add(object);
};

onMounted(() => {
  setTimeout(() => {
    threeInit();
  }, 100);
});
</script>
