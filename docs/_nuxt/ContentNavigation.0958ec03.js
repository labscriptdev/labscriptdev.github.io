import{q as v,h as m,e as f,j as l,u as d}from"./query.c7e06364.js";import{k as _,_ as g,l as h,q as y,s as w,v as C,m as $,p as s}from"./entry.7d012809.js";import{_ as N}from"./nuxt-link.1a3e4238.js";import{w as c,s as P,u as j,a as T}from"./utils.94103a13.js";import"./index.d26acfbc.js";import"./layout.797cab92.js";import"./index.7aa657f3.js";import"./matter.114f7955.js";import"./index.d2717de7.js";import"./index.845803ca.js";/* empty css                      */import"./index.17a7ea7e.js";import"./index.c33f2778.js";import"./Bookapp.ab6c422f.js";import"./Calculator.266d9ea7.js";import"./info.1e4bb3a9.js";import"./info.66f5a8a6.js";import"./three.module.dfed9d41.js";import"./Pass.221ee647.js";import"./index.ecdd4a3e.js";import"./info.20a792af.js";import"./info.bf93e9bf.js";import"./index.54586ab1.js";import"./index.7b09ae50.js";import"./alert.c12384da.js";import"./index.f152c175.js";import"./index.a9e0ff9b.js";const x=async n=>{const{content:t}=_().public;typeof(n==null?void 0:n.params)!="function"&&(n=v(n));const a=n.params(),i=t.experimental.stripQueryParameters?c(`/navigation/${`${m(a)}.${t.integrity}`}/${f(a)}.json`):c(`/navigation/${m(a)}.${t.integrity}.json`);if(P())return(await g(()=>import("./client-db.f3192913.js"),["./client-db.f3192913.js","./entry.7d012809.js","./entry.55be0524.css","./utils.94103a13.js","./index.17a7ea7e.js","./query.c7e06364.js","./index.a6ef77ff.js"],import.meta.url).then(o=>o.generateNavigation))(a);const e=await $fetch(i,{method:"GET",responseType:"json",params:t.experimental.stripQueryParameters?void 0:{_params:l(a),previewToken:j("previewToken").value}});if(typeof e=="string"&&e.startsWith("<!DOCTYPE html>"))throw new Error("Not found");return e};const at=h({name:"ContentNavigation",props:{query:{type:Object,required:!1,default:void 0}},async setup(n){const{query:t}=y(n),a=w(()=>{var e;return typeof((e=t.value)==null?void 0:e.params)=="function"?t.value.params():t.value});if(!a.value&&C("dd-navigation").value){const{navigation:e}=T();return{navigation:e}}const{data:i}=await d(`content-navigation-${m(a.value)}`,()=>x(a.value));return{navigation:i}},render(n){const t=$(),{navigation:a}=n,i=o=>s(N,{to:o._path},()=>o.title),e=(o,p)=>s("ul",p?{"data-level":p}:null,o.map(r=>r.children?s("li",null,[i(r),e(r.children,p+1)]):s("li",null,i(r)))),u=o=>e(o,0);return t!=null&&t.default?t.default({navigation:a,...this.$attrs}):u(a)}});export{at as default};
