<template>
  <threejs-css3d @create="onCreate($event)">
    <threejs-css3d-el
      v-bind="{ x: 0, y: 0, z: 500, rx: 0, ry: 0, rz: 0 }"
      style="width: 1000px; height: 1000px; background: red"
    >
      <iframe
        src="https://www.youtube.com/embed/AlUlF52QBBs?si=btThvtG1tt6g1gRS"
        style="width: 100%; height: 100%"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    </threejs-css3d-el>
    <threejs-css3d-el
      v-bind="{ x: 500, y: 0, z: 0, rx: 0, ry: Math.PI / 2, rz: 0 }"
      style="width: 1000px; height: 1000px; background: green"
    >
      <div>Lado 2</div>
    </threejs-css3d-el>
    <threejs-css3d-el
      v-bind="{ x: 0, y: 0, z: -500, rx: 0, ry: 0, rz: 0 }"
      style="width: 1000px; height: 1000px; background: blue"
    >
      <div>Lado 3</div>
    </threejs-css3d-el>
    <threejs-css3d-el
      v-bind="{ x: -500, y: 0, z: 0, rx: 0, ry: -Math.PI / 2, rz: 0 }"
      style="width: 1000px; height: 1000px; background: yellow"
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
import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

const onCreate = (app) => {
  app.input = {
    front: ["w", "W"],
    back: ["s", "S"],
    left: ["a", "A"],
    right: ["d", "D"],
  };

  app.on("create", () => {
    app.camera.position.set(200, 200, 200);
  });

  // app.on("create", () => {
  //   app.trackballControl = new TrackballControls(
  //     app.camera,
  //     app.renderer.domElement
  //   );
  //   app.trackballControl.rotateSpeed = 4;
  // });

  // app.on("update", () => {
  //   if (!app.trackballControl) return;
  //   app.trackballControl.update();
  // });

  app.on({
    create() {
      app.pointerLockControl = new PointerLockControls(
        app.camera,
        app.renderer.domElement
      );
    },
    click() {
      app.pointerLockControl.lock();
    },
    update() {
      const moveSpeed = 5;

      if (app.key.front) {
        app.camera.translateZ(-moveSpeed);
      }
      if (app.key.back) {
        app.camera.translateZ(moveSpeed);
      }
      if (app.key.left) {
        app.camera.translateX(-moveSpeed);
      }
      if (app.key.right) {
        app.camera.translateX(moveSpeed);
      }
    },
  });
};
</script>
