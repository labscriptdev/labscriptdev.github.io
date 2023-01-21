import * as THREE from 'three';
import Mousetrap from 'mousetrap';

import Car from './Car';
import Car3 from './Car3';

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
      track: { type: 'gltf', url: '/assets/threejs/models/test-track/scene.gltf' },
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

    this.track.scale.set(8, 8, 8);
    this.track.position.set(-25, -670, 0);
    this.track.traverse(child => {
      if (!child.isMesh) return;
      child.castShadow = child.receiveShadow = true;
      child.material.metalness = 0;
      child.material.roughness = 1;
    });

    game.scene.add(this.track);
    game.physics.add.existing(this.track, { mass: 0, shape: 'concaveMesh' });
    this.track.body.setFriction(1);
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

    // game.scene.add(this.car = new Car({ game }));
    // this.car.position.z = 100;

    // game.scene.add(this.car3 = new Car3({ game }));
    // game.scene.add(this.car3 = new Car3({ game, x: 2, y: 0, z: -1 }));
    game.scene.add(this.car3 = new Car3({ game, x: -10, y: 0, z: -1 }));
    // this.car3.position.set(-20, -1, 0);
    // this.car3.position.set(2, 0, -1);
  },
};