<!--
  https://github.com/mrdoob/three.js/blob/master/examples/css3d_youtube.html
  https://discourse.threejs.org/t/using-webglrenderer-and-css3drenderer-together-hardly-works/2213/5
  https://codepen.io/trusktr/pen/RjzKJx

  TODO: Move camera forward without change "z"
-->

<template>
  <div
    ref="wrapperRef"
    @click="app.trigger('click', { event: $event })"
    style="
      position: relative;
      width: 100%;
      height: 400px;
      overflow: hidden;
      border: solid 1px green;
    "
  >
    <div
      ref="webglRendererRef"
      style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: solid 1px blue;
      "
    ></div>

    <div
      ref="css3dRendererRef"
      style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: solid 1px blue;
      "
    ></div>

    <div v-if="app.reactive.ready">
      <slot></slot>
    </div>
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

const wrapperRef = ref(null);
const css3dRendererRef = ref(null);
const webglRendererRef = ref(null);

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

const app = {
  reactive: reactive({
    ready: false,
  }),
  width: 0,
  height: 0,
  camera: false,
  scene: false,
  wrapperEl: false,
  input: {},
  key: {},
  create() {
    this.destroy();
    console.log("init");
    this.wrapperEl = wrapperRef.value;

    this.reactive.ready = true;
    this.width = css3dRendererRef.value.offsetWidth;
    this.height = css3dRendererRef.value.offsetHeight;

    this.camera = new THREE.PerspectiveCamera(
      50,
      this.width / this.height,
      1,
      5000
    );
    // this.camera.position.set(500, 350, 750);

    this.scene = new THREE.Scene();

    this.css3dRenderer = new CSS3DRenderer();
    this.css3dRenderer.setSize(this.width, this.height);
    css3dRendererRef.value.textContent = "";
    css3dRendererRef.value.appendChild(this.css3dRenderer.domElement);

    this.webglRenderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    this.webglRenderer.setSize(this.width, this.height);
    this.webglRenderer.setClearColor(0x000000, 0);
    webglRendererRef.value.appendChild(this.webglRenderer.domElement);

    const animate = () => {
      if (!this.reactive.ready) return;
      requestAnimationFrame(animate);
      this.css3dRenderer.render(this.scene, this.camera);
      this.webglRenderer.render(this.scene, this.camera);
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
    this.reactive.ready = false;
    this.camera = false;
    this.scene = false;
    delete this.css3dRenderer;
    delete this.webglRenderer;
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
};

onMounted(() => {
  app.create();
});

onUnmounted(() => {
  app.destroy();
});

defineExpose({ app });
</script>
