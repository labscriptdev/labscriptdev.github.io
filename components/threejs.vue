<template>
  <div style="position:relative; width:100%; height:500px;">
    <div ref="canvas" style="position:realative; width:100%; height:100%;"></div>
    <slot v-bind="{ ...gameData }" v-if="gameData" />
  </div>
</template>

<script>
  import { PhysicsLoader } from 'enable3d';
  import { AmmoPhysics } from '@enable3d/ammo-physics';

  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';

  export default {
    props: {
      modelValue: {
        type: [Object, Function],
        default: () => ({}),
      },
    },

    data: () => ({
      gameData: false,
    }),

    methods: {
      onInit() {
        console.clear();
        PhysicsLoader('/assets/ammo', () => {
          const getCanvasSize = () => ({
            width: this.$el.offsetWidth,
            height: this.$el.offsetHeight,
          });

          const { width, height } = getCanvasSize();

          this.gameData = (() => {
            if (typeof this.modelValue=='function') {
              return this.modelValue();
            }
            return this.modelValue;
          })();

          this.gameData = {
            options: {},
            onCreate() {},
            onUpdate() {},
            ...this.gameData
          };

          const options = this.gameData.options = {
            fps: 60,
            debug: false,
            gridHelper: false,
            orbitControls: false,
            ...this.gameData.options
          };

          // Target
          this.gameData.width = width;
          this.gameData.height = height;

          // Scene, camera, clock
          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(50, this.gameData.width / this.gameData.height, 1, 1000);
          const clock = new THREE.Clock();

          // Renderer
          const renderer = this.gameData.renderer = (() => {
            const { width, height } = getCanvasSize();
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(width, height);
            this.$refs.canvas.appendChild(renderer.domElement);
            this.$refs.canvas.style.width = `100%`;
            this.$refs.canvas.style.height = `100%`;
            return renderer;
          })();

          const effectComposer = this.gameData.effectComposer = new EffectComposer(renderer);
          this.gameData.getEffectComposer = () => effectComposer;

          // Physics
          const physics = this.gameData.physics = (() => {
            const physics = new AmmoPhysics(scene);
            if (options.debug) physics.debug.enable(true);
            return physics;
          })();

          // Grid helper
          if (options.gridHelper) {
            scene.add(this.gameData.gridHelper = new THREE.GridHelper(10, 10));
          }

          // Orbit controls
          const orbitControls = this.gameData.orbitControls = (() => {
            if (!options.orbitControls) return false;
            camera.position.set(5, 5, 5);
            return new OrbitControls(camera, renderer.domElement);
          })();

          const onResize = () => {
            const { width, height } = getCanvasSize();
            this.gameData.width = width;
            this.gameData.height = height;
            renderer.setSize(width, height);
            this.$refs.canvas.style.width = `${width}px`;
            this.$refs.canvas.style.height = `${height}px`;
          };

          setTimeout(onResize, 100);

          this.gameData.onCreate({ clock, scene, camera, renderer, effectComposer, physics });

          const onAnimate = () => {
            this.gameData.onUpdate({ clock, scene, camera, renderer, effectComposer, physics });
            physics.update(clock.getDelta() * 1000);
            renderer.render(scene, camera);
            if (orbitControls) orbitControls.update();
            effectComposer.render();
            this.$emit('update:modelValue', this.gameData);
          };

          this._ti = setInterval(onAnimate, 1000 / options.fps);
          window.addEventListener('resize', onResize);

          this.onBeforeUnmount = () => {
            window.removeEventListener('resize', onResize);
            if (this._ti) clearInterval(this._ti);
          };
        });
      },
      onAnimate() {},
      onBeforeUnmount() {},
    },

    mounted() {
      this.onInit();
    },

    beforeUnmount() {
      this.onBeforeUnmount();
    }
  };
</script>