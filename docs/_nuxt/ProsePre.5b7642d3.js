import{_ as l}from"./ProseCode.vue.60d8a5e9.js";import{N as n,o as s,c as i,w as o,a as r,A as u,z as g,y as c}from"./entry.0189ed9e.js";const y=n({__name:"ProsePre",props:{code:{type:String,default:""},language:{type:String,default:null},filename:{type:String,default:null},highlights:{type:Array,default:()=>[]},meta:{type:String,default:null},class:{type:String,default:null},style:{type:[String,Object],default:null}},setup(e){return(t,d)=>{const a=l;return s(),i(a,{code:e.code,language:e.language,filename:e.filename,highlights:e.highlights,meta:e.meta},{default:o(()=>[r("pre",{class:u(t.$props.class),style:g(e.style)},[c(t.$slots,"default")],6)]),_:3},8,["code","language","filename","highlights","meta"])}}});export{y as default};