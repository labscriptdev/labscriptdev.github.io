<template>
  <div style="position:relative; height:400px;">
    <div ref="gameRef" style="height:100%;"></div>
    
    <slot name="loading" v-if="!motor.reactive.ready">
      <div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">
        <div style="background:#ffffff; padding:10px 20px;">Loading</div>
      </div>
    </slot>

    <slot name="content" v-if="motor.reactive.ready">Content</slot>
    <pre style="position:absolute; bottom:0; right:0;">motor.global: {{ motor.global }}</pre>
  </div>
</template>

<script setup>
  console.clear();
  import { ref, reactive, onMounted, onUnmounted, defineProps } from 'vue';

  const gameRef = ref(null);
  const props = defineProps({
    scene: {
      type: String,
      default: '',
    },
    scripts: {
      type: Array,
      default: () => ([]),
    },
  });

  import * as THREE from 'three';
  import { PhysicsLoader } from 'enable3d';
  import { AmmoPhysics } from '@enable3d/ammo-physics';
  import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
  import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

  let motor = {
    reactive: reactive({
      ready: false,
      width: 0,
      height: 0,
      frame: 0,
    }),
    global: reactive({}),
    el: null,
    scene: false,
    camera: false,
    clock: false,
    renderer: false,
    scripts: {},
    events: [],
    THREE: false,

    getScriptInstance(name, merge={}) {
      const instance = new (motor.scripts[ name ] ? motor.scripts[ name ] : class {});
      instance.keyboard = {};
      instance.input = {};
      instance.motor = motor;
      for(let attr in merge) {
        instance[ attr ] = instance[ attr ] || merge[ attr ];
      }
      return instance;
    },

    sceneTraverseMethod(methodName, arg1=null) {
      motor.scene.traverse((object) => {
        if (Array.isArray(object.userData.scripts)) {
          object.userData.scripts.map(script => {
            if (typeof script[ methodName ]=='function') {
              const data = script[ methodName ](arg1);
            }
          });
        }
      });
    },

    onMounted() {
      PhysicsLoader('/assets/ammo', () => {
        motor.el = gameRef.value;
        motor.reactive.width = motor.el.offsetWidth;
        motor.reactive.height = motor.el.offsetHeight;
        
        motor.scene = new THREE.Scene();
        motor.camera = new THREE.PerspectiveCamera(50, motor.reactive.width / motor.reactive.height, 1, 1000);
        motor.clock = new THREE.Clock();

        motor.physics = new AmmoPhysics(motor.scene);
        motor.physics.debug.enable();
        motor.physics.debug.mode(1);
        
        motor.renderer = new THREE.WebGLRenderer({ antialias: true });
        motor.reactive.frame = 0;
        motor.THREE = THREE;
  
        motor.el.appendChild(motor.renderer.domElement);
        motor.renderer.setSize(motor.reactive.width, motor.reactive.height);
  
        motor.events.push([ window, 'resize', (ev) => {
          motor.reactive.width = motor.el.offsetWidth;
          motor.reactive.height = motor.el.offsetHeight;
          motor.renderer.setSize(motor.reactive.width, motor.reactive.height);
        }]);

        props.scripts.map((script) => {
          motor.scripts[ script.name ] = script;
        });

        (new GLTFLoader()).load(props.scene, (gltf) => {
          motor.scene.userData.scripts = [];

          if (motor.scripts.SceneScript) {
            const instance = motor.getScriptInstance('SceneScript', {
              orbitControls: false,
              gridHelper: false,
              physicsDebug: false,
              scene: motor.scene,
            });

            if (instance.orbitControls) {
              instance.orbitControls = new OrbitControls(motor.camera, motor.renderer.domElement);
              motor.camera.position.set(0, 20, 100);
            }
            
            if (instance.gridHelper) {
              const gridHelper = Array.isArray(instance.gridHelper) ? instance.gridHelper : [ 10, 10 ];
              instance.gridHelper = new THREE.GridHelper(gridHelper[0], gridHelper[1]);
              motor.scene.add(instance.gridHelper);
            }

            if (instance.physicsDebug && motor.physics.debug) {
              // motor.physics.debug.enable();
              // motor.physics.debug.mode(2048 + 4096);
            }

            motor.scene.userData.scripts.push(instance);
          }

          motor.scene.add(gltf.scene);
          
          gltf.scene.traverse((object) => {
            ['script0', 'script1', 'script2', 'script3', 'script4', 'script5', 'script6', 'script7', 'script8', 'script9'].map((attr) => {
              if (object.userData[attr]) {
                object.userData.scripts = [];
                const instance = motor.getScriptInstance(object.userData[attr], { object });
                object.userData.scripts.push(instance);
                delete object.userData[attr];

                motor.events.push([ document, 'keydown', (ev) => {
                  instance.keyboard[ ev.key ] = true;
                  if (typeof instance.onInput=='function') {
                    instance.input = instance.onInput(instance.keyboard);
                  }
                }]);
                
                motor.events.push([ document, 'keyup', (ev) => {
                  delete instance.keyboard[ ev.key ];
                  if (typeof instance.onInput=='function') {
                    instance.input = instance.onInput(instance.keyboard);
                  }
                }]);
              }
            });
          });

          motor.reactive.ready = true;

          if (window.sceneInterval) {
            clearInterval(window.sceneInterval);
            motor.sceneTraverseMethod('onCreate');
          } else {
            motor.sceneTraverseMethod('onCreate');
          }

          window.sceneInterval = setInterval(() => {
            motor.scene.userData.scripts.map((script) => {
              if (script.orbitControls) {
                script.orbitControls.update();
              }
  
              if (script.physicsDebug) {
                motor.physics.updateDebugger();
              }
            });


            motor.sceneTraverseMethod('onUpdate');
            motor.physics.update(motor.clock.getDelta() * 1000);
            motor.renderer.render(motor.scene, motor.camera);
            motor.reactive.frame++;
          }, 1000/60);

          motor.events.map(([ target, event, callback ]) => {
            target.addEventListener(event, callback);
          });
        });
      });
    },

    onUnmounted() {
      motor.events.map(([ target, event, callback ]) => {
        target.removeEventListener(event, callback);
      });
    },
  };

  onMounted(motor.onMounted);
  onUnmounted(motor.onUnmounted);
</script>