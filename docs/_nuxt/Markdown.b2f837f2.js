import s from"./ContentSlot.8fcb03ca.js";import{l as o,m,G as u,z as f}from"./entry.2acc98e4.js";import"./utils.db063473.js";const l=o({name:"Markdown",extends:s,setup(t){const{parent:e}=f(),{between:n,default:a}=m(),r=u(()=>typeof t.unwrap=="string"?t.unwrap.split(" "):["*"]);return{fallbackSlot:a,tags:r,between:n,parent:e}}});export{l as default};