import{a as C,c as l,w as o,r as t,o as d,e,b as n,m as y,f as G,h as F,F as V,i as m,B as q}from"./entry.032fc9ef.js";const z={methods:{itemsFilter(){let i=this.filter.toLowerCase();return this.items.filter(r=>JSON.stringify(r).toLowerCase().includes(i))}},data:()=>({filter:"",items:[{id:"bookapp",name:"Gerador app bookmark",description:"Gere aplica\xE7\xF5es que rodam diretamente da barra de favoritos",icon:"mdi-bookmark-plus-outline"},{id:"calcdiv",name:"Calculadora de gastos",description:"Calculadora de gastos com divis\xE3o por pessoas e tempo de uso",icon:"mdi-calculator"},{id:"clockify",name:"Clockify",description:"Gerenciamento e c\xE1lculo de horas trabalhadas utilizando o app Clockify",icon:"mdi-alarm-check"},{id:"diff",name:"Ferramenta diff",description:"Compara\xE7\xE3o de c\xF3digos, textos e afins",icon:"mdi-set-left"},{id:"filesize-generator",name:"Gerador de arquivo",description:"Aplica\xE7\xE3o para gerar arquivos com tamanhos exatos",icon:"mdi-file-download-outline"},{id:"laramake",name:"Gerador Laravel",description:"Criar arquivos para o frameworl Laravel baseado em estrutura de banco de dados",icon:"mdi-laravel"},{id:"map",name:"Mapa",description:"Visualizador de mapa",icon:"mdi-map-search"},{id:"lotto",name:"Loteria",description:"Aplica\xE7\xE3o de simula\xE7\xE3o lot\xE9rica",icon:"mdi-slot-machine"},{id:"qrcode",name:"QR Code",description:"Gerador dos principais tipos de QRcode",icon:"mdi-qrcode"},{id:"text",name:"Ferramentas de texto",description:"Conversores, analisadores e ferramentas \xFAteis para gerencimento de texto",icon:"mdi-text-box-edit-outline"},{id:"whatsapp",name:"Gerador link whatsapp",description:"Gerar link para whatsapp de maneira r\xE1pida e f\xE1cil",icon:"mdi-whatsapp"}]})},L={style:{position:"fixed",bottom:"30px",right:"30px","z-index":"999!important"}},$={class:"mb-4",style:{width:"350px","max-width":"90vh"}},B={style:{"max-height":"calc(70vh - 70px)",overflow:"auto"}},N=n("span",{class:"ms-3"},"Current page source",-1),A=n("span",{class:"ms-3"},"Home",-1);function Q(i,r,R,E,H,p){const u=q,_=t("v-text-field"),f=t("v-divider"),v=t("v-list-item"),h=t("v-list"),c=t("v-icon"),s=t("v-btn"),b=t("v-card"),x=t("v-img"),g=t("v-avatar"),k=t("v-menu"),w=t("v-layout");return d(),l(w,{class:"bg-grey-lighten-3"},{default:o(()=>[e(u),n("div",L,[e(k,{"close-on-content-click":!1},{activator:o(({props:a})=>[e(s,y(a,{icon:"",size:"55",flat:""}),{default:o(()=>[e(g,{size:"50"},{default:o(()=>[e(x,{src:"/assets/labscript.dev.png"})]),_:1})]),_:2},1040)]),default:o(()=>[n("div",$,[e(b,null,{default:o(()=>[e(_,{modelValue:i.filter,"onUpdate:modelValue":r[0]||(r[0]=a=>i.filter=a),label:"Filtro","hide-details":!0,class:"ma-2"},null,8,["modelValue"]),e(f),n("div",B,[e(h,{lines:"two"},{default:o(()=>[(d(!0),G(V,null,F(p.itemsFilter(),a=>(d(),l(v,{key:a.id,title:a.name,subtitle:a.description,"prepend-icon":a.icon,to:`/tool/${a.id}`},null,8,["title","subtitle","prepend-icon","to"]))),128))]),_:1})]),e(s,{block:"",href:`https://github.com/labscriptdev/labscriptdev.github.io/tree/main/docs${i.$route.path}/`,target:"_blank",color:"primary",rounded:"0"},{default:o(()=>[e(c,null,{default:o(()=>[m("mdi-xml")]),_:1}),N]),_:1},8,["href"]),e(s,{block:"",to:"/",rounded:"0"},{default:o(()=>[e(c,null,{default:o(()=>[m("mdi-home")]),_:1}),A]),_:1})]),_:1})])]),_:1})])]),_:1})}const M=C(z,[["render",Q]]);export{M as default};