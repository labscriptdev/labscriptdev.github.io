<template>
  <app-layout :container-card="false" container-width="100%">
    <!-- <threejs-scene v-model="test" #default="{ game }" /> -->
    
    <v-row>
      <v-col cols="8">
        <div ref="gameRef" style="height:200px; border:solid 1px red;"></div>
        <pre>game: {{ game }}</pre>
      </v-col>
      <v-col cols="4">
        <v-checkbox
          v-model="game.debug"
          v-bind="{
            label: 'Debug',
            hideDetails: true,
          }"
        />
        <v-checkbox
          v-model="game.gridHelper"
          v-bind="{
            label: 'Grid helper',
            hideDetails: true,
          }"
        />
        <v-checkbox
          v-model="game.orbitControls"
          v-bind="{
            label: 'Orbit controls',
            hideDetails: true,
          }"
        />
        <v-text-field
          v-model.number="game.fps"
          v-bind="{
            label: 'FPS',
            type: 'number',
            min: 1,
            hideDetails: true,
          }"
        />
      </v-col>
    </v-row>

    <a href="">Refresh</a>
  </app-layout>
</template>

<script>
  // import Test from './Test';

  export default {
    meta: {
      active: false,
      icon: 'mdi-cube',
      name: 'Enable 3D',
      description: 'Aplicação para gerar arquivos com tamanhos exatos',
    },

    // data: () => ({
    //   test: Test,
    // }),
  };
</script>

<script setup>
  import { ref, watch, onMounted, onUnmounted } from 'vue';
  import { useEventListener } from '@vueuse/core';
  import _ from 'lodash';
  import { PhysicsLoader } from 'enable3d';
  import * as THREE from 'three';

  const useGame = (gameData={}) => {
    gameData = _.merge({
      name: 'no name',
      fps: 60,
      frame: 0,
      width: 0,
      height: 0,
      debug: false,
      gridHelper: false,
      orbitControls: false,
      scene: 0,
      global: {},
      prefabs: [],
      scenes: [],
      onSceneChange: () => {},
    }, gameData);

    gameData.scenes = gameData.scenes.map((scene, index) => {
      return _.merge({
        name: `scene-${index}`,
        children: [],
        onCreate: () => {},
        onUpdate: () => {},
        onProgress: () => {},
        clock: false,
        camera: false,
        scene: false,
        renderer: false,
      }, scene);
    });

    const r = ref({
      ...gameData,

      init(elem) {
        this._element = elem;
        this.width = elem.offsetWidth;
        this.height = elem.offsetHeight;
        this.frame = 0;

        useEventListener(window, 'resize', (ev) => {
          this.width = elem.offsetWidth;
          this.height = elem.offsetHeight;
        });

        const createTimeout = () => {
          this._timeout = setTimeout(() => {
            this.sceneUpdate();
            createTimeout();
          }, 1000/this.fps);
        };

        createTimeout();
        this.sceneCreate();
      },

      sceneCreate() {
        this._scene = this.scenes[ this.scene ] || this.scenes.filter(scene => scene.name==this.scene).at(0);
        if (!this._scene) return;

        this._scene.scene = new THREE.Scene();
        this._scene.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 1, 1000);
        this._scene.clock = new THREE.Clock();
        this._scene.renderer = new THREE.WebGLRenderer();
        this._scene.renderer.setSize(this.width, this.height);
        this._element.innerHTML = '';
        this._element.appendChild(this._scene.renderer.domElement);
      },

      sceneUpdate() {
        this.frame = this.frame + 1;
        this._scene.renderer.render(this._scene.scene, this._scene.camera);
        if (this.orbitControls) this.orbitControls.update();
        if (this.options.debug) this.physics.updateDebugger();
      },
    });

    onUnmounted(() => {
      if (r.value && r.value._timeout) {
        clearTimeout(r.value._timeout);
      }
    });

    return r;
  };

  onMounted(() => {
    PhysicsLoader('/assets/ammo', () => {
      game.value.init(gameRef.value);
    });
  });

  const gameRef = ref(null);
  const game = useGame({
    fps: 30,
    orbitControls: true,
    gridHelper: true,
    scene: 'scene-0',
    scenes: [
      {
        name: 'scene-0',
      },
      {
        name: 'scene-1',
      },
    ],
  });
</script>