import * as THREE from 'three';
import Mousetrap from 'mousetrap';

import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import { DotScreenShader } from 'three/addons/shaders/DotScreenShader.js';
import { SAOPass } from 'three/addons/postprocessing/SAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';

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
      road_design: { type: 'gltf', url: '/assets/threejs/models/road_design/scene.gltf' },
      van: { type: 'gltf', url: '/assets/threejs/models/van/scene.gltf' },
      woodbox: { type: 'texture', url: '/assets/threejs/textures/wood-box.png' },
      tire: { type: 'texture', url: '/assets/threejs/textures/tire.jpg' },
    };
  },

  onCreate() {
    const game = this.getData();
    const { scene, camera } = game;
    this.createMap();
    // this.createBoxes();
    this.createCar();
  },
  
  onUpdate() {
    const { scene, camera } = this.getData();
    // this.car.accelerate();
    // camera.lookAt(this.city.position.clone());
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


    // // city model
    // (() => {
    //   game.scene.add(this.city);
    //   const scale = 1;
    //   this.city.scale.set(scale, scale, scale);
    //   this.city.position.set(0, 0, 0);
    //   game.physics.add.existing(this.city, { mass: 0, shape: 'concaveMesh' });
    //   this.city.body.setFriction(1);
    // })();
    
    // // casa_city_logo
    // (() => {
    //   game.scene.add(this.casa_city_logo);
    //   const scale = 100;
    //   this.casa_city_logo.scale.set(scale, scale, scale);
    //   this.casa_city_logo.position.set(0, 0, 0);
    //   game.physics.add.existing(this.casa_city_logo, { mass: 0, shape: 'concaveMesh' });
    //   this.casa_city_logo.body.setFriction(1);
    // })();
    
    // road_design
    (() => {
      game.scene.add(this.road_design);
      const scale = 3;
      this.road_design.scale.set(scale, scale, scale);
      this.road_design.position.set(0, -30, 0);
      game.physics.add.existing(this.road_design, { mass: 0, shape: 'concaveMesh' });
      this.road_design.body.setFriction(.2);
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
    (() => {
      const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
      bloomPass.threshold = 0;
      bloomPass.strength = 1;
      bloomPass.radius = .5;
      game.effectComposer.addPass(bloomPass);
    })();
    
    // // HalftonePass
    // (() => {
    //   const { width, height } = game.canvas;
    //   const halftonePass = new HalftonePass(width, height, {
    //     shape: 1,
    //     radius: 5,
    //     rotateR: Math.PI / 12,
    //     rotateB: Math.PI / 12 * 2,
    //     rotateG: Math.PI / 12 * 3,
    //     scatter: 0,
    //     blending: 1,
    //     blendingMode: 1,
    //     greyscale: false,
    //     disable: false,
    //   });
    //   game.effectComposer.addPass(halftonePass);
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
    scene.add(this.car = new Car4({ game, x: 0, y: 5, z: 0 }));
    this.car.add(this.van);
  },
};