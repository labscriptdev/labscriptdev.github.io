import{Y as d,o as r,c as s,b as o,d as _,f,j as g,F as v,$ as x,r as i}from"./entry.d6e52356.js";import b from"./layout.e8416da9.js";import $ from"./index.3f493ce0.js";import B from"./index.e8e8ceec.js";/* empty css                                               */const h={meta:{active:!1,icon:"mdi-globe",name:"Base",description:"Base file structure"},data(){return{pages:(()=>{let a=Object.entries(Object.assign({"./index/index.vue":$,"./index/page-1/index.vue":B}));return console.clear(),a.filter(([t,e])=>!!e.meta).map(([t,e])=>({slug:e.__file.split("/").at(-2).replace(/^index$/g,""),icon:"mdi-circle",name:"Default",active:!1,order:0,...e.meta||{}})).sort((t,e)=>t.order<e.order?-1:t.order>e.order?1:0)})()}}};function k(a,t,e,j,l,w){const c=x,p=i("v-list-item"),m=i("v-list"),u=b;return r(),s(u,null,{drawer:o(()=>[_(m,null,{default:o(()=>[(r(!0),f(v,null,g(l.pages,n=>(r(),s(p,{key:n.slug,title:n.name,"prepend-icon":n.icon,to:`/lab/base/${n.slug}`},null,8,["title","prepend-icon","to"]))),128))]),_:1})]),default:o(()=>[_(c)]),_:1})}const E=d(h,[["render",k]]);export{E as default};
