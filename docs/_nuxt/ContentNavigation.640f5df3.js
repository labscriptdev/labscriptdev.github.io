import{q as v,h as m,e as f,j as l,u as d}from"./query.a536372d.js";import{k as _,_ as g,l as h,q as y,s as w,v as C,m as $,p as s}from"./entry.22a8e8e2.js";import{_ as N}from"./nuxt-link.2a47f02d.js";import{w as c,s as P,u as j,a as T}from"./utils.9e27dd46.js";import"./index.db33e430.js";import"./layout.7346e160.js";import"./index.bd96cc9d.js";import"./matter.d769dfd8.js";import"./index.47364c13.js";import"https://cdn.skypack.dev/dat.gui@0.7.9";import"./index.851079f3.js";import"./index.26d4e842.js";/* empty css                      */import"./index.17a7ea7e.js";import"./index.47281aed.js";import"./Bookapp.ab6c422f.js";import"./Calculator.266d9ea7.js";import"./info.1e4bb3a9.js";import"./info.66f5a8a6.js";import"./three.module.dfed9d41.js";import"./Pass.221ee647.js";import"./index.d5b42275.js";import"./info.20a792af.js";import"./info.bf93e9bf.js";import"./index.9a7344d2.js";import"./index.e8f328d0.js";import"./alert.c271abde.js";import"./index.d29a6c77.js";import"./index.50ebc147.js";import"./index.827bceb0.js";const x=async e=>{const{content:t}=_().public;typeof(e==null?void 0:e.params)!="function"&&(e=v(e));const a=e.params(),i=t.experimental.stripQueryParameters?c(`/navigation/${`${m(a)}.${t.integrity}`}/${f(a)}.json`):c(`/navigation/${m(a)}.${t.integrity}.json`);if(P())return(await g(()=>import("./client-db.014ac3e3.js"),["./client-db.014ac3e3.js","./entry.22a8e8e2.js","./entry.55be0524.css","./utils.9e27dd46.js","./index.17a7ea7e.js","./query.a536372d.js","./index.a6ef77ff.js"],import.meta.url).then(n=>n.generateNavigation))(a);const o=await $fetch(i,{method:"GET",responseType:"json",params:t.experimental.stripQueryParameters?void 0:{_params:l(a),previewToken:j("previewToken").value}});if(typeof o=="string"&&o.startsWith("<!DOCTYPE html>"))throw new Error("Not found");return o};const nt=h({name:"ContentNavigation",props:{query:{type:Object,required:!1,default:void 0}},async setup(e){const{query:t}=y(e),a=w(()=>{var o;return typeof((o=t.value)==null?void 0:o.params)=="function"?t.value.params():t.value});if(!a.value&&C("dd-navigation").value){const{navigation:o}=T();return{navigation:o}}const{data:i}=await d(`content-navigation-${m(a.value)}`,()=>x(a.value));return{navigation:i}},render(e){const t=$(),{navigation:a}=e,i=n=>s(N,{to:n._path},()=>n.title),o=(n,p)=>s("ul",p?{"data-level":p}:null,n.map(r=>r.children?s("li",null,[i(r),o(r.children,p+1)]):s("li",null,i(r)))),u=n=>o(n,0);return t!=null&&t.default?t.default({navigation:a,...this.$attrs}):u(a)}});export{nt as default};
