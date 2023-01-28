<template>
  <div style="position:relative; width:100%; height:600px;">
    <slot :game="modelValue" />
  </div>
</template>

<script>
  import { PhysicsLoader } from 'enable3d';
  import { AmmoPhysics } from '@enable3d/ammo-physics';

  import * as THREE from 'three';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
  import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
  import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';

  // Loaders
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
  import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

  export default {
    props: {
      modelValue: {
        type: [Object, Function],
        default: () => ({}),
      },
    },

    // watch: {
    //   modelValue: {
    //     deep: true,
    //     handler(value) {
    //       console.log(value);
    //     },
    //   },
    // },

    data() {
      return {};
    },

    methods: {
      init() {
        PhysicsLoader('/assets/ammo', () => {
          console.clear();

          const emit = (value) => {
            this.$emit('update:modelValue', value);
            this.$parent.$forceUpdate();
          };

          const getCanvasSize = () => {
            return {
              width: this.$el.offsetWidth,
              height: this.$el.offsetHeight,
            };
          };

          let modelValue = {
            loaded: 0,
            options: {},
            preload: () => ({}),
            onProgress: () => {},
            onCreate: () => {},
            onUpdate: () => {},
            ...this.modelValue,
            input: {},
          };

          modelValue.options = {
            fps: 60,
            debug: false,
            gridHelper: false,
            orbitControls: false,
            ...modelValue.options
          };

          const { width, height } = getCanvasSize();

          modelValue.canvas = {
            wrapper: this.$el,
            width,
            height,
          };

          // Scene, camera, clock
          modelValue.scene = new THREE.Scene();
          modelValue.camera = new THREE.PerspectiveCamera(50, width / height, 1, 1000);
          modelValue.clock = new THREE.Clock();

          // Basic light
          modelValue.scene.add(modelValue.light = new THREE.DirectionalLight(0xffffff, 5));
          // modelValue.scene.add(modelValue.light = new THREE.AmbientLight(0xffffff));

          // Renderer
          modelValue.renderer = (() => {
            const { width, height } = getCanvasSize();
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(width, height);
            this.$el.appendChild(renderer.domElement);
            renderer.domElement.style.width = '100%';
            renderer.domElement.style.height = '100%';
            return renderer;
          })();

          modelValue.effectComposer = new EffectComposer(modelValue.renderer);
          modelValue.effectComposer.addPass(new RenderPass(modelValue.scene, modelValue.camera));

          // Physics
          modelValue.physics = new AmmoPhysics(modelValue.scene);

          // Debug
          if (modelValue.options.debug) {
            modelValue.physics.debug?.enable();
            modelValue.physics.debug?.mode(2048 + 4096);
          }
          
          // Grid helper
          if (modelValue.options.gridHelper) {
            modelValue.scene.add(modelValue.gridHelper = new THREE.GridHelper(10, 10));
          }

          // Orbit controls
          modelValue.orbitControls = (() => {
            if (!modelValue.options.orbitControls) return false;
            modelValue.camera.position.set(5, 5, 5);
            return new OrbitControls(modelValue.camera, modelValue.renderer.domElement);
          })();

          modelValue.getData = function() {
            return this;
          };

          const onResize = () => {
            const { width, height } = getCanvasSize();
            modelValue.canvas.width = width;
            modelValue.canvas.height = height;
            modelValue.renderer.setSize(width, height);
            modelValue.camera.aspect = width / height;
            modelValue.camera.updateProjectionMatrix();
            emit(modelValue);
          };

          const onKeyboard = (ev) => {
            if (ev.type=='keydown') {
              modelValue.input[ev.key] = true;
              modelValue.input[ev.code] = true;
              modelValue.input[ev.keyCode] = true;
            }
            else {
              modelValue.input[ev.key] = false;
              modelValue.input[ev.code] = false;
              modelValue.input[ev.keyCode] = false;
            }
            emit(modelValue);
          };

          const onAnimate = () => {
            modelValue.onUpdate();

            modelValue.scene.traverse(child => {
              const onUpdate = child.onUpdate || child.userData.onUpdate || false;
              if (typeof onUpdate=='function') onUpdate.call(child);
            });

            modelValue.physics.update(modelValue.clock.getDelta() * 1000);
            modelValue.renderer.render(modelValue.scene, modelValue.camera);
            if (modelValue.orbitControls) modelValue.orbitControls.update();
            if (modelValue.options.debug) modelValue.physics.updateDebugger();
            modelValue.effectComposer.render();
            emit(modelValue);
          };

          const gameInit = () => {
            modelValue.onCreate();

            modelValue.scene.traverse(child => {
              const onCreate = child.onCreate || child.userData.onCreate || false;
              if (typeof onCreate=='function') onCreate.call(child);
            });

            const ti = setInterval(onAnimate, 1000 / modelValue.options.fps);
            window.addEventListener('resize', onResize);
            window.addEventListener('keyup', onKeyboard);
            window.addEventListener('keydown', onKeyboard);

            this.onBeforeUnmount = () => {
              window.removeEventListener('resize', onResize);
              window.removeEventListener('keyup', onResize);
              window.removeEventListener('keydown', onResize);
              clearInterval(ti);
            };
          };

          // Preload
          (() => {
            emit(modelValue);

            if (Object.keys(modelValue.preload()).length==0) {
              modelValue.loaded = 1;
              return gameInit();
            }

            const manager = Object.assign(new THREE.LoadingManager(), {
              onStart: (url, itemsLoaded, itemsTotal) => {},
              onProgress: (url, itemsLoaded, itemsTotal) => {
                const percent = itemsLoaded / itemsTotal;
                modelValue.loaded = percent;
                emit(modelValue);
                modelValue.onProgress({ percent, url, itemsLoaded, itemsTotal });
              },
              onError: (url) => {},
              onLoad: () => {
                modelValue.loaded = 1;
                gameInit();
              },
            });
  
            for(let [name, load] of Object.entries(modelValue.preload())) {
              load = {
                type: false,
                url: '',
                onLoad: (obj) => obj,
                ...load,
                loader: false,
              };
  
              if (load.type=='obj') {
                load.loader = new OBJLoader(manager);
                load.loader.load(load.url, (obj) => {
                  load.onLoad(obj);
                  modelValue[ name ] = obj;
                  emit(modelValue);
                });
              }
              else if (load.type=='gltf') {
                load.loader = new GLTFLoader(manager);
                load.loader.load(load.url, (obj) => {
                  obj = obj.scene.children[0];
                  load.onLoad(obj);
                  modelValue[ name ] = obj;
                  emit(modelValue);
                });
              }
              else if (load.type=='texture') {
                load.loader = new THREE.TextureLoader(manager);
                load.loader.load(load.url, (obj) => {
                  load.onLoad(obj);
                  modelValue[ name ] = obj;
                  emit(modelValue);
                });
              }
            }
          })();
        });
      },
      onAnimate: () => ({}),
      onBeforeUnmount: () => ({}),
    },

    mounted() {
      this.init();
    },

    beforeUnmount() {
      this.onBeforeUnmount();
    }
  };
</script>