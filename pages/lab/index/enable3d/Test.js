import * as THREE from 'three';
import Mousetrap from 'mousetrap';

import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/addons/shaders/DotScreenShader.js';
import { SAOPass } from 'three/addons/postprocessing/SAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import Car from './Car';
import Car3 from './Car3';
import Car4 from './Car4';

export default {
  options: {
    fps: 60,
    debug: true,
    // gridHelper: true,
    // orbitControls: true,
  },

  name: 'Hello',

  preload() {
    return {
      // track: { type: 'gltf', url: '/assets/threejs/models/test-track/scene.gltf' },
      city: { type: 'gltf', url: '/assets/threejs/models/city/scene.gltf' },
      woodbox: { type: 'texture', url: '/assets/threejs/textures/wood-box.png' },
      tire: { type: 'texture', url: '/assets/threejs/textures/tire.jpg' },
    };
  },

  onCreate() {
    const game = this.getData();
    this.createMap();
    // this.createBoxes();
    this.createCar();
  },
  
  onUpdate() {
    const { scene, camera } = this.getData();
    // this.car.accelerate();
    // camera.lookAt(this.car.getPosition());
  },

  createMap() {
    const game = this.getData();

    // this.track.scale.set(8, 8, 8);
    // this.track.position.set(-25, -670, 0);
    // this.track.traverse(child => {
    //   if (!child.isMesh) return;
    //   child.castShadow = child.receiveShadow = true;
    //   child.material.metalness = 0;
    //   child.material.roughness = 1;
    // });

    // game.scene.add(this.track);
    // game.physics.add.existing(this.track, { mass: 0, shape: 'concaveMesh' });
    // this.track.body.setFriction(1);

    // city model
    (() => {
      game.scene.add(this.city);
      const scale = 40;
      this.city.scale.set(scale, scale, scale);
      this.city.position.set(1100, -20, 1100);
      game.physics.add.existing(this.city, { mass: 0, shape: 'concaveMesh' });
      this.city.body.setFriction(1);
    })();

    // aaa
    // (() => {
    //   const effect1 = new ShaderPass( DotScreenShader );
    //   effect1.uniforms[ 'scale' ].value = 4;
    //   game.effectComposer.addPass( effect1 );
  
    //   const effect2 = new ShaderPass( RGBShiftShader );
    //   effect2.uniforms[ 'amount' ].value = 0.0015;
    //   game.effectComposer.addPass( effect2 );
    // })();


    // sao
    // (() => {
    //   let saoPass = new SAOPass(game.scene, game.camera, false, true);
    //   saoPass.params.output = SAOPass.OUTPUT.Normal; // Beauty, Default, SAO, Depth, Normal
    //   saoPass.params.saoBias = 0.5;
    //   saoPass.params.saoIntensity = 0.18;
    //   saoPass.params.saoScale = 1;
    //   saoPass.params.saoKernelRadius = 100;
    //   saoPass.params.saoMinResolution = 0;
    //   saoPass.params.saoBlur = true;
    //   saoPass.params.saoBlurRadius = 8;
    //   saoPass.params.saoBlurStdDev = 4;
    //   saoPass.params.saoBlurDepthCutoff = 0.01;
    //   game.effectComposer.addPass(saoPass);
    // })();

    // unreal
    // (() => {
    //   const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    //   bloomPass.threshold = 0;
    //   bloomPass.strength = .3;
    //   bloomPass.radius = 0;
    //   game.effectComposer.addPass(bloomPass);
    // })();
  },

  createBoxes() {
    const game = this.getData();

    let offset = 3;
    Array(10).fill(null).map((_, i) => i*offset).forEach(x => {
      Array(10).fill(null).map((_, i) => i*offset).forEach(z => {
        const offset = -10;
        const material = new THREE.MeshBasicMaterial({
          map: this.woodbox,
        });
        const obj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
        obj.position.set(x+offset, 1, z+offset);
        game.scene.add(obj);
        game.physics.add.existing(obj, { mass: 1 });
      });
    });
  },


  createCar() {
    const game = this.getData();
    const { scene, physics } = game;

    // scene.add(this.car = new Car({ game }));
    // this.car.position.z = 100;

    // scene.add(this.car3 = new Car3({ game }));
    // scene.add(this.car3 = new Car3({ game, x: 2, y: 0, z: -1 }));
    // scene.add(this.car3 = new Car3({ game, x: -10, y: 0, z: -1 }));
    // this.car3.position.set(-20, -1, 0);
    // this.car3.position.set(2, 0, -1);
    // scene.add(this.car4 = new Car4({ game, x: -10, y: 0, z: -1 }));
    // scene.add(this.car4 = new Car4({ game, x: 2, y: 2, z: 1 }));
    // scene.add(this.car4 = new Car4({ game, x: 0, y: 0, z: 0 }));
    // scene.add(new Car4({ game, x: 0, y: 0, z: 0 }));
    // scene.add(new Car4({ game, x: 5, y: 0, z: 0 }));
    // scene.add(new Car4({ game, x: 0, y: 0, z: 5 }));
    scene.add(this.car = new Car4({ game, x: 5, y: 0, z: 15 }));
  },
};