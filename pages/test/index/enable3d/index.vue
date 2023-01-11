<template>
  <div>
    <div ref="game" id="game" style="width:100%; height:600px;"></div>
    <pre>{{ game }}</pre>
  </div>
</template>

<script>
  import { Project, Scene3D, PhysicsLoader, THREE } from 'enable3d';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

  export default {
    data: () => ({
      game: {},
    }),
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
            // https://github.com/enable3d/enable3d-website/blob/master/src/examples/car-using-physics-constraints.html#L34
            // this.load.preload('testTrack', '/assets/models/test-track/scene.gltf');
          }

          async create() {
            console.clear();
            this.warpSpeed('-ground');
            // this.physics.debug.enable();
            this.scene.add(new THREE.AxesHelper(5));
            
            this.physics.add.sphere(
              { radius: 0.5, x: 2, y: 5, z: 2, mass: .2 },
              { lambert: { color: 'hotpink' } }
            );

            // this.physics.add.existing((() => {
            //   const geometry = new THREE.SphereGeometry(0.8, 16, 16);
            //   const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
            //   const obj = new THREE.Mesh(geometry, material);
            //   obj.position.set(5, 30, 0);
            //   this.scene.add(obj);
            //   return obj;
            // })());
            
            const loader = new GLTFLoader().load('/assets/models/test-track/scene.gltf', (gltf) => {
              const child = gltf.scene.children[0];
              child.position.set(-25, -95, 0);

              child.traverse(child => {
                if (child.isMesh) {
                  child.castShadow = child.receiveShadow = true;
                  child.material.metalness = 0;
                  child.material.roughness = 1;
                }
              });

              this.scene.add(child);
              this.physics.add.existing(child, {
                mass: 0,
                shape: 'concaveMesh',
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