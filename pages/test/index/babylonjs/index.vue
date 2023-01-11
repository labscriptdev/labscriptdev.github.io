<template>
  <div>
    <canvas ref="canvas" style="width:100%; height:600px;"></canvas>
  </div>
</template>

<script>
  import * as BABYLON from '@babylonjs/core';
  import "@babylonjs/loaders/glTF";
  // import "@babylonjs/core/Debug/debugLayer";
  // import "@babylonjs/inspector";

  // import * as CANNON from 'cannon-es';
  // import * as Ammo from './Ammo.js';

  export default {
    methods: {
      async babylonjsInit() {
        
        document.head.appendChild(Object.assign(document.createElement('script'), {
          src: '/assets/ammo/ammo.js',
          onload: () => {
            Ammo().then((AmmoJs) => {
              console.clear();
              const canvas = this.$refs.canvas;
      
              let engine = new BABYLON.Engine(canvas, true);
      
              let scene = new BABYLON.Scene(engine);
              // scene.debugLayer.show({ embedMode: true });
              // scene.debugLayer.show();
      
              let gravityVector = new BABYLON.Vector3(0, -9.81, 0);
              // let physicsPlugin = new BABYLON.CannonJSPlugin(true, 10, CANNON);
              let physicsPlugin = new BABYLON.AmmoJSPlugin(true, Ammo);
              scene.enablePhysics(gravityVector, physicsPlugin);
      
              let camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
              camera.attachControl(canvas, true);
      
              let light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
      
              let sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
              sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {
                mass: .5,
                restitution: 0.9,
                onCollide: () => {
                  console.log('asdf');
                },
              }, scene);
      
              BABYLON.SceneLoader.ImportMesh(undefined, '/assets/models/test-track/', 'scene.gltf', scene, (newMeshes, particleSystems, skeletons) => {
                let terrain = newMeshes[0];
                terrain.position.set(0, 0, -90);
                terrain.physicsImpostor = new BABYLON.PhysicsImpostor(terrain, BABYLON.PhysicsImpostor.MeshImpostor, {
                  mass: 0,
                }, scene);
              });
      
              engine.runRenderLoop(() => {
                  scene.render();
              });

              console.log('tudo ok');
            });
          },
        }));
      },
    },

    mounted() {
      this.babylonjsInit();
    },
  };
</script>