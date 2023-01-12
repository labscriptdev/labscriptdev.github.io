<template>
  <div>
    <threejs v-model="game" #default="gameData">
      <!--  -->
    </threejs>

    <v-navigation-drawer
      :model-value="false"
      permanent
      location="end"
      width="400px"
    >
      <app-dd :model-value="game"></app-dd>
    </v-navigation-drawer>
  </div>
</template>

<script>
  import * as THREE from 'three';

  import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
  import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

  export default {
    data: () => ({
      game: {
        options: {
          fps: 60,
          // debug: false,
          gridHelper: true,
          orbitControls: true,
        },
        onCreate({ scene, camera, effectComposer }) {
          const { width, height } = this;

          scene.add(new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(0, 1, 0),
              new THREE.Vector3(0, 1, 1),
              new THREE.Vector3(1, 1, 1),
              new THREE.Vector3(1, 1, 2),
              new THREE.Vector3(1, 2, 2),
              new THREE.Vector3(1, 2, 3),
              new THREE.Vector3(2, 2, 3),
              new THREE.Vector3(2, 3, 3),
              new THREE.Vector3(3, 3, 3),
              new THREE.Vector3(3, 3, 4),
              new THREE.Vector3(4, 3, 4),
            ]),
            new THREE.LineBasicMaterial( { color: 0xff0000 })
          ));


          effectComposer.addPass(new RenderPass(scene, camera));

          const bloomPass = new UnrealBloomPass( new THREE.Vector2(width, height), 1.5, 0.4, 0.85 );
          bloomPass.threshold = 0;
          bloomPass.strength = 1;
          bloomPass.radius = -2;
          effectComposer.addPass(bloomPass);
        },
        onUpdate() {
          // 
        },
      },
    }),
  };
</script>