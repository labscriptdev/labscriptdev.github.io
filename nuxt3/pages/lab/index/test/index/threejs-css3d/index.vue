<template>
  <threejs-css3d>
    <threejs-css3d-el v-bind="{ x: 0, y: 0, z: 240, ry: 0 }">
      <div>Hello</div>
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

<script setup></script>
