import{p as J,d as v,s as Q,D as M,a as X,S as Z,b as F,c as I}from"./styles-bbc3fe3b.02ef0a31.js";import{G as tt}from"./layout.25ce95d5.js";import{l as d,c as y,h as $,z as ot,i as et,j as R}from"./index.96e3a88f.js";import{r as st}from"./index-67a42d7d.9fe2d622.js";import"./entry.0189ed9e.js";import"./index.d303d62d.js";import"./index.9cc14a29.js";import"./index.8f458cba.js";import"./lodash.67058706.js";import"./index.b0a9e9ca.js";import"./Bookapp.ab6c422f.js";import"./Calculator.266d9ea7.js";import"./index.8ea68dcc.js";import"./info.054acc3a.js";import"./info.ecb60be2.js";import"./info.1e4bb3a9.js";import"./info.3c1f35c2.js";import"./three.module.6da1ccc8.js";import"./matter.0784338f.js";import"./scene-gltf.dd4c21b7.js";import"./index.db90a3a7.js";import"./index.201a4cf5.js";import"./index.9c534be6.js";import"./index.50817f22.js";import"./index.bfe62a77.js";import"./index.a94b224e.js";import"./index.37def1ab.js";import"./index.6f4f4209.js";import"./___vite-browser-external.ddb602f7.js";import"./index.79671135.js";import"./index.f27542d7.js";import"./index.5ad92b19.js";import"./index.b93cb02f.js";import"./index.da8ff2dd.js";import"./index.5737bb14.js";import"./info.72a08ec4.js";import"./info.bfb3dcff.js";import"./info.78333159.js";import"./info.72d8a16d.js";import"./info.71ed9620.js";import"./info.a88b74e6.js";import"./alert.3ece98ef.js";import"./index.817f95cd.js";import"https://cdn.skypack.dev/dat.gui@0.7.9";import"./index.2b7590c5.js";import"./edges-80f1ebb6.bdf6d3b6.js";import"./createText-aebacdfe.85945a61.js";import"./line.836e2e1e.js";import"./array.9f3ba611.js";import"./path.53f90ab3.js";const h="rect",x="rectWithTitle",it="start",nt="end",rt="divider",ct="roundedWithTitle",lt="note",at="noteGroup",_="statediagram",pt="state",dt=`${_}-${pt}`,H="transition",Et="note",St="note-edge",Tt=`${H} ${St}`,_t=`${_}-${Et}`,ut="cluster",Dt=`${_}-${ut}`,bt="cluster-alt",ft=`${_}-${bt}`,U="parent",V="note",At="state",G="----",ht=`${G}${V}`,B=`${G}${U}`,Y="fill:none",z="fill: #333",W="c",j="text",q="normal";let m={},p=0;const mt=function(t){const i=Object.keys(t);for(const o of i)t[o]},yt=function(t,i){return i.db.extract(i.db.getRootDocV2()),i.db.getClasses()};function gt(t){return t==null?"":t.classes?t.classes.join(" "):""}function C(t="",i=0,o="",n=G){const r=o!==null&&o.length>0?`${n}${o}`:"";return`${At}-${t}${r}-${i}`}const A=(t,i,o,n,r,c)=>{const e=o.id,u=gt(n[e]);if(e!=="root"){let S=h;o.start===!0&&(S=it),o.start===!1&&(S=nt),o.type!==M&&(S=o.type),m[e]||(m[e]={id:e,shape:S,description:R.sanitizeText(e,y()),classes:`${u} ${dt}`});const s=m[e];o.description&&(Array.isArray(s.description)?(s.shape=x,s.description.push(o.description)):s.description.length>0?(s.shape=x,s.description===e?s.description=[o.description]:s.description=[s.description,o.description]):(s.shape=h,s.description=o.description),s.description=R.sanitizeTextOrArray(s.description,y())),s.description.length===1&&s.shape===x&&(s.shape=h),!s.type&&o.doc&&(d.info("Setting cluster for ",e,w(o)),s.type="group",s.dir=w(o),s.shape=o.type===X?rt:ct,s.classes=s.classes+" "+Dt+" "+(c?ft:""));const T={labelStyle:"",shape:s.shape,labelText:s.description,classes:s.classes,style:"",id:e,dir:s.dir,domId:C(e,p),type:s.type,padding:15};if(T.centerLabel=!0,o.note){const l={labelStyle:"",shape:lt,labelText:o.note.text,classes:_t,style:"",id:e+ht+"-"+p,domId:C(e,p,V),type:s.type,padding:15},a={labelStyle:"",shape:at,labelText:o.note.text,classes:s.classes,style:"",id:e+B,domId:C(e,p,U),type:"group",padding:0};p++;const D=e+B;t.setNode(D,a),t.setNode(l.id,l),t.setNode(e,T),t.setParent(e,D),t.setParent(l.id,D);let E=e,b=l.id;o.note.position==="left of"&&(E=l.id,b=e),t.setEdge(E,b,{arrowhead:"none",arrowType:"",style:Y,labelStyle:"",classes:Tt,arrowheadStyle:z,labelpos:W,labelType:j,thickness:q})}else t.setNode(e,T)}i&&i.id!=="root"&&(d.trace("Setting node ",e," to be child of its parent ",i.id),t.setParent(e,i.id)),o.doc&&(d.trace("Adding nodes children "),$t(t,o,o.doc,n,r,!c))},$t=(t,i,o,n,r,c)=>{d.trace("items",o),o.forEach(e=>{switch(e.stmt){case F:A(t,i,e,n,r,c);break;case M:A(t,i,e,n,r,c);break;case Z:{A(t,i,e.state1,n,r,c),A(t,i,e.state2,n,r,c);const u={id:"edge"+p,arrowhead:"normal",arrowTypeEnd:"arrow_barb",style:Y,labelStyle:"",label:R.sanitizeText(e.description,y()),arrowheadStyle:z,labelpos:W,labelType:j,thickness:q,classes:H};t.setEdge(e.state1.id,e.state2.id,u,p),p++}break}})},w=(t,i=I)=>{let o=i;if(t.doc)for(let n=0;n<t.doc.length;n++){const r=t.doc[n];r.stmt==="dir"&&(o=r.value)}return o},xt=async function(t,i,o,n){d.info("Drawing state diagram (v2)",i),m={},n.db.getDirection();const{securityLevel:r,state:c}=y(),e=c.nodeSpacing||50,u=c.rankSpacing||50;d.info(n.db.getRootDocV2()),n.db.extract(n.db.getRootDocV2()),d.info(n.db.getRootDocV2());const S=n.db.getStates(),s=new tt({multigraph:!0,compound:!0}).setGraph({rankdir:w(n.db.getRootDocV2()),nodesep:e,ranksep:u,marginx:8,marginy:8}).setDefaultEdgeLabel(function(){return{}});A(s,void 0,n.db.getRootDocV2(),S,n.db,!0);let T;r==="sandbox"&&(T=$("#i"+i));const l=r==="sandbox"?$(T.nodes()[0].contentDocument.body):$("body"),a=l.select(`[id="${i}"]`),D=l.select("#"+i+" g");await st(D,s,["barb"],_,i);const E=8;ot.insertTitle(a,"statediagramTitleText",c.titleTopMargin,n.db.getDiagramTitle());const b=a.node().getBBox(),N=b.width+E*2,L=b.height+E*2;a.attr("class",_);const P=a.node().getBBox();et(a,L,N,c.useMaxWidth);const O=`${P.x-E} ${P.y-E} ${N} ${L}`;d.debug(`viewBox ${O}`),a.attr("viewBox",O);const K=document.querySelectorAll('[id="'+i+'"] .edgeLabel .label');for(const g of K){const k=g.getBBox(),f=document.createElementNS("http://www.w3.org/2000/svg",h);f.setAttribute("rx",0),f.setAttribute("ry",0),f.setAttribute("width",k.width),f.setAttribute("height",k.height),g.insertBefore(f,g.firstChild)}},Ct={setConf:mt,getClasses:yt,draw:xt},$o={parser:J,db:v,renderer:Ct,styles:Q,init:t=>{t.state||(t.state={}),t.state.arrowMarkerAbsolute=t.arrowMarkerAbsolute,v.clear()}};export{$o as diagram};
