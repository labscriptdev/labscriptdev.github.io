<template>
  <div style="border: solid 1px green; padding: 5px">
    <div
      ref="canvasRef"
      style="width: 100%; height: 400px"
      @click="app.trigger('click', { event: $event })"
    ></div>

    <div v-if="app.ready">
      <slot></slot>
    </div>

    <pre>{{ app.input }}</pre>
    <pre>{{ app.key }}</pre>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  defineEmits,
  onMounted,
  onUnmounted,
  defineExpose,
} from "vue";

const emit = defineEmits(["create", "update"]);

// ThreeJS

import * as THREE from "three";
import {
  CSS3DRenderer,
  CSS3DObject,
} from "three/addons/renderers/CSS3DRenderer.js";

const canvasRef = ref(null);

const canvasEvents = {
  keydown(ev) {
    // console.log(ev);
    // ctrlKey
    // shiftKey
    // altKey
    app.key[ev.key] = true;
    Object.entries(app.input).map(([key, keys]) => {
      app.key[key] = keys.includes(ev.key);
    });
  },
  keyup(ev) {
    app.key[ev.key] = false;
    Object.entries(app.input).map(([key, keys]) => {
      app.key[key] = false;
    });
  },
};

const app = reactive({
  ready: false,
  width: 0,
  height: 0,
  camera: false,
  scene: false,
  renderer: false,
  input: {},
  key: {},
  create() {
    this.destroy();
    console.log("init");

    this.ready = true;
    this.width = canvasRef.value.offsetWidth;
    this.height = canvasRef.value.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      50,
      this.width / this.height,
      1,
      5000
    );
    // this.camera.position.set(500, 350, 750);

    this.scene = new THREE.Scene();

    this.renderer = new CSS3DRenderer();
    this.renderer.setSize(this.width, this.height);
    canvasRef.value.textContent = "";
    canvasRef.value.appendChild(this.renderer.domElement);

    const animate = () => {
      if (!this.ready) return;
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
      emit("update", this);
      this.trigger("update");
    };

    document.addEventListener("keydown", canvasEvents.keydown);
    document.addEventListener("keyup", canvasEvents.keyup);

    animate();
    emit("create", this);
    this.trigger("create");
  },
  destroy() {
    console.log("stop");
    this.ready = false;
    this.camera = false;
    this.scene = false;
    this.renderer = false;
    document.removeEventListener("keydown", canvasEvents.keydown);
    document.removeEventListener("keyup", canvasEvents.keyup);
  },
  events: [],
  on(name, callback) {
    if (typeof name == "object") {
      Object.entries(name).map(([name, callback]) => {
        this.events.push({ name, callback });
      });
      return;
    }
    this.events.push({ name, callback });
  },
  trigger(eventName, arg = {}) {
    this.events.map((item) => {
      if (eventName != item.name) return;
      item.callback({ app: this, ...arg });
    });
  },
});

onMounted(() => {
  app.create();
});

onUnmounted(() => {
  app.destroy();
});

defineExpose({ app });
</script>
