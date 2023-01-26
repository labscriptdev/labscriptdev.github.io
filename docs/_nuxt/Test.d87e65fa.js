import{M as J,d as Q,g as W}from"./three.module.2ad6d296.js";import"./matter.88d35005.js";import Z from"./Car4.9f17f71e.js";import"./entry.5d33167f.js";var $={exports:{}};(function(p){(function(h,w,_){if(!h)return;for(var d={8:"backspace",9:"tab",13:"enter",16:"shift",17:"ctrl",18:"alt",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"ins",46:"del",91:"meta",93:"meta",224:"meta"},C={106:"*",107:"+",109:"-",110:".",111:"/",186:";",187:"=",188:",",189:"-",190:".",191:"/",192:"`",219:"[",220:"\\",221:"]",222:"'"},k={"~":"`","!":"1","@":"2","#":"3",$:"4","%":"5","^":"6","&":"7","*":"8","(":"9",")":"0",_:"-","+":"=",":":";",'"':"'","<":",",">":".","?":"/","|":"\\"},q={option:"alt",command:"meta",return:"enter",escape:"esc",plus:"+",mod:/Mac|iPod|iPhone|iPad/.test(navigator.platform)?"meta":"ctrl"},b,v=1;v<20;++v)d[111+v]="f"+v;for(v=0;v<=9;++v)d[v+96]=v.toString();function K(e,t,n){if(e.addEventListener){e.addEventListener(t,n,!1);return}e.attachEvent("on"+t,n)}function D(e){if(e.type=="keypress"){var t=String.fromCharCode(e.which);return e.shiftKey||(t=t.toLowerCase()),t}return d[e.which]?d[e.which]:C[e.which]?C[e.which]:String.fromCharCode(e.which).toLowerCase()}function O(e,t){return e.sort().join(",")===t.sort().join(",")}function R(e){var t=[];return e.shiftKey&&t.push("shift"),e.altKey&&t.push("alt"),e.ctrlKey&&t.push("ctrl"),e.metaKey&&t.push("meta"),t}function j(e){if(e.preventDefault){e.preventDefault();return}e.returnValue=!1}function H(e){if(e.stopPropagation){e.stopPropagation();return}e.cancelBubble=!0}function P(e){return e=="shift"||e=="ctrl"||e=="alt"||e=="meta"}function N(){if(!b){b={};for(var e in d)e>95&&e<112||d.hasOwnProperty(e)&&(b[d[e]]=e)}return b}function U(e,t,n){return n||(n=N()[e]?"keydown":"keypress"),n=="keypress"&&t.length&&(n="keydown"),n}function V(e){return e==="+"?["+"]:(e=e.replace(/\+{2}/g,"+plus"),e.split("+"))}function L(e,t){var n,u,g,M=[];for(n=V(e),g=0;g<n.length;++g)u=n[g],q[u]&&(u=q[u]),t&&t!="keypress"&&k[u]&&(u=k[u],M.push("shift")),P(u)&&M.push(u);return t=U(u,M,t),{key:u,modifiers:M,action:t}}function B(e,t){return e===null||e===w?!1:e===t?!0:B(e.parentNode,t)}function c(e){var t=this;if(e=e||w,!(t instanceof c))return new c(e);t.target=e,t._callbacks={},t._directMap={};var n={},u,g=!1,M=!1,S=!1;function A(r){r=r||{};var a=!1,f;for(f in n){if(r[f]){a=!0;continue}n[f]=0}a||(S=!1)}function I(r,a,f,s,o,y){var i,l,x=[],m=f.type;if(!t._callbacks[r])return[];for(m=="keyup"&&P(r)&&(a=[r]),i=0;i<t._callbacks[r].length;++i)if(l=t._callbacks[r][i],!(!s&&l.seq&&n[l.seq]!=l.level)&&m==l.action&&(m=="keypress"&&!f.metaKey&&!f.ctrlKey||O(a,l.modifiers))){var X=!s&&l.combo==o,Y=s&&l.seq==s&&l.level==y;(X||Y)&&t._callbacks[r].splice(i,1),x.push(l)}return x}function E(r,a,f,s){t.stopCallback(a,a.target||a.srcElement,f,s)||r(a,f)===!1&&(j(a),H(a))}t._handleKey=function(r,a,f){var s=I(r,a,f),o,y={},i=0,l=!1;for(o=0;o<s.length;++o)s[o].seq&&(i=Math.max(i,s[o].level));for(o=0;o<s.length;++o){if(s[o].seq){if(s[o].level!=i)continue;l=!0,y[s[o].seq]=1,E(s[o].callback,f,s[o].combo,s[o].seq);continue}l||E(s[o].callback,f,s[o].combo)}var x=f.type=="keypress"&&M;f.type==S&&!P(r)&&!x&&A(y),M=l&&f.type=="keydown"};function T(r){typeof r.which!="number"&&(r.which=r.keyCode);var a=D(r);if(!!a){if(r.type=="keyup"&&g===a){g=!1;return}t.handleKey(a,R(r),r)}}function z(){clearTimeout(u),u=setTimeout(A,1e3)}function G(r,a,f,s){n[r]=0;function o(m){return function(){S=m,++n[r],z()}}function y(m){E(f,m,r),s!=="keyup"&&(g=D(m)),setTimeout(A,10)}for(var i=0;i<a.length;++i){var l=i+1===a.length,x=l?y:o(s||L(a[i+1]).action);F(a[i],x,s,r,i)}}function F(r,a,f,s,o){t._directMap[r+":"+f]=a,r=r.replace(/\s+/g," ");var y=r.split(" "),i;if(y.length>1){G(r,y,a,f);return}i=L(r,f),t._callbacks[i.key]=t._callbacks[i.key]||[],I(i.key,i.modifiers,{type:i.action},s,r,o),t._callbacks[i.key][s?"unshift":"push"]({callback:a,modifiers:i.modifiers,action:i.action,seq:s,level:o,combo:r})}t._bindMultiple=function(r,a,f){for(var s=0;s<r.length;++s)F(r[s],a,f)},K(e,"keypress",T),K(e,"keydown",T),K(e,"keyup",T)}c.prototype.bind=function(e,t,n){var u=this;return e=e instanceof Array?e:[e],u._bindMultiple.call(u,e,t,n),u},c.prototype.unbind=function(e,t){var n=this;return n.bind.call(n,e,function(){},t)},c.prototype.trigger=function(e,t){var n=this;return n._directMap[e+":"+t]&&n._directMap[e+":"+t]({},e),n},c.prototype.reset=function(){var e=this;return e._callbacks={},e._directMap={},e},c.prototype.stopCallback=function(e,t){var n=this;if((" "+t.className+" ").indexOf(" mousetrap ")>-1||B(t,n.target))return!1;if("composedPath"in e&&typeof e.composedPath=="function"){var u=e.composedPath()[0];u!==e.target&&(t=u)}return t.tagName=="INPUT"||t.tagName=="SELECT"||t.tagName=="TEXTAREA"||t.isContentEditable},c.prototype.handleKey=function(){var e=this;return e._handleKey.apply(e,arguments)},c.addKeycodes=function(e){for(var t in e)e.hasOwnProperty(t)&&(d[t]=e[t]);b=null},c.init=function(){var e=c(w);for(var t in e)t.charAt(0)!=="_"&&(c[t]=function(n){return function(){return e[n].apply(e,arguments)}}(t))},c.init(),h.Mousetrap=c,p.exports&&(p.exports=c),typeof _=="function"&&_.amd&&_(function(){return c})})(typeof window<"u"?window:null,typeof window<"u"?document:null)})($);const se={options:{fps:60,debug:!0},name:"Hello",preload(){return{city:{type:"gltf",url:"/assets/threejs/models/city/scene.gltf"},woodbox:{type:"texture",url:"/assets/threejs/textures/wood-box.png"},tire:{type:"texture",url:"/assets/threejs/textures/tire.jpg"}}},onCreate(){this.getData(),this.createMap(),this.createCar()},onUpdate(){this.getData()},createMap(){const p=this.getData();(()=>{p.scene.add(this.city);const h=40;this.city.scale.set(h,h,h),this.city.position.set(1100,-20,1100),p.physics.add.existing(this.city,{mass:0,shape:"concaveMesh"}),this.city.body.setFriction(1)})()},createBoxes(){const p=this.getData();let h=3;Array(10).fill(null).map((w,_)=>_*h).forEach(w=>{Array(10).fill(null).map((_,d)=>d*h).forEach(_=>{const C=new J({map:this.woodbox}),k=new Q(new W(1,1,1),C);k.position.set(w+-10,1,_+-10),p.scene.add(k),p.physics.add.existing(k,{mass:1})})})},createCar(){const p=this.getData(),{scene:h,physics:w}=p;h.add(this.car=new Z({game:p,x:5,y:0,z:15}))}};export{se as default};