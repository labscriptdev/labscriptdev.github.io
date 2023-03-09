import{y as oe,o as le,au as G,q as X,C as q,V as S,as as Q,ar as W,aq as k,d as z,aF as ne,M as Y,ac as ue}from"./three.module.4dbe7b12.js";import"./matter.1497efbd.js";import fe from"./Car4.731a7cb5.js";const he={uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );
			gl_FragColor.a *= opacity;


		}`};class ce{constructor(){this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const de=new oe(-1,1,1,-1,0,1),I=new le;I.setAttribute("position",new G([-1,3,0,-1,-1,0,3,-1,0],3));I.setAttribute("uv",new G([0,2,0,0,2,0],2));class pe{constructor(t){this._mesh=new X(I,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,de)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}var me={exports:{}};(function(x){(function(t,b,c){if(!t)return;for(var h={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},u={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},m={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},M={option:"alt",command:"meta",return:"enter",escape:"esc",plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},p,y=1;y<20;++y)h[111+y]="f"+y;for(y=0;y<=9;++y)h[y+96]=y.toString();function P(e,r,s){if(e.addEventListener){e.addEventListener(r,s,!1);return}e.attachEvent("on"+r,s)}function T(e){if(e.type=="keypress"){var r=String.fromCharCode(e.which);return e.shiftKey||(r=r.toLowerCase()),r}return h[e.which]?h[e.which]:u[e.which]?u[e.which]:String.fromCharCode(e.which).toLowerCase()}function F(e,r){return e.sort().join(",")===r.sort().join(",")}function A(e){var r=[];return e.shiftKey&&r.push("shift"),e.altKey&&r.push("alt"),e.ctrlKey&&r.push("ctrl"),e.metaKey&&r.push("meta"),r}function J(e){if(e.preventDefault){e.preventDefault();return}e.returnValue=!1}function Z(e){if(e.stopPropagation){e.stopPropagation();return}e.cancelBubble=!0}function R(e){return e=="shift"||e=="ctrl"||e=="alt"||e=="meta"}function $(){if(!p){p={};for(var e in h)e>95&&e<112||h.hasOwnProperty(e)&&(p[h[e]]=e)}return p}function ee(e,r,s){return s||(s=$()[e]?"keydown":"keypress"),s=="keypress"&&r.length&&(s="keydown"),s}function te(e){return e==="+"?["+"]:(e=e.replace(/\+{2}/g,"+plus"),e.split("+"))}function L(e,r){var s,d,w,U=[];for(s=te(e),w=0;w<s.length;++w)d=s[w],M[d]&&(d=M[d]),r&&r!="keypress"&&m[d]&&(d=m[d],U.push("shift")),R(d)&&U.push(d);return r=ee(d,U,r),{key:d,modifiers:U,action:r}}function O(e,r){return e===null||e===b?!1:e===r?!0:O(e.parentNode,r)}function v(e){var r=this;if(e=e||b,!(r instanceof v))return new v(e);r.target=e,r._callbacks={},r._directMap={};var s={},d,w=!1,U=!1,V=!1;function E(i){i=i||{};var o=!1,n;for(n in s){if(i[n]){o=!0;continue}s[n]=0}o||(V=!1)}function j(i,o,n,a,f,_){var l,g,D=[],C=n.type;if(!r._callbacks[i])return[];for(C=="keyup"&&R(i)&&(o=[i]),l=0;l<r._callbacks[i].length;++l)if(g=r._callbacks[i][l],!(!a&&g.seq&&s[g.seq]!=g.level)&&C==g.action&&(C=="keypress"&&!n.metaKey&&!n.ctrlKey||F(o,g.modifiers))){var se=!a&&g.combo==f,ae=a&&g.seq==a&&g.level==_;(se||ae)&&r._callbacks[i].splice(l,1),D.push(g)}return D}function K(i,o,n,a){r.stopCallback(o,o.target||o.srcElement,n,a)||i(o,n)===!1&&(J(o),Z(o))}r._handleKey=function(i,o,n){var a=j(i,o,n),f,_={},l=0,g=!1;for(f=0;f<a.length;++f)a[f].seq&&(l=Math.max(l,a[f].level));for(f=0;f<a.length;++f){if(a[f].seq){if(a[f].level!=l)continue;g=!0,_[a[f].seq]=1,K(a[f].callback,n,a[f].combo,a[f].seq);continue}g||K(a[f].callback,n,a[f].combo)}var D=n.type=="keypress"&&U;n.type==V&&!R(i)&&!D&&E(_),U=g&&n.type=="keydown"};function H(i){typeof i.which!="number"&&(i.which=i.keyCode);var o=T(i);if(!!o){if(i.type=="keyup"&&w===o){w=!1;return}r.handleKey(o,A(i),i)}}function re(){clearTimeout(d),d=setTimeout(E,1e3)}function ie(i,o,n,a){s[i]=0;function f(C){return function(){V=C,++s[i],re()}}function _(C){K(n,C,i),a!=="keyup"&&(w=T(C)),setTimeout(E,10)}for(var l=0;l<o.length;++l){var g=l+1===o.length,D=g?_:f(a||L(o[l+1]).action);N(o[l],D,a,i,l)}}function N(i,o,n,a,f){r._directMap[i+":"+n]=o,i=i.replace(/\s+/g," ");var _=i.split(" "),l;if(_.length>1){ie(i,_,o,n);return}l=L(i,n),r._callbacks[l.key]=r._callbacks[l.key]||[],j(l.key,l.modifiers,{type:l.action},a,i,f),r._callbacks[l.key][a?"unshift":"push"]({callback:o,modifiers:l.modifiers,action:l.action,seq:a,level:f,combo:i})}r._bindMultiple=function(i,o,n){for(var a=0;a<i.length;++a)N(i[a],o,n)},P(e,"keypress",H),P(e,"keydown",H),P(e,"keyup",H)}v.prototype.bind=function(e,r,s){var d=this;return e=e instanceof Array?e:[e],d._bindMultiple.call(d,e,r,s),d},v.prototype.unbind=function(e,r){var s=this;return s.bind.call(s,e,function(){},r)},v.prototype.trigger=function(e,r){var s=this;return s._directMap[e+":"+r]&&s._directMap[e+":"+r]({},e),s},v.prototype.reset=function(){var e=this;return e._callbacks={},e._directMap={},e},v.prototype.stopCallback=function(e,r){var s=this;if((" "+r.className+" ").indexOf(" mousetrap ")>-1||O(r,s.target))return!1;if("composedPath"in e&&typeof e.composedPath=="function"){var d=e.composedPath()[0];d!==e.target&&(r=d)}return r.tagName=="INPUT"||r.tagName=="SELECT"||r.tagName=="TEXTAREA"||r.isContentEditable},v.prototype.handleKey=function(){var e=this;return e._handleKey.apply(e,arguments)},v.addKeycodes=function(e){for(var r in e)e.hasOwnProperty(r)&&(h[r]=e[r]);p=null},v.init=function(){var e=v(b);for(var r in e)r.charAt(0)!=="_"&&(v[r]=function(s){return function(){return e[s].apply(e,arguments)}}(r))},v.init(),t.Mousetrap=v,x.exports&&(x.exports=v),typeof c=="function"&&c.amd&&c(function(){return v})})(typeof window<"u"?window:null,typeof window<"u"?document:null)})(me);const ve={shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new q(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class B extends ce{constructor(t,b,c,h){super(),this.strength=b!==void 0?b:1,this.radius=c,this.threshold=h,this.resolution=t!==void 0?new S(t.x,t.y):new S(256,256),this.clearColor=new q(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let u=Math.round(this.resolution.x/2),m=Math.round(this.resolution.y/2);this.renderTargetBright=new Q(u,m),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let T=0;T<this.nMips;T++){const F=new Q(u,m);F.texture.name="UnrealBloomPass.h"+T,F.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(F);const A=new Q(u,m);A.texture.name="UnrealBloomPass.v"+T,A.texture.generateMipmaps=!1,this.renderTargetsVertical.push(A),u=Math.round(u/2),m=Math.round(m/2)}const M=ve;this.highPassUniforms=W.clone(M.uniforms),this.highPassUniforms.luminosityThreshold.value=h,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new k({uniforms:this.highPassUniforms,vertexShader:M.vertexShader,fragmentShader:M.fragmentShader,defines:{}}),this.separableBlurMaterials=[];const p=[3,5,7,9,11];u=Math.round(this.resolution.x/2),m=Math.round(this.resolution.y/2);for(let T=0;T<this.nMips;T++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(p[T])),this.separableBlurMaterials[T].uniforms.texSize.value=new S(u,m),u=Math.round(u/2),m=Math.round(m/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=b,this.compositeMaterial.uniforms.bloomRadius.value=.1,this.compositeMaterial.needsUpdate=!0;const y=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=y,this.bloomTintColors=[new z(1,1,1),new z(1,1,1),new z(1,1,1),new z(1,1,1),new z(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const P=he;this.copyUniforms=W.clone(P.uniforms),this.copyUniforms.opacity.value=1,this.materialCopy=new k({uniforms:this.copyUniforms,vertexShader:P.vertexShader,fragmentShader:P.fragmentShader,blending:ne,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new q,this.oldClearAlpha=1,this.basic=new Y,this.fsQuad=new pe(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.materialCopy.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,b){let c=Math.round(t/2),h=Math.round(b/2);this.renderTargetBright.setSize(c,h);for(let u=0;u<this.nMips;u++)this.renderTargetsHorizontal[u].setSize(c,h),this.renderTargetsVertical[u].setSize(c,h),this.separableBlurMaterials[u].uniforms.texSize.value=new S(c,h),c=Math.round(c/2),h=Math.round(h/2)}render(t,b,c,h,u){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const m=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),u&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=c.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=c.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let M=this.renderTargetBright;for(let p=0;p<this.nMips;p++)this.fsQuad.material=this.separableBlurMaterials[p],this.separableBlurMaterials[p].uniforms.colorTexture.value=M.texture,this.separableBlurMaterials[p].uniforms.direction.value=B.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[p]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[p].uniforms.colorTexture.value=this.renderTargetsHorizontal[p].texture,this.separableBlurMaterials[p].uniforms.direction.value=B.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[p]),t.clear(),this.fsQuad.render(t),M=this.renderTargetsVertical[p];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.materialCopy,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,u&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(c),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=m}getSeperableBlurMaterial(t){return new k({defines:{KERNEL_RADIUS:t,SIGMA:t},uniforms:{colorTexture:{value:null},texSize:{value:new S(.5,.5)},direction:{value:new S(.5,.5)}},vertexShader:`varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}`,fragmentShader:`#include <common>
				varying vec2 vUv;
				uniform sampler2D colorTexture;
				uniform vec2 texSize;
				uniform vec2 direction;

				float gaussianPdf(in float x, in float sigma) {
					return 0.39894 * exp( -0.5 * x * x/( sigma * sigma))/sigma;
				}
				void main() {
					vec2 invSize = 1.0 / texSize;
					float fSigma = float(SIGMA);
					float weightSum = gaussianPdf(0.0, fSigma);
					vec3 diffuseSum = texture2D( colorTexture, vUv).rgb * weightSum;
					for( int i = 1; i < KERNEL_RADIUS; i ++ ) {
						float x = float(i);
						float w = gaussianPdf(x, fSigma);
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset).rgb;
						diffuseSum += (sample1 + sample2) * w;
						weightSum += 2.0 * w;
					}
					gl_FragColor = vec4(diffuseSum/weightSum, 1.0);
				}`})}getCompositeMaterial(t){return new k({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}B.BlurDirectionX=new S(1,0);B.BlurDirectionY=new S(0,1);const ge={options:{fps:60,debug:!0},name:"Hello",preload(){return{road_design:{type:"gltf",url:"/assets/threejs/models/road_design/scene.gltf"},van:{type:"gltf",url:"/assets/threejs/models/van/scene.gltf"},woodbox:{type:"texture",url:"/assets/threejs/textures/wood-box.png"},tire:{type:"texture",url:"/assets/threejs/textures/tire.jpg"}}},onCreate(){this.getData(),this.createMap(),this.createCar()},onUpdate(){this.getData()},createMap(){const x=this.getData();(()=>{x.scene.add(this.road_design);const t=3;this.road_design.scale.set(t,t,t),this.road_design.position.set(0,-30,0),x.physics.add.existing(this.road_design,{mass:0,shape:"concaveMesh"}),this.road_design.body.setFriction(.2)})(),(()=>{const t=new B(new S(window.innerWidth,window.innerHeight),1.5,.4,.85);t.threshold=0,t.strength=1,t.radius=.5,x.effectComposer.addPass(t)})()},createBoxes(){const x=this.getData();let t=3;Array(10).fill(null).map((b,c)=>c*t).forEach(b=>{Array(10).fill(null).map((c,h)=>h*t).forEach(c=>{const u=new Y({map:this.woodbox}),m=new X(new ue(1,1,1),u);m.position.set(b+-10,1,c+-10),x.scene.add(m),x.physics.add.existing(m,{mass:1})})})},createCar(){const x=this.getData(),{scene:t,physics:b}=x;t.add(this.car=new fe({game:x,x:0,y:5,z:0})),this.car.add(this.van)}},ye=Object.freeze(Object.defineProperty({__proto__:null,default:ge},Symbol.toStringTag,{value:"Module"}));export{he as C,pe as F,ce as P,ge as T,ye as a};
