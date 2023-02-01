import T from"./dd.be331c7d.js";import{V as b,d as P,a as k,S as A,C as x,t as L,Q as R}from"./three.module.5769ac46.js";import{Y as z,o as Y,f as X,d as D,b as V,r as N}from"./entry.d6e52356.js";const Z=function(f,O){var e=this,o={NONE:-1,ROTATE:0,ZOOM:1,PAN:2,TOUCH_ROTATE:3,TOUCH_ZOOM:4,TOUCH_PAN:5};this.object=f,this.domElement=O!==void 0?O:document,this.enabled=!0,this.screen={left:0,top:0,width:0,height:0},this.rotateSpeed=1,this.zoomSpeed=1.2,this.panSpeed=.3,this.noRotate=!1,this.noZoom=!1,this.noPan=!1,this.noRoll=!1,this.staticMoving=!1,this.dynamicDampingFactor=.2,this.minDistance=0,this.maxDistance=1/0,this.keys=[65,83,68],this.target=new b;var u=new b,a=o.NONE,m=o.NONE,s=new b,d=new b,l=new b,g=new P,w=new P,_=0,E=0,v=new P,r=new P;this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.up0=this.object.up.clone();var h={type:"change"};function p(t){e.enabled!==!1&&(window.removeEventListener("keydown",p),m=a,a===o.NONE&&(t.keyCode!==e.keys[o.ROTATE]||e.noRotate?t.keyCode!==e.keys[o.ZOOM]||e.noZoom?t.keyCode!==e.keys[o.PAN]||e.noPan||(a=o.PAN):a=o.ZOOM:a=o.ROTATE))}function y(t){e.enabled===!1||(t.preventDefault(),t.stopPropagation(),a!==o.ROTATE||e.noRotate?a!==o.ZOOM||e.noZoom?a!==o.PAN||e.noPan||(r=e.getMouseOnScreen(t.clientX,t.clientY)):w=e.getMouseOnScreen(t.clientX,t.clientY):l=e.getMouseProjectionOnBall(t.clientX,t.clientY))}function M(t){e.enabled!==!1&&(t.preventDefault(),t.stopPropagation(),a=o.NONE,document.removeEventListener("mousemove",y),document.removeEventListener("mouseup",M))}function C(t){if(e.enabled!==!1){t.preventDefault(),t.stopPropagation();var n=0;t.wheelDelta?n=t.wheelDelta/40:t.detail&&(n=-t.detail/3),g.y+=.01*n}}this.handleResize=function(){this.domElement===document?(this.screen.left=0,this.screen.top=0,this.screen.width=window.innerWidth,this.screen.height=window.innerHeight):this.screen=this.domElement.getBoundingClientRect()},this.handleEvent=function(t){typeof this[t.type]=="function"&&this[t.type](t)},this.getMouseOnScreen=function(t,n){return new P((t-e.screen.left)/e.screen.width,(n-e.screen.top)/e.screen.height)},this.getMouseProjectionOnBall=function(t,n){var i=new b((t-.5*e.screen.width-e.screen.left)/(.5*e.screen.width),(.5*e.screen.height+e.screen.top-n)/(.5*e.screen.height),0),c=i.length();e.noRoll?c<Math.SQRT1_2?i.z=Math.sqrt(1-c*c):i.z=.5/c:c>1?i.normalize():i.z=Math.sqrt(1-c*c),s.copy(e.object.position).sub(e.target);var S=e.object.up.clone().setLength(i.y);return S.add(e.object.up.clone().cross(s).setLength(i.x)),S.add(s.setLength(i.z)),S},this.rotateCamera=function(){var t=Math.acos(d.dot(l)/d.length()/l.length());if(t){var n=new b().crossVectors(d,l).normalize(),i=new R;t*=e.rotateSpeed,i.setFromAxisAngle(n,-t),s.applyQuaternion(i),e.object.up.applyQuaternion(i),l.applyQuaternion(i),e.staticMoving?d.copy(l):(i.setFromAxisAngle(n,t*(e.dynamicDampingFactor-1)),d.applyQuaternion(i))}},this.zoomCamera=function(){if(a===o.TOUCH_ZOOM){var t=_/E;_=E,s.multiplyScalar(t)}else{var t=1+(w.y-g.y)*e.zoomSpeed;t!==1&&t>0&&(s.multiplyScalar(t),e.staticMoving?g.copy(w):g.y+=(w.y-g.y)*this.dynamicDampingFactor)}},this.panCamera=function(){var t=r.clone().sub(v);if(t.lengthSq()){t.multiplyScalar(s.length()*e.panSpeed);var n=s.clone().cross(e.object.up).setLength(t.x);n.add(e.object.up.clone().setLength(t.y)),e.object.position.add(n),e.target.add(n),e.staticMoving?v=r:v.add(t.subVectors(r,v).multiplyScalar(e.dynamicDampingFactor))}},this.checkDistances=function(){e.noZoom&&e.noPan||(s.lengthSq()>e.maxDistance*e.maxDistance&&e.object.position.addVectors(e.target,s.setLength(e.maxDistance)),s.lengthSq()<e.minDistance*e.minDistance&&e.object.position.addVectors(e.target,s.setLength(e.minDistance)))},this.update=function(){s.subVectors(e.object.position,e.target),e.noRotate||e.rotateCamera(),e.noZoom||e.zoomCamera(),e.noPan||e.panCamera(),e.object.position.addVectors(e.target,s),e.checkDistances(),e.object.lookAt(e.target),u.distanceToSquared(e.object.position)>0&&(e.dispatchEvent(h),u.copy(e.object.position))},this.reset=function(){a=o.NONE,m=o.NONE,e.target.copy(e.target0),e.object.position.copy(e.position0),e.object.up.copy(e.up0),s.subVectors(e.object.position,e.target),e.object.lookAt(e.target),e.dispatchEvent(h),u.copy(e.object.position)},this.domElement.addEventListener("contextmenu",function(t){t.preventDefault()},!1),this.domElement.addEventListener("mousedown",function(n){e.enabled!==!1&&(n.preventDefault(),n.stopPropagation(),a===o.NONE&&(a=n.button),a!==o.ROTATE||e.noRotate?a!==o.ZOOM||e.noZoom?a!==o.PAN||e.noPan||(v=e.getMouseOnScreen(n.clientX,n.clientY),r.copy(v)):(g=e.getMouseOnScreen(n.clientX,n.clientY),w.copy(g)):(d=e.getMouseProjectionOnBall(n.clientX,n.clientY),l.copy(d)),document.addEventListener("mousemove",y,!1),document.addEventListener("mouseup",M,!1))},!1),this.domElement.addEventListener("mousewheel",C,!1),this.domElement.addEventListener("DOMMouseScroll",C,!1),this.domElement.addEventListener("touchstart",function(n){if(e.enabled!==!1)switch(n.touches.length){case 1:a=o.TOUCH_ROTATE,d=l=e.getMouseProjectionOnBall(n.touches[0].pageX,n.touches[0].pageY);break;case 2:a=o.TOUCH_ZOOM;var i=n.touches[0].pageX-n.touches[1].pageX,c=n.touches[0].pageY-n.touches[1].pageY;E=_=Math.sqrt(i*i+c*c);break;case 3:a=o.TOUCH_PAN,v=r=e.getMouseOnScreen(n.touches[0].pageX,n.touches[0].pageY);break;default:a=o.NONE}},!1),this.domElement.addEventListener("touchend",function(n){if(e.enabled!==!1){switch(n.touches.length){case 1:d=l=e.getMouseProjectionOnBall(n.touches[0].pageX,n.touches[0].pageY);break;case 2:_=E=0;break;case 3:v=r=e.getMouseOnScreen(n.touches[0].pageX,n.touches[0].pageY)}a=o.NONE}},!1),this.domElement.addEventListener("touchmove",function(n){if(e.enabled!==!1)switch(n.preventDefault(),n.stopPropagation(),n.touches.length){case 1:l=e.getMouseProjectionOnBall(n.touches[0].pageX,n.touches[0].pageY);break;case 2:var i=n.touches[0].pageX-n.touches[1].pageX,c=n.touches[0].pageY-n.touches[1].pageY;E=Math.sqrt(i*i+c*c);break;case 3:r=e.getMouseOnScreen(n.touches[0].pageX,n.touches[0].pageY);break;default:a=o.NONE}},!1),window.addEventListener("keydown",p,!1),window.addEventListener("keyup",function(n){e.enabled!==!1&&(a=m,window.addEventListener("keydown",p,!1))},!1),this.handleResize()},B={data:()=>({game:{options:{fps:60,gridHelper:!0,orbitControls:!0},onCreate({scene:f,camera:O,effectComposer:e}){let o,u=640,a=360,m=null,s=0,d=.03,l={vertexColor:{type:"c",value:[]}},g={amplitude:{type:"f",value:.5}};const w=`
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
          `,_=`
            varying vec4 varColor;

            void main()
            {
            gl_FragColor = varColor;
            }
          `;o=new Z(O),o.rotateSpeed=1,o.zoomSpeed=1.2,o.panSpeed=.8,o.noZoom=!1,o.noPan=!0,o.staticMoving=!0,o.dynamicDampingFactor=.3;const E=()=>{const r=document.createElement("img"),h=document.createElement("canvas"),p=h.getContext("2d");r.crossOrigin="Anonymous",r.onload=function(){r.width=h.width=u,r.height=h.height=a,p.fillStyle=p.createPattern(r,"no-repeat"),p.fillRect(0,0,u,a),m=p.getImageData(0,0,u,a).data,v()},r.src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/tree_star.jpg"},v=()=>{let r=[.2126,.7152,.0722],h=0,p,y,M,C=400;p=new k,y=u*-.5,M=a*.5,new A({attributes:l,uniforms:g,vertexShader:w,fragmentShader:_});let t=[];for(var n=0;n<a;n++){for(var i=0;i<u;i++){var c=new x;c.setRGB(m[h]/255,m[h+1]/255,m[h+2]/255),l.vertexColor.value.push(c);var S=c.r*r[0]+c.g*r[1]+c.b*r[2],j=new b;j.x=y,j.y=M,j.z=C*-.5+C*S,t.push(y,M,C*-.5+C*S),h+=4,y++}y=u*-.5,M--}t=new Float32Array(t),p.setAttribute("position",new L(t,3))};E(),this.shaderUniforms=g,this.animationTime=s,this.animationDelta=d},onUpdate({}){const{shaderUniforms:f}=this;f.amplitude.value=Math.sin(this.animationTime),this.animationTime+=this.animationDelta}}})};function U(f,O,e,o,u,a){const m=N("threejs"),s=T,d=N("v-navigation-drawer");return Y(),X("div",null,[D(m,{modelValue:f.game,"onUpdate:modelValue":O[0]||(O[0]=l=>f.game=l)},null,8,["modelValue"]),D(d,{"model-value":!1,permanent:"",location:"end",width:"400px"},{default:V(()=>[D(s,{"model-value":f.game},null,8,["model-value"])]),_:1})])}const Q=z(B,[["render",U]]);export{Q as default};
