<template>
  <threejs-css3d>
    <threejs-css3d-el
      v-bind="{ x: 0, y: 0, z: 240, rx: 0, ry: 90, rz: 0 }"
      style="width: 480px; height: 360px; background: red"
    >
      <div>Lado 1</div>
    </threejs-css3d-el>
    <!-- <threejs-css3d-el
      v-bind="{ x: 240, y: 0, z: 0, rx: 0, ry: Math.PI / 2, rz: 0 }"
      style="width: 480px; height: 360px; background: green"
    >
      <div>Lado 2</div>
    </threejs-css3d-el> -->
    <!-- <threejs-css3d-el
      v-bind="{ x: 0, y: 0, z: -240, rx: 0, ry: 0, rz: 0 }"
      style="width: 480px; height: 360px; background: blue"
    >
      <div>Lado 3</div>
    </threejs-css3d-el> -->
    <!-- <threejs-css3d-el
      v-bind="{ x: -240, y: 0, z: 0, rx: 0, ry: -Math.PI / 2, rz: 0 }"
      style="width: 480px; height: 360px; background: yellow"
    >
      <div>Lado 4</div>
    </threejs-css3d-el> -->
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

<script setup></script>
