import s from"./ContentSlot.bfdc4c3e.js";import{P as o,bg as m,D as p,a4 as u}from"./entry.1b06c984.js";import"./utils.21695a8f.js";import"./index.17a7ea7e.js";const d=o({name:"Markdown",extends:s,setup(t){const{parent:e}=u(),{between:n,default:a}=m(),r=p(()=>typeof t.unwrap=="string"?t.unwrap.split(" "):["*"]);return{fallbackSlot:a,tags:r,between:n,parent:e}}});export{d as default};