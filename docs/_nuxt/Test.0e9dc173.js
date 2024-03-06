import{$ as y,d as S,c as U,F as b,m as T,f as u,aJ as g,aK as x,aL as M,aM as c,V as d,aN as D,M as C,ap as B}from"./three.module.6da1ccc8.js";import"./matter.0784338f.js";import _ from"./Car4.f3f87272.js";import"./entry.0189ed9e.js";import"./extendedObject3D.b499f0fa.js";const F={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class P{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const z=new y(-1,1,1,-1,0,1);class V extends U{constructor(){super(),this.setAttribute("position",new b([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new b([0,2,0,0,2,0],2))}}const H=new V;class R{constructor(e){this._mesh=new S(H,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,z)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}const Q={name:"LuminosityHighPassShader",shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new T(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			vec3 luma = vec3( 0.299, 0.587, 0.114 );

			float v = dot( texel.xyz, luma );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class m extends P{constructor(e,i,t,a){super(),this.strength=i!==void 0?i:1,this.radius=t,this.threshold=a,this.resolution=e!==void 0?new u(e.x,e.y):new u(256,256),this.clearColor=new T(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);this.renderTargetBright=new g(r,s,{type:x}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let n=0;n<this.nMips;n++){const v=new g(r,s,{type:x});v.texture.name="UnrealBloomPass.h"+n,v.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(v);const p=new g(r,s,{type:x});p.texture.name="UnrealBloomPass.v"+n,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),r=Math.round(r/2),s=Math.round(s/2)}const h=Q;this.highPassUniforms=M.clone(h.uniforms),this.highPassUniforms.luminosityThreshold.value=a,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new c({uniforms:this.highPassUniforms,vertexShader:h.vertexShader,fragmentShader:h.fragmentShader}),this.separableBlurMaterials=[];const o=[3,5,7,9,11];r=Math.round(this.resolution.x/2),s=Math.round(this.resolution.y/2);for(let n=0;n<this.nMips;n++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(o[n])),this.separableBlurMaterials[n].uniforms.invSize.value=new u(1/r,1/s),r=Math.round(r/2),s=Math.round(s/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=i,this.compositeMaterial.uniforms.bloomRadius.value=.1;const w=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=w,this.bloomTintColors=[new d(1,1,1),new d(1,1,1),new d(1,1,1),new d(1,1,1),new d(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const f=F;this.copyUniforms=M.clone(f.uniforms),this.blendMaterial=new c({uniforms:this.copyUniforms,vertexShader:f.vertexShader,fragmentShader:f.fragmentShader,blending:D,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new T,this.oldClearAlpha=1,this.basic=new C,this.fsQuad=new R(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(e,i){let t=Math.round(e/2),a=Math.round(i/2);this.renderTargetBright.setSize(t,a);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(t,a),this.renderTargetsVertical[r].setSize(t,a),this.separableBlurMaterials[r].uniforms.invSize.value=new u(1/t,1/a),t=Math.round(t/2),a=Math.round(a/2)}render(e,i,t,a,r){e.getClearColor(this._oldClearColor),this.oldClearAlpha=e.getClearAlpha();const s=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),r&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=t.texture,e.setRenderTarget(null),e.clear(),this.fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=t.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this.fsQuad.render(e);let h=this.renderTargetBright;for(let o=0;o<this.nMips;o++)this.fsQuad.material=this.separableBlurMaterials[o],this.separableBlurMaterials[o].uniforms.colorTexture.value=h.texture,this.separableBlurMaterials[o].uniforms.direction.value=m.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[o]),e.clear(),this.fsQuad.render(e),this.separableBlurMaterials[o].uniforms.colorTexture.value=this.renderTargetsHorizontal[o].texture,this.separableBlurMaterials[o].uniforms.direction.value=m.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[o]),e.clear(),this.fsQuad.render(e),h=this.renderTargetsVertical[o];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this.fsQuad.render(e),this.fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this.fsQuad.render(e)):(e.setRenderTarget(t),this.fsQuad.render(e)),e.setClearColor(this._oldClearColor,this.oldClearAlpha),e.autoClear=s}getSeperableBlurMaterial(e){const i=[];for(let t=0;t<e;t++)i.push(.39894*Math.exp(-.5*t*t/(e*e))/e);return new c({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new u(.5,.5)},direction:{value:new u(.5,.5)},gaussianCoefficients:{value:i}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {
					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(e){return new c({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`varying vec2 vUv;
				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor(const in float factor) {
					float mirrorFactor = 1.2 - factor;
					return mix(factor, mirrorFactor, bloomRadius);
				}

				void main() {
					gl_FragColor = bloomStrength * ( lerpBloomFactor(bloomFactors[0]) * vec4(bloomTintColors[0], 1.0) * texture2D(blurTexture1, vUv) +
						lerpBloomFactor(bloomFactors[1]) * vec4(bloomTintColors[1], 1.0) * texture2D(blurTexture2, vUv) +
						lerpBloomFactor(bloomFactors[2]) * vec4(bloomTintColors[2], 1.0) * texture2D(blurTexture3, vUv) +
						lerpBloomFactor(bloomFactors[3]) * vec4(bloomTintColors[3], 1.0) * texture2D(blurTexture4, vUv) +
						lerpBloomFactor(bloomFactors[4]) * vec4(bloomTintColors[4], 1.0) * texture2D(blurTexture5, vUv) );
				}`})}}m.BlurDirectionX=new u(1,0);m.BlurDirectionY=new u(0,1);const N={options:{fps:60,debug:!0},name:"Hello",preload(){return{road_design:{type:"gltf",url:"/assets/threejs/models/road_design/scene.gltf"},van:{type:"gltf",url:"/assets/threejs/models/van/scene.gltf"},woodbox:{type:"texture",url:"/assets/threejs/textures/wood-box.png"},tire:{type:"texture",url:"/assets/threejs/textures/tire.jpg"}}},onCreate(){this.getData(),this.createMap(),this.createCar()},onUpdate(){this.getData()},createMap(){const l=this.getData();(()=>{l.scene.add(this.road_design);const e=3;this.road_design.scale.set(e,e,e),this.road_design.position.set(0,-30,0),l.physics.add.existing(this.road_design,{mass:0,shape:"concaveMesh"}),this.road_design.body.setFriction(.2)})(),(()=>{const e=new m(new u(window.innerWidth,window.innerHeight),1.5,.4,.85);e.threshold=0,e.strength=1,e.radius=.5,l.effectComposer.addPass(e)})()},createBoxes(){const l=this.getData();let e=3;Array(10).fill(null).map((i,t)=>t*e).forEach(i=>{Array(10).fill(null).map((t,a)=>a*e).forEach(t=>{const r=new C({map:this.woodbox}),s=new S(new B(1,1,1),r);s.position.set(i+-10,1,t+-10),l.scene.add(s),l.physics.add.existing(s,{mass:1})})})},createCar(){const l=this.getData(),{scene:e,physics:i}=l;e.add(this.car=new _({game:l,x:0,y:5,z:0})),this.car.add(this.van)}};export{N as default};
