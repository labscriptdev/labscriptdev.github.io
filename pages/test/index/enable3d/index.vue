<template>
  <div ref="game" id="game" style="width:100%; height:600px;"></div>
</template>

<script>
  import { Project, Scene3D, PhysicsLoader, THREE } from 'enable3d';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

  export default {
    mounted() {
      this.gameInit();
    },
    methods: {
      gameInit() {
        class MainScene extends Scene3D {
          init() {
            // console.log('init');
          }
          preload() {
            // console.log('preload');
          }
          create() {
            this.warpSpeed();
            this.physics.debug.enable();
            // this.physics.add.box({ y: 30 }, { lambert: { color: 'hotpink' } });

            // this.physics.add.existing((() => {
            //   const geometry = new THREE.SphereGeometry(0.8, 16, 16);
            //   const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
            //   const obj = new THREE.Mesh(geometry, material);
            //   obj.position.set(5, 30, 0);
            //   this.scene.add(obj);
            //   return obj;
            // })());

            
            const loader = new GLTFLoader().load('/assets/models/map/scene.gltf', (gltf) => {
              const scene = gltf.scene.children[0];

              // scene.traverse(child => {
              //   if (child.isMesh) {
              //     child.castShadow = child.receiveShadow = false;
              //     child.material.metalness = 0;
              //     child.material.roughness = 1;
              //   }
              // })

              this.scene.add(scene);
              this.physics.add.existing(this.scene, {
                mass: 0,
                shape: 'convex',
              });
            });
          }
          update() {
            // 
          }
        }

        PhysicsLoader('/assets/ammo', () => new Project({
          parent: 'game',
          // antialias: true,
          scenes: [ MainScene ],
        }));
      },
    },
  };
</script>