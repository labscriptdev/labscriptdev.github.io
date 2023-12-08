<template>
  <div style="border: solid 1px green; padding: 5px">
    <div
      ref="canvasRef"
      style="width: 100%; height: 400px; border: solid 1px red"
    ></div>

    <slot></slot>
    <pre>{{ threeApp.scene.children }}</pre>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
  defineExpose,
} from "vue";

const props = defineProps({
  modelValue: { type: [String], default: "" },
});

const emit = defineEmits(["create", "update", "destroy"]);

// ThreeJS

import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";

const canvasRef = ref(null);

const threeApp = reactive({
  width: 0,
  height: 0,
  camera: false,
  scene: false,
  renderer: false,
  element(id, x, y, z, ry) {
    const div = document.createElement("div");
    div.style.width = "480px";
    div.style.height = "360px";
    div.style.backgroundColor = "#000";

    const iframe = document.createElement("iframe");
    iframe.style.width = "480px";
    iframe.style.height = "360px";
    iframe.style.border = "0px";
    iframe.src = ["https://www.youtube.com/embed/", id, "?rel=0"].join("");
    div.appendChild(iframe);

    const object = new CSS3DObject(div);
    object.position.set(x, y, z);
    object.rotation.y = ry;

    return object;
  },
  init() {
    this.width = canvasRef.value.offsetWidth;
    this.height = canvasRef.value.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      50,
      this.width / this.height,
      1,
      5000
    );
    this.camera.position.set(500, 350, 750);

    this.scene = new THREE.Scene();

    this.renderer = new CSS3DRenderer();
    this.renderer.setSize(this.width, this.height);
    canvasRef.value.appendChild(this.renderer.domElement);

    // const group = new THREE.Group();
    // group.add(this.element("SJOz3qjfQXU", 0, 0, 240, 0));
    // group.add(this.element("Y2-xZ-1HE-Q", 240, 0, 0, Math.PI / 2));
    // group.add(this.element("IrydklNpcFI", 0, 0, -240, Math.PI));
    // group.add(this.element("9ubytEsCaS0", -240, 0, 0, -Math.PI / 2));
    // this.scene.add(group);

    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
      emit("update", this);
      this.trigger("update", this);
    };

    animate();
    emit("create", this);
    this.trigger("create", this);
  },
  stop() {
    this.camera = false;
  },
  events: [],
  on(name, callback) {
    this.events.push({ name, callback });
  },
  trigger(eventName) {
    this.events.map((item) => {
      if (eventName != item.name) return;
      item.callback(this);
    });
  },
});

onMounted(() => {
  threeApp.init();
});

onUnmounted(() => {
  threeApp.stop();
});

defineExpose({ threeApp });
</script>
