import{C as i}from"./auto.ef733982.js";import{s as r,Q as c,j as p,o as l,f as d,e as u}from"./entry.b0df63e7.js";const f={style:{position:"relative"}},_={__name:"chartjs",props:{type:{type:[String],default:"bar"},data:{type:[Object],default:()=>({})},options:{type:[Object],default:()=>({})}},emits:["load"],setup(n,{emit:s}){const a=n,e=r(null);let t;return c(()=>{t=new i(e.value,{type:a.type,data:a.data,options:a.options}),s("chart",t)}),p([a],([o])=>{!e.value||!t||(t.options={...o.options},t.data={...o.data},t.options.animation=!1,t.options.transitions.active.animation.duration=0,t.update(),s("chart",t))}),(o,h)=>(l(),d("div",f,[u("canvas",{ref_key:"canvas",ref:e,style:{width:"100%",height:"100%"}},null,512)]))}};export{_ as default};
