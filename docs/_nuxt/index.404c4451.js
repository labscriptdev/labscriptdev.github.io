import{_ as x}from"./alert.62ced17a.js";import{a as C,k as h,i as s,F as i,j as _,e as k,w as d,o,b as a,t as u,c as y,m as v,f as $,r as w}from"./entry.372e8bf0.js";const V={methods:{colorClasses(){let l=[];for(let e of["primary","black","grey","red","pink","purple","deep-purple","indigo","blue","light-blue","teal","green","light-green","lime","yellow","amber","orange","deep-orange","brown","blue-grey","grey"]){l.push({bg:`bg-${e}`,text:`text-${e}`});for(let n of["lighten","darken","accent"])for(let p of[1,2,3,4,5])l.push({bg:`bg-${e}-${n}-${p}`,text:`text-${e}-${n}-${p}`})}return l}},data(){return{useClipboard:h()}}},B={class:"text-uppercase font-weight-bold py-2"},N={class:"d-flex flex-wrap"},T=["onClick"];function F(l,e,n,p,r,g){const b=w("v-tooltip"),f=x;return o(),s("div",null,[(o(),s(i,null,_([{name:"Background",field:"bg"},{name:"Text",field:"text"}],t=>(o(),s(i,null,[a("div",B,u(t.name),1),a("div",N,[(o(!0),s(i,null,_(g.colorClasses(),c=>(o(),y(b,null,{activator:d(({props:m})=>[a("div",v(m,{class:[c[t.field],"text-center","border"],style:{width:"calc(100% / 16)",padding:"5px"},onClick:j=>r.useClipboard.copy(c.bg)})," text ",16,T)]),default:d(()=>[a("pre",null,u(c[t.field]),1)]),_:2},1024))),256))])],64))),64)),k(f,{modelValue:r.useClipboard.copied,"onUpdate:modelValue":e[0]||(e[0]=t=>r.useClipboard.copied=t),type:"snackbar",color:"success"},{default:d(()=>[$(" Texto copiado: "+u(r.useClipboard.text),1)]),_:1},8,["modelValue"])])}const L=C(V,[["render",F]]);export{L as default};
