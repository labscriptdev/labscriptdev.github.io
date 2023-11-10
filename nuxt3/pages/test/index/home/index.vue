<template>
  <div>
    <threejs v-model="game" #default="gameData">
      <!--  -->
    </threejs>

    <v-navigation-drawer
      :model-value="false"
      permanent
      location="end"
      width="400px"
    >
      <app-dd :model-value="game"></app-dd>
    </v-navigation-drawer>
  </div>
</template>

<script>
  // https://codepen.io/zadvorsky/pen/VaXqRW?editors=0010
  // https://stemkoski.github.io/Three.js/Particle-Engine.html

  import * as THREE from 'three';
  // import * as THREE from "https://cdn.skypack.dev/three@0.124.0";
  // import ky from "https://cdn.skypack.dev/kyouka@1.2.2";
  // import { OrbitControls } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/controls/OrbitControls";
  // import { GLTFLoader } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/loaders/GLTFLoader";
  // import { FBXLoader } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/loaders/FBXLoader";
  // import { EffectComposer } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/postprocessing/EffectComposer";
  // import Stats from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/libs/stats.module";
  // import * as dat from "https://cdn.skypack.dev/dat.gui@0.7.7";
  // import { RenderPass } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/postprocessing/RenderPass.js";
  // import { ShaderPass } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/postprocessing/ShaderPass.js";
  // import gsap from "https://cdn.skypack.dev/gsap@3.6.0";

  const TrackballControls=function(e,t){var n=this,o={NONE:-1,ROTATE:0,ZOOM:1,PAN:2,TOUCH_ROTATE:3,TOUCH_ZOOM:4,TOUCH_PAN:5};this.object=e,this.domElement=void 0!==t?t:document,this.enabled=!0,this.screen={left:0,top:0,width:0,height:0},this.rotateSpeed=1,this.zoomSpeed=1.2,this.panSpeed=.3,this.noRotate=!1,this.noZoom=!1,this.noPan=!1,this.noRoll=!1,this.staticMoving=!1,this.dynamicDampingFactor=.2,this.minDistance=0,this.maxDistance=1/0,this.keys=[65,83,68],this.target=new THREE.Vector3;var s=new THREE.Vector3,i=o.NONE,a=o.NONE,c=new THREE.Vector3,r=new THREE.Vector3,h=new THREE.Vector3,l=new THREE.Vector2,p=new THREE.Vector2,u=0,d=0,g=new THREE.Vector2,m=new THREE.Vector2;this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.up0=this.object.up.clone();var O={type:"change"};function $(e){!1!==n.enabled&&(window.removeEventListener("keydown",$),a=i,i===o.NONE&&(e.keyCode!==n.keys[o.ROTATE]||n.noRotate?e.keyCode!==n.keys[o.ZOOM]||n.noZoom?e.keyCode!==n.keys[o.PAN]||n.noPan||(i=o.PAN):i=o.ZOOM:i=o.ROTATE))}function v(e){!1===n.enabled||(e.preventDefault(),e.stopPropagation(),i!==o.ROTATE||n.noRotate?i!==o.ZOOM||n.noZoom?i!==o.PAN||n.noPan||(m=n.getMouseOnScreen(e.clientX,e.clientY)):p=n.getMouseOnScreen(e.clientX,e.clientY):h=n.getMouseProjectionOnBall(e.clientX,e.clientY))}function b(e){!1!==n.enabled&&(e.preventDefault(),e.stopPropagation(),i=o.NONE,document.removeEventListener("mousemove",v),document.removeEventListener("mouseup",b))}function y(e){if(!1!==n.enabled){e.preventDefault(),e.stopPropagation();var t=0;e.wheelDelta?t=e.wheelDelta/40:e.detail&&(t=-e.detail/3),l.y+=.01*t}}this.handleResize=function(){this.domElement===document?(this.screen.left=0,this.screen.top=0,this.screen.width=window.innerWidth,this.screen.height=window.innerHeight):this.screen=this.domElement.getBoundingClientRect()},this.handleEvent=function(e){"function"==typeof this[e.type]&&this[e.type](e)},this.getMouseOnScreen=function(e,t){return new THREE.Vector2((e-n.screen.left)/n.screen.width,(t-n.screen.top)/n.screen.height)},this.getMouseProjectionOnBall=function(e,t){var o=new THREE.Vector3((e-.5*n.screen.width-n.screen.left)/(.5*n.screen.width),(.5*n.screen.height+n.screen.top-t)/(.5*n.screen.height),0),s=o.length();n.noRoll?s<Math.SQRT1_2?o.z=Math.sqrt(1-s*s):o.z=.5/s:s>1?o.normalize():o.z=Math.sqrt(1-s*s),c.copy(n.object.position).sub(n.target);var i=n.object.up.clone().setLength(o.y);return i.add(n.object.up.clone().cross(c).setLength(o.x)),i.add(c.setLength(o.z)),i},this.rotateCamera=function(){var e=Math.acos(r.dot(h)/r.length()/h.length());if(e){var t=new THREE.Vector3().crossVectors(r,h).normalize(),o=new THREE.Quaternion;e*=n.rotateSpeed,o.setFromAxisAngle(t,-e),c.applyQuaternion(o),n.object.up.applyQuaternion(o),h.applyQuaternion(o),n.staticMoving?r.copy(h):(o.setFromAxisAngle(t,e*(n.dynamicDampingFactor-1)),r.applyQuaternion(o))}},this.zoomCamera=function(){if(i===o.TOUCH_ZOOM){var e=u/d;u=d,c.multiplyScalar(e)}else{var e=1+(p.y-l.y)*n.zoomSpeed;1!==e&&e>0&&(c.multiplyScalar(e),n.staticMoving?l.copy(p):l.y+=(p.y-l.y)*this.dynamicDampingFactor)}},this.panCamera=function(){var e=m.clone().sub(g);if(e.lengthSq()){e.multiplyScalar(c.length()*n.panSpeed);var t=c.clone().cross(n.object.up).setLength(e.x);t.add(n.object.up.clone().setLength(e.y)),n.object.position.add(t),n.target.add(t),n.staticMoving?g=m:g.add(e.subVectors(m,g).multiplyScalar(n.dynamicDampingFactor))}},this.checkDistances=function(){n.noZoom&&n.noPan||(c.lengthSq()>n.maxDistance*n.maxDistance&&n.object.position.addVectors(n.target,c.setLength(n.maxDistance)),c.lengthSq()<n.minDistance*n.minDistance&&n.object.position.addVectors(n.target,c.setLength(n.minDistance)))},this.update=function(){c.subVectors(n.object.position,n.target),n.noRotate||n.rotateCamera(),n.noZoom||n.zoomCamera(),n.noPan||n.panCamera(),n.object.position.addVectors(n.target,c),n.checkDistances(),n.object.lookAt(n.target),s.distanceToSquared(n.object.position)>0&&(n.dispatchEvent(O),s.copy(n.object.position))},this.reset=function(){i=o.NONE,a=o.NONE,n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.up.copy(n.up0),c.subVectors(n.object.position,n.target),n.object.lookAt(n.target),n.dispatchEvent(O),s.copy(n.object.position)},this.domElement.addEventListener("contextmenu",function(e){e.preventDefault()},!1),this.domElement.addEventListener("mousedown",function e(t){!1!==n.enabled&&(t.preventDefault(),t.stopPropagation(),i===o.NONE&&(i=t.button),i!==o.ROTATE||n.noRotate?i!==o.ZOOM||n.noZoom?i!==o.PAN||n.noPan||(g=n.getMouseOnScreen(t.clientX,t.clientY),m.copy(g)):(l=n.getMouseOnScreen(t.clientX,t.clientY),p.copy(l)):(r=n.getMouseProjectionOnBall(t.clientX,t.clientY),h.copy(r)),document.addEventListener("mousemove",v,!1),document.addEventListener("mouseup",b,!1))},!1),this.domElement.addEventListener("mousewheel",y,!1),this.domElement.addEventListener("DOMMouseScroll",y,!1),this.domElement.addEventListener("touchstart",function e(t){if(!1!==n.enabled)switch(t.touches.length){case 1:i=o.TOUCH_ROTATE,r=h=n.getMouseProjectionOnBall(t.touches[0].pageX,t.touches[0].pageY);break;case 2:i=o.TOUCH_ZOOM;var s=t.touches[0].pageX-t.touches[1].pageX,a=t.touches[0].pageY-t.touches[1].pageY;d=u=Math.sqrt(s*s+a*a);break;case 3:i=o.TOUCH_PAN,g=m=n.getMouseOnScreen(t.touches[0].pageX,t.touches[0].pageY);break;default:i=o.NONE}},!1),this.domElement.addEventListener("touchend",function e(t){if(!1!==n.enabled){switch(t.touches.length){case 1:r=h=n.getMouseProjectionOnBall(t.touches[0].pageX,t.touches[0].pageY);break;case 2:u=d=0;break;case 3:g=m=n.getMouseOnScreen(t.touches[0].pageX,t.touches[0].pageY)}i=o.NONE}},!1),this.domElement.addEventListener("touchmove",function e(t){if(!1!==n.enabled)switch(t.preventDefault(),t.stopPropagation(),t.touches.length){case 1:h=n.getMouseProjectionOnBall(t.touches[0].pageX,t.touches[0].pageY);break;case 2:var s=t.touches[0].pageX-t.touches[1].pageX,a=t.touches[0].pageY-t.touches[1].pageY;d=Math.sqrt(s*s+a*a);break;case 3:m=n.getMouseOnScreen(t.touches[0].pageX,t.touches[0].pageY);break;default:i=o.NONE}},!1),window.addEventListener("keydown",$,!1),window.addEventListener("keyup",function e(t){!1!==n.enabled&&(i=a,window.addEventListener("keydown",$,!1))},!1),this.handleResize()};

  export default {
    data: () => ({
      game: {
        options: {
          fps: 60,
          // debug: false,
          gridHelper: true,
          orbitControls: true,
        },
        onCreate({ scene, camera, effectComposer }) {
          const { width, height } = this;

          let controls;
          let particles = [];
          let particleSystem;
          let imageWidth = 640;
          let imageHeight = 360;
          let imageData = null;
          let animationTime = 0;
          let animationDelta = 0.03;

          let shaderAttributes = {
            vertexColor: {
              type: "c",
              value: []
            }
          };

          let shaderUniforms = {
            amplitude: {
              type: "f",
              value: 0.5
            }
          };

          const vertexShader = `
            // uniform float amplitude;
            // attribute float size;
            uniform float amplitude;

            attribute vec3 vertexColor;

            varying vec4 varColor;

            void main()
            {
            varColor = vec4(vertexColor, 1.0);

            vec4 pos = vec4(position, 1.0);
            pos.z *= amplitude;

            vec4 mvPosition = modelViewMatrix * pos;

            gl_PointSize = 1.0;
            gl_Position = projectionMatrix * mvPosition;
            }
          `;

          const fragmentShader = `
            varying vec4 varColor;

            void main()
            {
            gl_FragColor = varColor;
            }
          `;

          controls = new TrackballControls(camera);
          controls.rotateSpeed = 1.0;
          controls.zoomSpeed = 1.2;
          controls.panSpeed = 0.8;
          controls.noZoom = false;
          controls.noPan = true;
          controls.staticMoving = true;
          controls.dynamicDampingFactor = 0.3;

          // Create pixel data
          const createPixelData = () => {
            const image = document.createElement("img");
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            
            image.crossOrigin = "Anonymous";
            image.onload = function() {
              image.width = canvas.width = imageWidth;
              image.height = canvas.height = imageHeight;
              
              context.fillStyle = context.createPattern(image, 'no-repeat');
              context.fillRect(0, 0, imageWidth, imageHeight);
              //context.drawImage(image, 0, 0, imageWidth, imageHeight);
              
              imageData = context.getImageData(0, 0, imageWidth, imageHeight).data;

              createPaticles();
            };
            
            image.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/tree_star.jpg";
          };

          const createPaticles = () => {
            let colors = [];
            let weights = [0.2126, 0.7152, 0.0722];
            let c = 0;
            
            let geometry, material;
            let x, y;
            let zRange = 400;
            
            geometry = new THREE.BufferGeometry();
            // geometry.dynamic = false;
            // geometry.position.needsUpdate = false;

            x = imageWidth * -0.5;
            y = imageHeight * 0.5;

            let shaderMaterial = new THREE.ShaderMaterial({
              attributes: shaderAttributes,
              uniforms: shaderUniforms,
              vertexShader,
              fragmentShader,
            });

            let vertices = [];
            for (var i = 0; i < imageHeight; i++) {
              for (var j = 0; j < imageWidth; j++) {
                var color = new THREE.Color();

                color.setRGB(imageData[c] / 255, imageData[c + 1] / 255, imageData[c + 2] / 255);
                shaderAttributes.vertexColor.value.push(color);

                var weight = color.r * weights[0] +
                  color.g * weights[1] +
                  color.b * weights[2];

                var vertex = new THREE.Vector3();

                vertex.x = x;
                vertex.y = y;
                vertex.z = (zRange * -0.5) + (zRange * weight);

                vertices.push(x, y, (zRange * -0.5) + (zRange * weight));

                c += 4;
                x++;
              }

              x = imageWidth * -0.5;
              y--;
            }

            vertices = new Float32Array(vertices);
            geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

            // particleSystem = new THREE.PointMesh(geometry, shaderMaterial);
            // scene.add(particleSystem);
          };

          createPixelData();

          this.shaderUniforms = shaderUniforms;
          this.animationTime = animationTime;
          this.animationDelta = animationDelta;
        },

        onUpdate({ }) {
          const { shaderUniforms } = this;
          shaderUniforms.amplitude.value = Math.sin(this.animationTime);
          this.animationTime += this.animationDelta;
        },
      },
    }),
  };
</script>