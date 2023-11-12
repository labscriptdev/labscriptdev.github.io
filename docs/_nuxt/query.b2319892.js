import{bR as F,aN as D,a_ as L,b5 as U,av as H,aF as v,bq as M,bF as N,ba as I,bS as q,a3 as K,bQ as j,bB as Q}from"./entry.76f46d94.js";import{a as W,j as G,b as J}from"./index.17a7ea7e.js";import{w as k,s as V,u as X}from"./utils.63d1dce8.js";function wt(...n){var S;const s=typeof n[n.length-1]=="string"?n.pop():void 0;typeof n[0]!="string"&&n.unshift(s);let[r,e,t={}]=n;if(typeof r!="string")throw new TypeError("[nuxt] [asyncData] key must be a string.");if(typeof e!="function")throw new TypeError("[nuxt] [asyncData] handler must be a function.");const a=N(),i=()=>null,u=()=>a.isHydrating?a.payload.data[r]:a.static.data[r];t.server=t.server??!0,t.default=t.default??i,t.getCachedData=t.getCachedData??u,t.lazy=t.lazy??!1,t.immediate=t.immediate??!0,t.deep=t.deep??F.deep;const o=()=>![null,void 0].includes(t.getCachedData(r));if(!a._asyncData[r]||!t.immediate){(S=a.payload._errors)[r]??(S[r]=null);const h=t.deep?D:L;a._asyncData[r]={data:h(t.getCachedData(r)??t.default()),pending:D(!o()),error:U(a.payload._errors,r),status:D("idle")}}const c={...a._asyncData[r]};c.refresh=c.execute=(h={})=>{if(a._asyncDataPromises[r]){if(h.dedupe===!1)return a._asyncDataPromises[r];a._asyncDataPromises[r].cancelled=!0}if((h._initial||a.isHydrating&&h._initial!==!1)&&o())return Promise.resolve(t.getCachedData(r));c.pending.value=!0,c.status.value="pending";const _=new Promise((l,y)=>{try{l(e(a))}catch(x){y(x)}}).then(l=>{if(_.cancelled)return a._asyncDataPromises[r];let y=l;t.transform&&(y=t.transform(l)),t.pick&&(y=Y(y,t.pick)),c.data.value=y,c.error.value=null,c.status.value="success"}).catch(l=>{if(_.cancelled)return a._asyncDataPromises[r];c.error.value=l,c.data.value=I(t.default()),c.status.value="error"}).finally(()=>{_.cancelled||(c.pending.value=!1,a.payload.data[r]=c.data.value,c.error.value&&(a.payload._errors[r]=q(c.error.value)),delete a._asyncDataPromises[r])});return a._asyncDataPromises[r]=_,a._asyncDataPromises[r]};const f=()=>c.refresh({_initial:!0}),d=t.server!==!1&&a.payload.serverRendered;{const h=K();if(h&&!h._nuxtOnBeforeMountCbs){h._nuxtOnBeforeMountCbs=[];const l=h._nuxtOnBeforeMountCbs;h&&(H(()=>{l.forEach(y=>{y()}),l.splice(0,l.length)}),v(()=>l.splice(0,l.length)))}d&&a.isHydrating&&(c.error.value||o())?(c.pending.value=!1,c.status.value=c.error.value?"error":"success"):h&&(a.payload.serverRendered&&a.isHydrating||t.lazy)&&t.immediate?h._nuxtOnBeforeMountCbs.push(f):t.immediate&&f(),t.watch&&M(t.watch,()=>c.refresh());const _=a.hook("app:data:refresh",async l=>{(!l||l.includes(r))&&await c.refresh()});h&&v(_)}const p=Promise.resolve(a._asyncDataPromises[r]).then(()=>c);return Object.assign(p,c),p}function Y(n,s){const r={};for(const e of s)r[e]=n[e];return r}const Z={ignoreUnknown:!1,respectType:!1,respectFunctionNames:!1,respectFunctionProperties:!1,unorderedObjects:!0,unorderedArrays:!1,unorderedSets:!1};function tt(n,s={}){s={...Z,...s};const r=A(s);return r.dispatch(n),r.toString()}function A(n){const s=[];let r=[];const e=t=>{s.push(t)};return{toString(){return s.join("")},getContext(){return r},dispatch(t){return n.replacer&&(t=n.replacer(t)),this["_"+(t===null?"null":typeof t)](t)},_object(t){const a=/\[object (.*)]/i,i=Object.prototype.toString.call(t),u=a.exec(i),o=u?u[1].toLowerCase():"unknown:["+i.toLowerCase()+"]";let c=null;if((c=r.indexOf(t))>=0)return this.dispatch("[CIRCULAR:"+c+"]");if(r.push(t),typeof Buffer<"u"&&Buffer.isBuffer&&Buffer.isBuffer(t))return e("buffer:"),e(t.toString("utf8"));if(o!=="object"&&o!=="function"&&o!=="asyncfunction")if(this["_"+o])this["_"+o](t);else{if(n.ignoreUnknown)return e("["+o+"]");throw new Error('Unknown object type "'+o+'"')}else{let f=Object.keys(t);n.unorderedObjects&&(f=f.sort()),n.respectType!==!1&&!C(t)&&f.splice(0,0,"prototype","__proto__","letructor"),n.excludeKeys&&(f=f.filter(function(d){return!n.excludeKeys(d)})),e("object:"+f.length+":");for(const d of f)this.dispatch(d),e(":"),n.excludeValues||this.dispatch(t[d]),e(",")}},_array(t,a){if(a=typeof a<"u"?a:n.unorderedArrays!==!1,e("array:"+t.length+":"),!a||t.length<=1){for(const o of t)this.dispatch(o);return}const i=[],u=t.map(o=>{const c=A(n);return c.dispatch(o),i.push(c.getContext()),c.toString()});return r=[...r,...i],u.sort(),this._array(u,!1)},_date(t){return e("date:"+t.toJSON())},_symbol(t){return e("symbol:"+t.toString())},_error(t){return e("error:"+t.toString())},_boolean(t){return e("bool:"+t.toString())},_string(t){e("string:"+t.length+":"),e(t.toString())},_function(t){e("fn:"),C(t)?this.dispatch("[native]"):this.dispatch(t.toString()),n.respectFunctionNames!==!1&&this.dispatch("function-name:"+String(t.name)),n.respectFunctionProperties&&this._object(t)},_number(t){return e("number:"+t.toString())},_xml(t){return e("xml:"+t.toString())},_null(){return e("Null")},_undefined(){return e("Undefined")},_regexp(t){return e("regex:"+t.toString())},_uint8array(t){return e("uint8array:"),this.dispatch(Array.prototype.slice.call(t))},_uint8clampedarray(t){return e("uint8clampedarray:"),this.dispatch(Array.prototype.slice.call(t))},_int8array(t){return e("int8array:"),this.dispatch(Array.prototype.slice.call(t))},_uint16array(t){return e("uint16array:"),this.dispatch(Array.prototype.slice.call(t))},_int16array(t){return e("int16array:"),this.dispatch(Array.prototype.slice.call(t))},_uint32array(t){return e("uint32array:"),this.dispatch(Array.prototype.slice.call(t))},_int32array(t){return e("int32array:"),this.dispatch(Array.prototype.slice.call(t))},_float32array(t){return e("float32array:"),this.dispatch(Array.prototype.slice.call(t))},_float64array(t){return e("float64array:"),this.dispatch(Array.prototype.slice.call(t))},_arraybuffer(t){return e("arraybuffer:"),this.dispatch(new Uint8Array(t))},_url(t){return e("url:"+t.toString())},_map(t){e("map:");const a=[...t];return this._array(a,n.unorderedSets!==!1)},_set(t){e("set:");const a=[...t];return this._array(a,n.unorderedSets!==!1)},_file(t){return e("file:"),this.dispatch([t.name,t.size,t.type,t.lastModfied])},_blob(){if(n.ignoreUnknown)return e("[blob]");throw new Error(`Hashing Blob objects is currently not supported
Use "options.replacer" or "options.ignoreUnknown"
`)},_domwindow(){return e("domwindow")},_bigint(t){return e("bigint:"+t.toString())},_process(){return e("process")},_timer(){return e("timer")},_pipe(){return e("pipe")},_tcp(){return e("tcp")},_udp(){return e("udp")},_tty(){return e("tty")},_statwatcher(){return e("statwatcher")},_securecontext(){return e("securecontext")},_connection(){return e("connection")},_zlib(){return e("zlib")},_context(){return e("context")},_nodescript(){return e("nodescript")},_httpparser(){return e("httpparser")},_dataview(){return e("dataview")},_signal(){return e("signal")},_fsevent(){return e("fsevent")},_tlswrap(){return e("tlswrap")}}}function C(n){return typeof n!="function"?!1:/^function\s+\w*\s*\(\s*\)\s*{\s+\[native code]\s+}$/i.exec(Function.prototype.toString.call(n))!=null}class w{constructor(s,r){s=this.words=s||[],this.sigBytes=r!==void 0?r:s.length*4}toString(s){return(s||et).stringify(this)}concat(s){if(this.clamp(),this.sigBytes%4)for(let r=0;r<s.sigBytes;r++){const e=s.words[r>>>2]>>>24-r%4*8&255;this.words[this.sigBytes+r>>>2]|=e<<24-(this.sigBytes+r)%4*8}else for(let r=0;r<s.sigBytes;r+=4)this.words[this.sigBytes+r>>>2]=s.words[r>>>2];return this.sigBytes+=s.sigBytes,this}clamp(){this.words[this.sigBytes>>>2]&=4294967295<<32-this.sigBytes%4*8,this.words.length=Math.ceil(this.sigBytes/4)}clone(){return new w([...this.words])}}const et={stringify(n){const s=[];for(let r=0;r<n.sigBytes;r++){const e=n.words[r>>>2]>>>24-r%4*8&255;s.push((e>>>4).toString(16),(e&15).toString(16))}return s.join("")}},rt={stringify(n){const s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",r=[];for(let e=0;e<n.sigBytes;e+=3){const t=n.words[e>>>2]>>>24-e%4*8&255,a=n.words[e+1>>>2]>>>24-(e+1)%4*8&255,i=n.words[e+2>>>2]>>>24-(e+2)%4*8&255,u=t<<16|a<<8|i;for(let o=0;o<4&&e*8+o*6<n.sigBytes*8;o++)r.push(s.charAt(u>>>6*(3-o)&63))}return r.join("")}},st={parse(n){const s=n.length,r=[];for(let e=0;e<s;e++)r[e>>>2]|=(n.charCodeAt(e)&255)<<24-e%4*8;return new w(r,s)}},nt={parse(n){return st.parse(unescape(encodeURIComponent(n)))}};class at{constructor(){this._minBufferSize=0,this.blockSize=512/32,this.reset()}reset(){this._data=new w,this._nDataBytes=0}_append(s){typeof s=="string"&&(s=nt.parse(s)),this._data.concat(s),this._nDataBytes+=s.sigBytes}_doProcessBlock(s,r){}_process(s){let r,e=this._data.sigBytes/(this.blockSize*4);s?e=Math.ceil(e):e=Math.max((e|0)-this._minBufferSize,0);const t=e*this.blockSize,a=Math.min(t*4,this._data.sigBytes);if(t){for(let i=0;i<t;i+=this.blockSize)this._doProcessBlock(this._data.words,i);r=this._data.words.splice(0,t),this._data.sigBytes-=a}return new w(r,a)}}class it extends at{update(s){return this._append(s),this._process(),this}finalize(s){s&&this._append(s)}}const ot=[1779033703,-1150833019,1013904242,-1521486534,1359893119,-1694144372,528734635,1541459225],ct=[1116352408,1899447441,-1245643825,-373957723,961987163,1508970993,-1841331548,-1424204075,-670586216,310598401,607225278,1426881987,1925078388,-2132889090,-1680079193,-1046744716,-459576895,-272742522,264347078,604807628,770255983,1249150122,1555081692,1996064986,-1740746414,-1473132947,-1341970488,-1084653625,-958395405,-710438585,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,-2117940946,-1838011259,-1564481375,-1474664885,-1035236496,-949202525,-778901479,-694614492,-200395387,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,-2067236844,-1933114872,-1866530822,-1538233109,-1090935817,-965641998],g=[];class ut extends it{constructor(){super(),this.reset()}reset(){super.reset(),this._hash=new w([...ot])}_doProcessBlock(s,r){const e=this._hash.words;let t=e[0],a=e[1],i=e[2],u=e[3],o=e[4],c=e[5],f=e[6],d=e[7];for(let p=0;p<64;p++){if(p<16)g[p]=s[r+p]|0;else{const b=g[p-15],z=(b<<25|b>>>7)^(b<<14|b>>>18)^b>>>3,B=g[p-2],T=(B<<15|B>>>17)^(B<<13|B>>>19)^B>>>10;g[p]=z+g[p-7]+T+g[p-16]}const S=o&c^~o&f,h=t&a^t&i^a&i,_=(t<<30|t>>>2)^(t<<19|t>>>13)^(t<<10|t>>>22),l=(o<<26|o>>>6)^(o<<21|o>>>11)^(o<<7|o>>>25),y=d+l+S+ct[p]+g[p],x=_+h;d=f,f=c,c=o,o=u+y|0,u=i,i=a,a=t,t=y+x|0}e[0]=e[0]+t|0,e[1]=e[1]+a|0,e[2]=e[2]+i|0,e[3]=e[3]+u|0,e[4]=e[4]+o|0,e[5]=e[5]+c|0,e[6]=e[6]+f|0,e[7]=e[7]+d|0}finalize(s){super.finalize(s);const r=this._nDataBytes*8,e=this._data.sigBytes*8;return this._data.words[e>>>5]|=128<<24-e%32,this._data.words[(e+64>>>9<<4)+14]=Math.floor(r/4294967296),this._data.words[(e+64>>>9<<4)+15]=r,this._data.sigBytes=this._data.words.length*4,this._process(),this._hash}}function lt(n){return new ut().finalize(n).toString(rt)}function P(n,s={}){const r=typeof n=="string"?n:tt(n,s);return lt(r).slice(0,10)}const O=(n,s)=>s.split(".").reduce((r,e)=>r&&r[e],n),$=(n,s)=>Object.keys(n).filter(s).reduce((r,e)=>Object.assign(r,{[e]:n[e]}),{}),bt=n=>s=>Array.isArray(s)?s.map(r=>n(r)):n(s),E=n=>{const s=[],r=[];for(const e of n)["$","_"].includes(e)?s.push(e):r.push(e);return{prefixes:s,properties:r}},Bt=(n=[])=>s=>{if(n.length===0||!s)return s;const{prefixes:r,properties:e}=E(n);return $(s,t=>!e.includes(t)&&!r.includes(t[0]))},St=(n=[])=>s=>{if(n.length===0||!s)return s;const{prefixes:r,properties:e}=E(n);return $(s,t=>e.includes(t)||r.includes(t[0]))},xt=(n,s)=>{const r=new Intl.Collator(s.$locale,{numeric:s.$numeric,caseFirst:s.$caseFirst,sensitivity:s.$sensitivity}),e=Object.keys(s).filter(t=>!t.startsWith("$"));for(const t of e)n=n.sort((a,i)=>{const u=[O(a,t),O(i,t)].map(o=>{if(o!==null)return o instanceof Date?o.toISOString():o});return s[t]===-1&&u.reverse(),r.compare(u[0],u[1])});return n},Dt=(n,s="Expected an array")=>{if(!Array.isArray(n))throw new TypeError(s)},m=n=>Array.isArray(n)?n:n?[n]:[],ft=["sort","where","only","without"],ht=(n,s)=>{const r={...s};for(const a of ft)r[a]&&(r[a]=m(r[a]));const e=(a,i=u=>u)=>(...u)=>(r[a]=i(...u),t),t={params:()=>r,only:e("only",m),without:e("without",m),where:e("where",a=>[...m(r.where),a]),sort:e("sort",a=>[...m(r.sort),...m(a)]),limit:e("limit",a=>parseInt(String(a),10)),skip:e("skip",a=>parseInt(String(a),10)),find:()=>n(t),findOne:()=>(r.first=!0,n(t)),findSurround:(a,i)=>(r.surround={query:a,...i},n(t)),locale:a=>t.where({_locale:a})};return t};function R(n){return JSON.stringify(n,pt)}function pt(n,s){return s instanceof RegExp?`--REGEX ${s.toString()}`:s}const dt=n=>{let s=R(n);return s=typeof Buffer<"u"?Buffer.from(s).toString("base64"):btoa(s),s=s.replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,""),(s.match(/.{1,100}/g)||[]).join("/")},yt=()=>async n=>{const{content:s}=j().public,r=n.params(),e=s.experimental.stripQueryParameters?k(`/query/${`${P(r)}.${s.integrity}`}/${dt(r)}.json`):k(`/query/${P(r)}.${s.integrity}.json`);if(V())return(await Q(()=>import("./client-db.a012afa5.js"),["./client-db.a012afa5.js","./index.9b0bef9c.js","./entry.76f46d94.js","./entry.93d7b642.css","./utils.63d1dce8.js","./index.17a7ea7e.js"],import.meta.url).then(i=>i.useContentDatabase())).fetch(n);const t=await $fetch(e,{method:"GET",responseType:"json",params:s.experimental.stripQueryParameters?void 0:{_params:R(r),previewToken:X("previewToken").value}});if(typeof t=="string"&&t.startsWith("<!DOCTYPE html>"))throw new Error("Not found");return t};function vt(n,...s){const{content:r}=j().public,e=ht(yt(),typeof n!="string"?n:{});let t;typeof n=="string"&&(t=W(G(n,...s)));const a=e.params;return e.params=()=>{var u,o,c;const i=a();return t&&(i.where=i.where||[],i.first&&(i.where||[]).length===0?i.where.push({_path:J(t)}):i.where.push({_path:new RegExp(`^${t.replace(/[-[\]{}()*+.,^$\s/]/g,"\\$&")}`)})),(u=i.sort)!=null&&u.length||(i.sort=[{_file:1,$numeric:!0}]),r.locales.length&&((c=(o=i.where)==null?void 0:o.find(d=>d._locale))!=null&&c._locale||(i.where=i.where||[],i.where.push({_locale:r.defaultLocale}))),i},e}export{Dt as a,m as b,bt as c,St as d,dt as e,ht as f,O as g,P as h,R as j,vt as q,xt as s,wt as u,Bt as w};