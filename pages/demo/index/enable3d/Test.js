import * as THREE from 'three';
import Mousetrap from 'mousetrap';

export default {
  options: {
    fps: 60,
    // debug: false,
    gridHelper: true,
    orbitControls: true,
  },

  name: 'Hello',

  preload() {
    return {
      track: { type: 'gltf', url: '/assets/models/test-track/scene.gltf' },
      woodbox: { type: 'texture', url: '/assets/threejs/textures/wood-box.png' },
    };
  },

  onCreate(game) {

    let offset = 3;
    Array(10).fill(null).map((_, i) => i*offset).forEach(x => {
      Array(10).fill(null).map((_, i) => i*offset).forEach(z => {
        const material = new THREE.MeshBasicMaterial({
          map: this.woodbox,
        });
        const obj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
        obj.position.set(x, 1, z);
        game.scene.add(obj);
        game.physics.add.existing(obj, { mass: 1 });
      });
    });


    this.track.scale.set(5, 5, 5);
    this.track.position.set(-25, -420, 0);
    this.track.traverse(child => {
      if (!child.isMesh) return;
      child.castShadow = child.receiveShadow = true;
      child.material.metalness = 0;
      child.material.roughness = 1;
    });

    game.scene.add(this.track);
    game.physics.add.existing(this.track, { mass: 0, shape: 'concaveMesh' });

    

    // this.car = new Car(this);
  },
  
  onUpdate(game) {
    // console.log(game.name);
    // console.log('onUpdate', game.clock.getDelta());
    // console.log(game.canvas.width);
  },
};