<template>
  <threejs-scene-gltf
    style="height:600px;"
    scene="/assets/threejs/roling-stones/scene.glb"
    :scripts="[ SceneScript, StoneScript, TerrainScript ]"
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
      name: 'Roling Stones',
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
    constructor() {
      super();
      // this.orbitControls = true;
      // this.gridHelper = true;
      // this.physicsDebug = true;
    }

    onCreate() {
      this.sun = this.motor.scene.getObjectByName('sun');
      this.sun.intensity = 1.5;
    }
    onUpdate() {
      // 
    }
  }

  class StoneScript extends BaseScript {
    onCreate() {
      const offset = 5;
      this.object.position.x = this.getRandomBetweenRange(this.object.position.x-offset, this.object.position.x+offset);
      this.object.position.y = this.getRandomBetweenRange(this.object.position.y-offset, this.object.position.y+offset);
      this.object.position.z = this.getRandomBetweenRange(this.object.position.z-offset, this.object.position.z+offset);
      this.motor.physics.add.existing(this.object, { shape: 'hull', mass: 10, collisionFlags: 0 });
    }
    onUpdate() {
      // 
    }
    getRandomBetweenRange(min, max) {
      return Math.random() * (max - min) + min;
    }
  }
  
  class TerrainScript extends BaseScript {
    onCreate() {
      this.stone1 = this.motor.scene.getObjectByName('stone3');
      this.motor.physics.add.existing(this.object, { shape: 'concaveMesh', mass: 0, collisionFlags: 0 });
    }
    onUpdate() {
      this.motor.camera.lookAt(this.stone1.position);
      // this.motor.camera.position.lerp(this.stone1.position, .005);
    }
  }
</script>