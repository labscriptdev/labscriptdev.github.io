<template>
  <threejs-scene-gltf
    style="height:600px;"
    :game-class="f15"
  ></threejs-scene-gltf>
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
  const f15 = class {

    options = {
      // orbitControls: true,
      // gridHelper: [ 100, 10 ],
    };

    onInput(ev) {
      return {
        up: ev.key=='w',
        down: ev.key=='s',
        left: ev.key=='a',
        right: ev.key=='d',
      };
    }

    onCreate({ THREE, scene }) {
      this.player = scene.getObjectByName('player');
      this.camera.position.y = 5;
      
      this.sun = scene.getObjectByName('sun');
      this.sun.intensity = 1;

      scene.traverse((object) => {
        object.castShadow = true;
        object.receiveShadow = true;
      });

      // console.log(player.userData);
    }

    onUpdate({ THREE, camera }) {
      this.player.translateX(.5);

      const lookAt = this.player.position.clone().add(new THREE.Vector3(100, 0, 0));
      camera.lookAt(lookAt);
      // camera.position.copy(this.player.position).add(new THREE.Vector3(-20, 10, 0));
      camera.position.copy(this.player.position).add(new THREE.Vector3(-50, 50, 0));

      const rotationSpeed = .05;

      if (this.input.up) {
        this.player.rotateOnAxis(new THREE.Vector3(0, 0, 1), rotationSpeed);
      }
      
      if (this.input.down) {
        this.player.rotateOnAxis(new THREE.Vector3(0, 0, 1), -rotationSpeed);
      }
      
      if (this.input.left) {
        this.player.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotationSpeed);
      }
      
      if (this.input.right) {
        this.player.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotationSpeed);
      }
    }
  };
</script>