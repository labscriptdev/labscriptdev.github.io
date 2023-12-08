<template>
  <threejs-css3d @create="onCreate($event)">
    <threejs-css3d-el
      v-bind="{ x: 0, y: 0, z: 100, rx: 0, ry: 0, rz: 0 }"
      style="width: 200px; height: 200px; background: red"
    >
      <div>Lado 1</div>
    </threejs-css3d-el>
    <threejs-css3d-el
      v-bind="{ x: 100, y: 0, z: 0, rx: 0, ry: Math.PI / 2, rz: 0 }"
      style="width: 200px; height: 200px; background: green"
    >
      <div>Lado 2</div>
    </threejs-css3d-el>
    <threejs-css3d-el
      v-bind="{ x: 0, y: 0, z: -100, rx: 0, ry: 0, rz: 0 }"
      style="width: 200px; height: 200px; background: blue"
    >
      <div>Lado 3</div>
    </threejs-css3d-el>
    <threejs-css3d-el
      v-bind="{ x: -100, y: 0, z: 0, rx: 0, ry: -Math.PI / 2, rz: 0 }"
      style="width: 200px; height: 200px; background: yellow"
    >
      <div>Lado 4</div>
    </threejs-css3d-el>
  </threejs-css3d>
</template>

<script>
export default {
  meta: {
    icon: "mdi-numeric-1",
    name: "Three.js CSS3D",
  },
};
</script>

<script setup>
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

const onCreate = (app) => {
  app.on("create", (app) => {
    app.trackballControl = new TrackballControls(
      app.camera,
      app.renderer.domElement
    );
    app.trackballControl.rotateSpeed = 4;
  });

  app.on("update", (app) => {
    if (!app.trackballControl) return;
    app.trackballControl.update();
  });
};
</script>
