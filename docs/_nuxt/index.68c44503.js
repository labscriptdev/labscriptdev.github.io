const l=/\d/,a=["-","_","/","."];function h(e=""){if(!l.test(e))return e.toUpperCase()===e}function C(e,i){const c=i!=null?i:a,n=[];if(!e||typeof e!="string")return n;let t="",u,o;for(const p of e){const r=c.includes(p);if(r===!0){n.push(t),t="",u=void 0;continue}const s=h(p);if(o===!1){if(u===!1&&s===!0){n.push(t),t=p,u=s;continue}if(u===!0&&s===!1&&t.length>1){const f=t[t.length-1];n.push(t.slice(0,Math.max(0,t.length-1))),t=f+p,u=s;continue}}t+=p,u=s,o=r}return n.push(t),n}function U(e){return e?e[0].toUpperCase()+e.slice(1):""}function R(e){return e?(Array.isArray(e)?e:C(e)).map(i=>U(i)).join(""):""}export{R as p};