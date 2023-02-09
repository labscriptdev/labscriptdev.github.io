import{C as I,d as _,W as Q,U as j,S as z,V as k,h as ie,e as N,b as se,i as ae}from"./three.module.5769ac46.js";import{P as oe,C as le,F as ne}from"./Pass.d57df072.js";import"./matter.56b9995a.js";import ue from"./Car4.669dda00.js";import"./entry.8cff93e5.js";import"./extendedObject3D.e0709f57.js";var fe={exports:{}};(function(T){(function(t,x,c){if(!t)return;for(var h={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},u={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},m={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},y={option:"alt",command:"meta",return:"enter",escape:"esc",plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},p,M=1;M<20;++M)h[111+M]="f"+M;for(M=0;M<=9;++M)h[M+96]=M.toString();function P(e,r,s){if(e.addEventListener){e.addEventListener(r,s,!1);return}e.attachEvent("on"+r,s)}function b(e){if(e.type=="keypress"){var r=String.fromCharCode(e.which);return e.shiftKey||(r=r.toLowerCase()),r}return h[e.which]?h[e.which]:u[e.which]?u[e.which]:String.fromCharCode(e.which).toLowerCase()}function F(e,r){return e.sort().join(",")===r.sort().join(",")}function A(e){var r=[];return e.shiftKey&&r.push("shift"),e.altKey&&r.push("alt"),e.ctrlKey&&r.push("ctrl"),e.metaKey&&r.push("meta"),r}function G(e){if(e.preventDefault){e.preventDefault();return}e.returnValue=!1}function X(e){if(e.stopPropagation){e.stopPropagation();return}e.cancelBubble=!0}function R(e){return e=="shift"||e=="ctrl"||e=="alt"||e=="meta"}function Y(){if(!p){p={};for(var e in h)e>95&&e<112||h.hasOwnProperty(e)&&(p[h[e]]=e)}return p}function J(e,r,s){return s||(s=Y()[e]?"keydown":"keypress"),s=="keypress"&&r.length&&(s="keydown"),s}function Z(e){return e==="+"?["+"]:(e=e.replace(/\+{2}/g,"+plus"),e.split("+"))}function L(e,r){var s,d,w,U=[];for(s=Z(e),w=0;w<s.length;++w)d=s[w],y[d]&&(d=y[d]),r&&r!="keypress"&&m[d]&&(d=m[d],U.push("shift")),R(d)&&U.push(d);return r=J(d,U,r),{key:d,modifiers:U,action:r}}function q(e,r){return e===null||e===x?!1:e===r?!0:q(e.parentNode,r)}function v(e){var r=this;if(e=e||x,!(r instanceof v))return new v(e);r.target=e,r._callbacks={},r._directMap={};var s={},d,w=!1,U=!1,V=!1;function K(i){i=i||{};var o=!1,n;for(n in s){if(i[n]){o=!0;continue}s[n]=0}o||(V=!1)}function O(i,o,n,a,f,S){var l,g,B=[],C=n.type;if(!r._callbacks[i])return[];for(C=="keyup"&&R(i)&&(o=[i]),l=0;l<r._callbacks[i].length;++l)if(g=r._callbacks[i][l],!(!a&&g.seq&&s[g.seq]!=g.level)&&C==g.action&&(C=="keypress"&&!n.metaKey&&!n.ctrlKey||F(o,g.modifiers))){var te=!a&&g.combo==f,re=a&&g.seq==a&&g.level==S;(te||re)&&r._callbacks[i].splice(l,1),B.push(g)}return B}function E(i,o,n,a){r.stopCallback(o,o.target||o.srcElement,n,a)||i(o,n)===!1&&(G(o),X(o))}r._handleKey=function(i,o,n){var a=O(i,o,n),f,S={},l=0,g=!1;for(f=0;f<a.length;++f)a[f].seq&&(l=Math.max(l,a[f].level));for(f=0;f<a.length;++f){if(a[f].seq){if(a[f].level!=l)continue;g=!0,S[a[f].seq]=1,E(a[f].callback,n,a[f].combo,a[f].seq);continue}g||E(a[f].callback,n,a[f].combo)}var B=n.type=="keypress"&&U;n.type==V&&!R(i)&&!B&&K(S),U=g&&n.type=="keydown"};function H(i){typeof i.which!="number"&&(i.which=i.keyCode);var o=b(i);if(!!o){if(i.type=="keyup"&&w===o){w=!1;return}r.handleKey(o,A(i),i)}}function $(){clearTimeout(d),d=setTimeout(K,1e3)}function ee(i,o,n,a){s[i]=0;function f(C){return function(){V=C,++s[i],$()}}function S(C){E(n,C,i),a!=="keyup"&&(w=b(C)),setTimeout(K,10)}for(var l=0;l<o.length;++l){var g=l+1===o.length,B=g?S:f(a||L(o[l+1]).action);W(o[l],B,a,i,l)}}function W(i,o,n,a,f){r._directMap[i+":"+n]=o,i=i.replace(/\s+/g," ");var S=i.split(" "),l;if(S.length>1){ee(i,S,o,n);return}l=L(i,n),r._callbacks[l.key]=r._callbacks[l.key]||[],O(l.key,l.modifiers,{type:l.action},a,i,f),r._callbacks[l.key][a?"unshift":"push"]({callback:o,modifiers:l.modifiers,action:l.action,seq:a,level:f,combo:i})}r._bindMultiple=function(i,o,n){for(var a=0;a<i.length;++a)W(i[a],o,n)},P(e,"keypress",H),P(e,"keydown",H),P(e,"keyup",H)}v.prototype.bind=function(e,r,s){var d=this;return e=e instanceof Array?e:[e],d._bindMultiple.call(d,e,r,s),d},v.prototype.unbind=function(e,r){var s=this;return s.bind.call(s,e,function(){},r)},v.prototype.trigger=function(e,r){var s=this;return s._directMap[e+":"+r]&&s._directMap[e+":"+r]({},e),s},v.prototype.reset=function(){var e=this;return e._callbacks={},e._directMap={},e},v.prototype.stopCallback=function(e,r){var s=this;if((" "+r.className+" ").indexOf(" mousetrap ")>-1||q(r,s.target))return!1;if("composedPath"in e&&typeof e.composedPath=="function"){var d=e.composedPath()[0];d!==e.target&&(r=d)}return r.tagName=="INPUT"||r.tagName=="SELECT"||r.tagName=="TEXTAREA"||r.isContentEditable},v.prototype.handleKey=function(){var e=this;return e._handleKey.apply(e,arguments)},v.addKeycodes=function(e){for(var r in e)e.hasOwnProperty(r)&&(h[r]=e[r]);p=null},v.init=function(){var e=v(x);for(var r in e)r.charAt(0)!=="_"&&(v[r]=function(s){return function(){return e[s].apply(e,arguments)}}(r))},v.init(),t.Mousetrap=v,T.exports&&(T.exports=v),typeof c=="function"&&c.amd&&c(function(){return v})})(typeof window<"u"?window:null,typeof window<"u"?document:null)})(fe);const he={shaderID:"luminosityHighPass",uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new I(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class D extends oe{constructor(t,x,c,h){super(),this.strength=x!==void 0?x:1,this.radius=c,this.threshold=h,this.resolution=t!==void 0?new _(t.x,t.y):new _(256,256),this.clearColor=new I(0,0,0),this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let u=Math.round(this.resolution.x/2),m=Math.round(this.resolution.y/2);this.renderTargetBright=new Q(u,m),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let b=0;b<this.nMips;b++){const F=new Q(u,m);F.texture.name="UnrealBloomPass.h"+b,F.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(F);const A=new Q(u,m);A.texture.name="UnrealBloomPass.v"+b,A.texture.generateMipmaps=!1,this.renderTargetsVertical.push(A),u=Math.round(u/2),m=Math.round(m/2)}const y=he;this.highPassUniforms=j.clone(y.uniforms),this.highPassUniforms.luminosityThreshold.value=h,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new z({uniforms:this.highPassUniforms,vertexShader:y.vertexShader,fragmentShader:y.fragmentShader,defines:{}}),this.separableBlurMaterials=[];const p=[3,5,7,9,11];u=Math.round(this.resolution.x/2),m=Math.round(this.resolution.y/2);for(let b=0;b<this.nMips;b++)this.separableBlurMaterials.push(this.getSeperableBlurMaterial(p[b])),this.separableBlurMaterials[b].uniforms.texSize.value=new _(u,m),u=Math.round(u/2),m=Math.round(m/2);this.compositeMaterial=this.getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=x,this.compositeMaterial.uniforms.bloomRadius.value=.1,this.compositeMaterial.needsUpdate=!0;const M=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=M,this.bloomTintColors=[new k(1,1,1),new k(1,1,1),new k(1,1,1),new k(1,1,1),new k(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors;const P=le;this.copyUniforms=j.clone(P.uniforms),this.copyUniforms.opacity.value=1,this.materialCopy=new z({uniforms:this.copyUniforms,vertexShader:P.vertexShader,fragmentShader:P.fragmentShader,blending:ie,depthTest:!1,depthWrite:!1,transparent:!0}),this.enabled=!0,this.needsSwap=!1,this._oldClearColor=new I,this.oldClearAlpha=1,this.basic=new N,this.fsQuad=new ne(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.materialCopy.dispose(),this.basic.dispose(),this.fsQuad.dispose()}setSize(t,x){let c=Math.round(t/2),h=Math.round(x/2);this.renderTargetBright.setSize(c,h);for(let u=0;u<this.nMips;u++)this.renderTargetsHorizontal[u].setSize(c,h),this.renderTargetsVertical[u].setSize(c,h),this.separableBlurMaterials[u].uniforms.texSize.value=new _(c,h),c=Math.round(c/2),h=Math.round(h/2)}render(t,x,c,h,u){t.getClearColor(this._oldClearColor),this.oldClearAlpha=t.getClearAlpha();const m=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),u&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this.fsQuad.material=this.basic,this.basic.map=c.texture,t.setRenderTarget(null),t.clear(),this.fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=c.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this.fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this.fsQuad.render(t);let y=this.renderTargetBright;for(let p=0;p<this.nMips;p++)this.fsQuad.material=this.separableBlurMaterials[p],this.separableBlurMaterials[p].uniforms.colorTexture.value=y.texture,this.separableBlurMaterials[p].uniforms.direction.value=D.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[p]),t.clear(),this.fsQuad.render(t),this.separableBlurMaterials[p].uniforms.colorTexture.value=this.renderTargetsHorizontal[p].texture,this.separableBlurMaterials[p].uniforms.direction.value=D.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[p]),t.clear(),this.fsQuad.render(t),y=this.renderTargetsVertical[p];this.fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this.fsQuad.render(t),this.fsQuad.material=this.materialCopy,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,u&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this.fsQuad.render(t)):(t.setRenderTarget(c),this.fsQuad.render(t)),t.setClearColor(this._oldClearColor,this.oldClearAlpha),t.autoClear=m}getSeperableBlurMaterial(t){return new z({defines:{KERNEL_RADIUS:t,SIGMA:t},uniforms:{colorTexture:{value:null},texSize:{value:new _(.5,.5)},direction:{value:new _(.5,.5)}},vertexShader:`varying vec2 vUv;
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
				}`})}getCompositeMaterial(t){return new z({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`varying vec2 vUv;
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
				}`})}}D.BlurDirectionX=new _(1,0);D.BlurDirectionY=new _(0,1);const xe={options:{fps:60,debug:!0},name:"Hello",preload(){return{road_design:{type:"gltf",url:"/assets/threejs/models/road_design/scene.gltf"},van:{type:"gltf",url:"/assets/threejs/models/van/scene.gltf"},woodbox:{type:"texture",url:"/assets/threejs/textures/wood-box.png"},tire:{type:"texture",url:"/assets/threejs/textures/tire.jpg"}}},onCreate(){this.getData(),this.createMap(),this.createCar()},onUpdate(){this.getData()},createMap(){const T=this.getData();(()=>{T.scene.add(this.road_design);const t=3;this.road_design.scale.set(t,t,t),this.road_design.position.set(0,-30,0),T.physics.add.existing(this.road_design,{mass:0,shape:"concaveMesh"}),this.road_design.body.setFriction(.2)})(),(()=>{const t=new D(new _(window.innerWidth,window.innerHeight),1.5,.4,.85);t.threshold=0,t.strength=1,t.radius=.5,T.effectComposer.addPass(t)})()},createBoxes(){const T=this.getData();let t=3;Array(10).fill(null).map((x,c)=>c*t).forEach(x=>{Array(10).fill(null).map((c,h)=>h*t).forEach(c=>{const u=new N({map:this.woodbox}),m=new se(new ae(1,1,1),u);m.position.set(x+-10,1,c+-10),T.scene.add(m),T.physics.add.existing(m,{mass:1})})})},createCar(){const T=this.getData(),{scene:t,physics:x}=T;t.add(this.car=new ue({game:T,x:0,y:5,z:0})),this.car.add(this.van)}};export{xe as default};
