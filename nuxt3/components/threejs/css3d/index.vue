<template>
  <div
    ref="canvasRef"
    style="width: 100%; height: 400px; border: solid 1px red"
  >
    <slot></slot>
  </div>
  <pre>{{ app }}</pre>
</template>

<script setup>
import { ref, reactive, defineProps, defineEmits, onMounted } from "vue";

const props = defineProps({
  modelValue: { type: [String], default: "" },
});

const emit = defineEmits(["update:modelValue"]);

// ThreeJS

import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";

const canvasRef = ref(null);

const app = reactive({
  width: 0,
  height: 0,
  init() {
    this.width = canvasRef.value.offsetWidth;
    this.height = canvasRef.value.offsetHeight;

    let camera = new THREE.PerspectiveCamera(
      50,
      this.width / this.height,
      1,
      5000
    );
    camera.position.set(500, 350, 750);

    let scene = new THREE.Scene();

    let renderer = new CSS3DRenderer();
    renderer.setSize(this.width, this.height);
    canvasRef.value.appendChild(renderer.domElement);
    console.log(canvasRef.value);
  },
});

onMounted(() => {
  app.init();
});
</script>
