import{a as k,e as x,r as e,o as n,c as l,w as t,b as V,f as d,h as _,i as r,j as c,k as W,t as S}from"./entry.ff785177.js";const C={props:{title:{type:String,default:""},drawerWidth:{type:String,default:"300"},containerWidth:{type:String,default:"1280px"}},data(){return{drawer:!0,useDisplay:x()}}},D={style:{height:"100vh",overflow:"auto"}};function N(a,s,o,B,i,U){const v=e("v-navigation-drawer"),m=e("v-app-bar-nav-icon"),y=e("v-toolbar-title"),u=e("v-container"),f=e("v-app-bar"),h=e("v-card-text"),w=e("v-card"),g=e("v-main"),b=e("v-app");return n(),l(b,null,{default:t(()=>[a.$slots.drawer?(n(),l(v,{key:0,width:o.drawerWidth,modelValue:i.drawer,"onUpdate:modelValue":s[0]||(s[0]=p=>i.drawer=p)},{default:t(()=>[V("div",D,[d(a.$slots,"drawer")])]),_:3},8,["width","modelValue"])):_("",!0),a.$slots.appbar||a.$slots.drawer||o.title?(n(),l(f,{key:1,elevation:"1"},{default:t(()=>[r(u,{class:"d-flex align-center",style:c({maxWidth:o.containerWidth})},{default:t(()=>[a.$slots.drawer?(n(),l(m,{key:0,class:"d-lg-none me-3",onClick:s[1]||(s[1]=p=>i.drawer=!0)})):_("",!0),o.title?(n(),l(y,{key:1},{default:t(()=>[W(S(o.title),1)]),_:1})):_("",!0),d(a.$slots,"appbar")]),_:3},8,["style"])]),_:3})):_("",!0),r(g,{class:"bg-grey-lighten-2",style:{height:"100vh",overflow:"auto"}},{default:t(()=>[r(u,{class:"pa-0 pa-lg-5 mx-auto",style:c([{maxWidth:o.containerWidth},{height:"100%",overflow:"auto"}])},{default:t(()=>[r(w,{style:c({height:i.useDisplay.lgAndUp?"auto":"100%"})},{default:t(()=>[r(h,null,{default:t(()=>[d(a.$slots,"default")]),_:3})]),_:3},8,["style"])]),_:3},8,["style"])]),_:3})]),_:3})}const j=k(C,[["render",N]]);export{j as _};
