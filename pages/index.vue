<template>
  <v-app>
    <div class="d-flex flex-column" style="height:100vh; overflow:auto;">
      <v-app-bar flat>
        <v-container class="d-flex align-center">
          <v-avatar
            class="mr-10"
            color="grey-lighten-3"
            size="40"
          >
            <v-img src="/assets/labscript.dev.png" />
          </v-avatar>
  
          <v-btn
            v-for="(_link, i) in headerLinks"
            :key="i"
            variant="text"
            :to="_link.to"
          >
            {{ _link.name }}
          </v-btn>
        </v-container>
      </v-app-bar>

      <div class="flex-grow-1">
        <v-container>
          <br><br><br>
          <div ref="canvas"></div>
        </v-container>
      </div>
    </div>
  </v-app>
</template>

<script>
  import * as THREE from 'three';
  import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
	import { CSS3DRenderer, CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

  export default {
    methods: {
      threeInit() {
        const canvas = this.$refs.canvas;
        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set( 50, 50, 50 );

        const material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 1, side: THREE.DoubleSide } );

        for ( let i = 0; i < 10; i ++ ) {
          const element = document.createElement( 'div' );
          element.style.width = '100px';
          element.style.height = '100px';
          element.style.opacity = 1;
          element.style.background = new THREE.Color( Math.random() * 0xffffff ).getStyle();
          element.innerHTML = `<img src="https://media2.giphy.com/media/McOizsmlABPTVxdCeT/giphy.gif?cid=ecf05e4795z8ta55ebv0tozgs9ojwnrom33edma6hyx14l84&rid=giphy.gif&ct=g" alt="" />`;

          const object = new CSS3DObject( element );

          // object.position.x = Math.random() * 200 - 100;
          // object.position.y = Math.random() * 200 - 100;
          // object.position.z = Math.random() * 200 - 100;

          object.position.x = i * 50;
          object.position.y = i * 50;
          object.position.z = i * 50;

          // object.rotation.x = Math.random();
          // object.rotation.y = Math.random();
          // object.rotation.z = Math.random();
          // object.scale.x = Math.random() + 0.5;
          // object.scale.y = Math.random() + 0.5;
          scene.add( object );
        }

        // camera.lookAt(scene.children[0]);

        const renderer = new CSS3DRenderer();
				renderer.setSize( width, height );
				canvas.appendChild( renderer.domElement );
        renderer.domElement.style = `width:100%; height:500px; overflow:hidden; border:solid 1px red;`;

        const controls = new TrackballControls(camera, renderer.domElement);

        const animate = () => {
          renderer.render( scene, camera );
          controls.update();
          requestAnimationFrame( animate );
        };

        animate();

        // window.addEventListener('resize', () => {
        //   width = canvas.offsetWidth;
        //   height = canvas.offsetHeight;

        //   camera.aspect = width / height;
        //   camera.updateProjectionMatrix();
        //   renderer.setSize(width, height);
        // });
      },
    },

    mounted() {
      // this.three = this.threeInit();
    },

    data() {
      return {
        headerLinks: [
          {
            name: 'Tools',
            to: '/tool',
          },
        ],

        three: false,
      };
    },
  }
</script>