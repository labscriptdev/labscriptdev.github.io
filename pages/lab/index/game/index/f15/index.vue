<template>
  <threejs-scene-gltf
    style="height:600px;"
    scene="/assets/threejs/f15/scene.glb"
    :scripts="[ SceneScript, AirplaneScript ]"
  >
    <!-- <template #loading>
      <div>Loading content</div>
    </template> -->
    <template #content>
      <div style="position:absolute; bottom:0; left:0;">Default content</div>
    </template>
  </threejs-scene-gltf>
</template>

<script>
  export default {
    meta: {
      // icon: 'mdi-numeric-1',
      name: 'F-15',
    },
  };
</script>

<script setup>
  class BaseScript {
    onInput() {}
    onCreate() {}
    onUpdate() {}
    onDelete() {}
  }

  class SceneScript extends BaseScript {
    onCreate() {
      // console.log('SceneScript.onCreate');
      this.motor.global.test = 'aaaa';
    }
    onUpdate() {
      // console.log('SceneScript.onUpdate');
    }
  }

  class AirplaneScript extends BaseScript {
    onInput(keyboard) {
      return {
        up: keyboard.w,
        down: keyboard.s,
        left: keyboard.a,
        right: keyboard.d,
      };
    }
    onCreate() {
      this.rotationSpeed = .05;
      this.camera = this.motor.camera;

      this.sun = this.motor.scene.getObjectByName('sun');
      this.sun.intensity = 2;
    }
    onUpdate() {
      const { THREE } = this.motor;
      this.object.translateX(.5);
      this.camera.lookAt(this.object.position);

      if (this.input.up) {
        this.object.rotateOnAxis(new THREE.Vector3(0, 0, 1), this.rotationSpeed);
      }
      if (this.input.down) {
        this.object.rotateOnAxis(new THREE.Vector3(0, 0, 1), -this.rotationSpeed);
      }
      if (this.input.left) {
        this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), this.rotationSpeed);
      }
      if (this.input.right) {
        this.object.rotateOnAxis(new THREE.Vector3(0, 1, 0), -this.rotationSpeed);
      }
    }
  }
</script>