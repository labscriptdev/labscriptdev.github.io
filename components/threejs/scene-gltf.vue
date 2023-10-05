<template>
  <div ref="gameRef" style="height:400px;"></div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, defineProps } from 'vue';

  const gameRef = ref(null);
  const props = defineProps({
    gameClass: { type: Function },
  });

  import * as THREE from 'three';
  import { PhysicsLoader } from 'enable3d';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  const sceneInit = (options={}) => {
    console.clear();
    
    options = {
      el: null,
      orbitControls: false,
      gridHelper: false,
      ...options
    };

    let gameClass = new props.gameClass;
    
    gameClass.options = gameClass.options || {};
    gameClass.options = { ...options, ...gameClass.options };

    gameClass.width = options.el.offsetWidth;
    gameClass.height = options.el.offsetHeight;
    gameClass.scene = new THREE.Scene();

    gameClass.camera = new THREE.PerspectiveCamera(50, gameClass.width / gameClass.height, 1, 1000);

    gameClass.clock = new THREE.Clock();
    gameClass.renderer = new THREE.WebGLRenderer({ antialias: true });
    // gameClass.renderer = new THREE.WebGPURenderer({ antialias: true });
    gameClass.frame = 0;
    gameClass.THREE = THREE;
    gameClass.input = {};

    options.el.appendChild(gameClass.renderer.domElement);
    gameClass.renderer.setSize(gameClass.width, gameClass.height);

    if (gameClass.options.orbitControls) {
      gameClass.orbitControls = new OrbitControls(gameClass.camera, gameClass.renderer.domElement);
      gameClass.camera.position.set(0, 20, 100);
    }
    
    if (gameClass.options.gridHelper) {
      const gridHelper = Array.isArray(gameClass.options.gridHelper) ? gameClass.options.gridHelper : [ 10, 10 ];
      gameClass.scene.add(gameClass.gridHelper = new THREE.GridHelper(gridHelper[0], gridHelper[1]));
    }

    PhysicsLoader('/assets/ammo', () => {
      (new GLTFLoader()).load('/assets/threejs/f15/scene.glb', (gltf) => {
        gameClass.scene.add(gltf.scene);

        if (window.sceneInterval) {
          clearInterval(window.sceneInterval);
          gameClass.frame = 0;
          gameClass.onCreate(gameClass);
        } else {
          gameClass.onCreate(gameClass);
        }

        window.sceneInterval = setInterval(() => {
          gameClass.onUpdate(gameClass);

          if (gameClass.options.orbitControls) {
            gameClass.orbitControls.update();
          }

          gameClass.renderer.render(gameClass.scene, gameClass.camera);
          gameClass.frame++;
        }, 1000/60);
      });
    });

    return gameClass;
  };

  const keyboardDownHandler = (ev) => {
    if (gameClass && typeof gameClass.onInput=='function') {
      gameClass.input = gameClass.onInput(ev);
      console.log(gameClass.input);
    }
  };

  const keyboardUpHandler = (ev) => {
    gameClass.input = {};
  };

  let gameClass;
  onMounted(() => {
    gameClass = sceneInit({
      el: gameRef.value,
    });

    document.addEventListener('keydown', keyboardDownHandler);
    document.addEventListener('keyup', keyboardUpHandler);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', keyboardDownHandler);
    document.removeEventListener('keyup', keyboardUpHandler);
  });
</script>