import{_ as y}from"./layout.29f5f7d6.js";import b from"./Calculator.1e470761.js";import{a as x,c as k,w as a,o as n,f as t,e as l,b as o,v as _,F as i,t as r,r as d}from"./entry.2e2a74d8.js";const U={mounted(){this.calculator.demo()},data(){return{calculator:new b}},computed:{result(){return this.calculator.result()}}},w=l("thead",null,[l("tr",null,[l("th",null,"Pessoa")])],-1),B=l("thead",null,[l("tr",null,[l("th",null,"Item"),l("th",null,"Valor")])],-1),C=l("thead",null,[l("tr",null,[l("th",null,"Pessoa"),l("th",null,"Total")])],-1);function g(h,F,N,P,p,f){const s=d("v-text-field"),c=d("v-table"),m=d("v-col"),V=d("v-row"),v=y;return n(),k(v,null,{default:a(()=>[t(V,null,{default:a(()=>[t(m,{cols:"4"},{default:a(()=>[t(c,null,{default:a(()=>[w,l("tbody",null,[(n(!0),o(i,null,_(p.calculator.users,e=>(n(),o("tr",{key:e.id},[l("td",null,[t(s,{modelValue:e.name,"onUpdate:modelValue":u=>e.name=u,"hide-details":!0,variant:"plain"},null,8,["modelValue","onUpdate:modelValue"])])]))),128))])]),_:1})]),_:1}),t(m,{cols:"4"},{default:a(()=>[t(c,null,{default:a(()=>[B,l("tbody",null,[(n(!0),o(i,null,_(p.calculator.spends,e=>(n(),o("tr",{key:e.id},[l("td",null,[t(s,{modelValue:e.name,"onUpdate:modelValue":u=>e.name=u,"hide-details":!0,variant:"plain"},null,8,["modelValue","onUpdate:modelValue"])]),l("td",null,[t(s,{modelValue:e.amount,"onUpdate:modelValue":u=>e.amount=u,modelModifiers:{number:!0},"hide-details":!0,variant:"plain"},null,8,["modelValue","onUpdate:modelValue"])])]))),128))])]),_:1})]),_:1}),t(m,{cols:"4"},{default:a(()=>[t(c,null,{default:a(()=>[C,l("tbody",null,[(n(!0),o(i,null,_(f.result.users,e=>(n(),o("tr",{key:e.id},[l("td",null,r(e.name),1),l("td",null,r(e.amount),1)]))),128))])]),_:1})]),_:1})]),_:1}),l("pre",null,"result: "+r(f.result),1),l("pre",null,"$data: "+r(h.$data),1)]),_:1})}const I=x(U,[["render",g]]);export{I as default};
