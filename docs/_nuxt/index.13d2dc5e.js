import{a as U,r as p,o as v,f as _,e as t,w as a,b as l,t as f,F as V,h as Y,s as A,n as B,g as N,i as y,x as H,y as O,z as $,c as C,m as k,j as P}from"./entry.032fc9ef.js";import{_ as L}from"./layout.9702cfe7.js";const Q={props:{modelValue:{type:[Boolean,String],default:!1},dates:{type:Array,default:()=>[]}},computed:{month:{set(r){},get(){const r=this.$dayjs(this.modelValue),e={};return e.date=r.format("YYYY-MM-DD"),e.year=r.format("YYYY"),e.month=r.format("MM"),e.day=r.format("DD"),e.monthName=r.format("MMMM"),e.daysInMonth=r.daysInMonth(),e.firstDay=r.startOf("month").day(),e.weekdays=this.$dayjs.weekdays().map(i=>i.substring(0,3)),e.days=(()=>{const i={id:null,day:null,dayName:null,dayAbbr:null,dates:[]};let u=[];for(let s=0;s<e.firstDay;s++)u.push({...i});for(let s=1;s<=e.daysInMonth;s++){const d=r.set("date",s);let m={...i};m.id=d.format(),m.date=d.format("YYYY-MM-DD"),m.day=d.format("DD"),m.dayName=this.$dayjs.weekdays()[d.day()],m.dayAbbr=m.dayName.substring(0,3),u.push(m)}return u=u.map(s=>(s.id&&(s.dates=this.dates.filter(d=>d.date.startsWith(s.date))),s)),((s,d)=>Array.from({length:Math.ceil(s.length/d)},(m,c)=>s.slice(c*d,c*d+d)))(u,7)})(),e}}},methods:{monthAdd(r){const e=this.$dayjs(this.modelValue).add(r,"month").format("YYYY-MM-DD");this.$emit("update:modelValue",e)},slotBind(r={}){return{modelValue:this.modelValue,...r}}}},G={class:"bg-primary"},J={colspan:"7",class:"pa-0"},K={class:"d-flex align-center pa-2 border"},X={class:"flex-grow-1 text-center text-uppercase",style:{"font-size":"16px","line-height":"20px","white-space":"nowrap","font-weight":"bold"}},Z={class:"text-center pa-0"};function ee(r,e,i,u,o,s){const d=p("v-btn"),m=p("v-table");return v(),_("div",null,[t(m,{class:"rounded"},{default:a(()=>[l("thead",null,[l("tr",G,[l("td",J,[l("div",K,[t(d,{flat:"",size:30,icon:"mdi-chevron-left",onClick:e[0]||(e[0]=c=>s.monthAdd(-1))}),l("div",X,f(s.month.year)+" "+f(s.month.monthName),1),t(d,{flat:"",size:30,icon:"mdi-chevron-right",onClick:e[1]||(e[1]=c=>s.monthAdd(1))})])])]),l("tr",null,[(v(!0),_(V,null,Y(s.month.weekdays,c=>(v(),_("th",{key:c,class:"text-center text-uppercase px-0 py-3"},f(c),1))),128))])]),l("tbody",null,[(v(!0),_(V,null,Y(s.month.days,c=>(v(),_("tr",null,[(v(!0),_(V,null,Y(c,h=>(v(),_("td",Z,[A(r.$slots,"day",B(N(s.slotBind(h))),()=>[t(d,{block:"",flat:"",size:35},{default:a(()=>[y(f(h.day),1)]),_:2},1024)])]))),256))]))),256))])]),_:3})])}const te=U(Q,[["render",ee]]),oe={computed:{results(){const{currencyFrom:r,currencyTo:e,amountPerHour:i,invoiceProviderServiceDescription:u,invoiceProviderFeeDescription:o,amountFeePercent:s}=this.useStorage,d=this.clockifyWorkspaceUserTimeEntriesReq.response.durationSeconds,m=d/60/60;let c=this.exchangeReq.response.filter(x=>x.value==e);c=c[0]?c[0].amount:1;const h=m*i,S=h*c,b=m*i*c,g=h*(s/100),T=g*c;return{currencyFrom:r,currencyTo:e,amountPerHour:i,durationSeconds:d,durationHours:m,currencyToAmount:c,amountTotal:b,amountTotalFrom:h,amountTotalFromFee:g,amountTotalTo:S,amountTotalToFee:T}}},methods:{useStorageDefault(){return{token:"",userId:"",amountPerHour:10,amountFeePercent:2,currencyFrom:"BRL",currencyTo:"BRL",invoiceContractorInfo:"",invoiceProviderInfo:"",invoiceProviderServiceDescription:"",invoiceProviderFeeDescription:""}},clockifyRouteChange(r,e){const i=this.$dayjs(r.query.date).format("YYYY-MM-01T00:00:00.000z");this.clockifyWorkspaceUserTimeEntriesReq.params.start=i;const u=this.$dayjs(r.query.date).endOf("month").format("YYYY-MM-DDT23:59:59.000z");this.clockifyWorkspaceUserTimeEntriesReq.params.end=u,this.clockifyWorkspaceUserTimeEntriesReq.submit()},clockifyUserTimeEntriesItemsCalendar(){let r=[];return this.clockifyWorkspaceUserTimeEntriesReq.response.items.forEach(e=>{r.push({date:e.timeInterval.start,...e})}),r},redirectQuery(r={}){r={...this.$route.query,...r},this.$router.push({...this.$route,query:r})},settingsCurrencyChange(){this.useStorage,this.exchangeReq.params.base=this.useStorage.currencyFrom}},data(){const r=H("clockify",this.useStorageDefault());return{breakpoints:O($),dateDefault:this.$dayjs().format("YYYY-MM-DD"),useStorage:r,exchangeReq:this.$request({autoSubmit:!0,url:"https://api.exchangerate.host/latest",params:{base:r.value.currencyFrom},response:[],onResponse:e=>(this.settingsCurrencyChange(),Object.keys(e.rates).map(u=>({title:`${u} ${e.rates[u]}`,value:u,amount:e.rates[u]})).sort((u,o)=>u.name<o.name?-1:u.name>o.name?1:0))}),clockifyWorkspacesReq:this.$request({autoSubmit:!0,url:"clockify://workspaces",response:[],onBeforeRequest:()=>{const{workspaceId:e}=this.$route.query;return e||!1}}),clockifyUserReq:this.$request({url:"clockify://user",onResponse:e=>(this.useStorage.userId=e.id,e)}),clockifyWorkspaceUserTimeEntriesReq:this.$request({autoSubmit:!0,url:()=>{const{workspaceId:e}=this.$route.query||{},{userId:i}=this.useStorage;return`clockify://workspaces/${e}/user/${i}/time-entries`},params:()=>{const e=this.$route.date||this.$dayjs().format();let i=this.$dayjs(e).format("YYYY-MM-01T00:00:00.000z"),u=this.$dayjs(e).endOf("month").format("YYYY-MM-DDT23:59:59.000z");return{start:i,end:u}},response:{durationSeconds:0,items:[]},onBeforeRequest:()=>{const{workspaceId:e}=this.$route.query||{},{userId:i}=this.useStorage;return e&&i},onResponse:e=>{let i=0;return e=e.map(u=>(u.timeInterval.durationSeconds=(()=>{if(!u.timeInterval.end)return 0;let o=this.$dayjs(u.timeInterval.start).diff(u.timeInterval.end);return Math.max(o,o*-1)/1e3})(),i+=u.timeInterval.durationSeconds,u)),{durationSeconds:i,items:e}}}),clockify:{workspace:{loading:!1,item:!1,items:[]},userTimeEntries:{loading:!1,total:{seconds:0,amount:0,currency:"BRL"},params:{start:"2022-11-30T00:00:00.000z",end:"2022-12-31T00:00:00.000z"},item:!1,items:[]}}}}},re={style:{overflow:"auto"}},se={class:"py-4"},ne={class:"text-h3"},le={class:"mx-auto",style:{width:"400px"}},ae=l("a",{href:"https://app.clockify.me/user/settings",target:"_blank"},"here",-1),ue={class:"mx-auto",style:{width:"800px"}},ie={class:"w-100"},de=l("colgroup",null,[l("col",{width:"*"}),l("col",{width:"200px"}),l("col",{width:"180px"})],-1),ce=l("thead",null,[l("tr",null,[l("th",{class:"text-left text-uppercase"},"Description"),l("th",{class:"text-left text-uppercase"},"Details"),l("th",{class:"text-left text-uppercase"},"Total")])],-1),me={class:"py-2"},pe=l("br",null,null,-1),fe={class:"py-2"},ye=l("br",null,null,-1);function ve(r,e,i,u,o,s){const d=p("v-tooltip"),m=te,c=p("v-progress-linear"),h=p("v-card-title"),S=p("v-divider"),b=p("v-btn"),g=p("v-text-field"),T=p("v-select"),x=p("v-card-text"),j=p("v-spacer"),E=p("v-card-actions"),w=p("v-card"),R=p("v-dialog"),D=p("v-col"),I=p("v-row"),M=p("v-textarea"),W=L;return v(),C(W,{title:"Clockify"},{drawer:a(()=>[t(h,null,{default:a(()=>[y("Clockify")]),_:1}),t(S),t(x,null,{default:a(()=>[t(R,{persistent:!0},{activator:a(({props:n})=>[t(b,k(n,{block:"",ref:"settingsBtn"}),{default:a(()=>[y("Configura\xE7\xF5es")]),_:2},1040)]),default:a(()=>[l("div",le,[t(w,null,{default:a(()=>[t(h,null,{default:a(()=>[y("Settings")]),_:1}),t(S),t(x,null,{default:a(()=>[y(" Get your access token "),ae,y(". "),t(g,{modelValue:o.useStorage.token,"onUpdate:modelValue":e[1]||(e[1]=n=>o.useStorage.token=n),label:"Clockify token",class:"mt-3",type:"password"},null,8,["modelValue"]),t(T,{modelValue:o.useStorage.currencyFrom,"onUpdate:modelValue":e[2]||(e[2]=n=>o.useStorage.currencyFrom=n),label:"Currency from",items:o.exchangeReq.response,"item-value":"value","item-title":"title","append-icon":"mdi-refresh","onClick:append":e[3]||(e[3]=n=>o.exchangeReq.submit()),loading:o.exchangeReq.loading},null,8,["modelValue","items","loading"]),t(T,{modelValue:o.useStorage.currencyTo,"onUpdate:modelValue":e[4]||(e[4]=n=>o.useStorage.currencyTo=n),label:"Currency to",items:o.exchangeReq.response,"item-value":"value","item-title":"title"},null,8,["modelValue","items"]),t(g,{modelValue:o.useStorage.amountPerHour,"onUpdate:modelValue":e[5]||(e[5]=n=>o.useStorage.amountPerHour=n),modelModifiers:{number:!0},label:"Amount per hour",type:"number",suffix:`${o.useStorage.currencyFrom} / Hour`},null,8,["modelValue","suffix"])]),_:1}),t(S),t(E,null,{default:a(()=>[t(b,{onClick:e[6]||(e[6]=n=>o.useStorage=s.useStorageDefault())},{default:a(()=>[y("Reset")]),_:1}),t(j),t(b,{onClick:e[7]||(e[7]=n=>{r.$refs.settingsBtn.$el.click(),o.clockifyWorkspacesReq.submit()})},{default:a(()=>[y("Ok")]),_:1})]),_:1})]),_:1})])]),_:1})]),_:1}),t(S),t(x,null,{default:a(()=>[t(I,null,{default:a(()=>[t(D,{cols:"12"},{default:a(()=>[t(T,{label:"Workspace","model-value":r.$route.query.workspaceId||null,items:o.clockifyWorkspacesReq.response,"item-value":"id","item-title":"name",loading:o.clockify.workspace.loading,"onUpdate:modelValue":e[8]||(e[8]=n=>s.redirectQuery({workspaceId:n})),"hide-details":!0},null,8,["model-value","items","loading"])]),_:1}),t(D,{cols:"12"},{default:a(()=>[t(w,null,{default:a(()=>[t(m,{"model-value":r.$route.query.date||o.dateDefault,"onUpdate:modelValue":e[9]||(e[9]=n=>s.redirectQuery({date:n}))},null,8,["model-value"])]),_:1})]),_:1}),t(D,{cols:"12"},{default:a(()=>[t(g,{label:"\xC0 receber","model-value":r.$filter.numberFormat(s.results.amountTotal),suffix:o.useStorage.currencyTo,readonly:""},null,8,["model-value","suffix"])]),_:1})]),_:1}),t(R,null,{activator:a(({props:n})=>[t(b,k(n,{block:""}),{default:a(()=>[y("Emiss\xE3o")]),_:2},1040)]),default:a(()=>[l("div",ue,[t(w,null,{default:a(()=>[t(h,null,{default:a(()=>[y("Invoice")]),_:1}),t(S),t(x,null,{default:a(()=>[t(I,null,{default:a(()=>[t(D,{cols:"12"},{default:a(()=>[t(M,k({modelValue:o.useStorage.invoiceContractorInfo,"onUpdate:modelValue":e[10]||(e[10]=n=>o.useStorage.invoiceContractorInfo=n)},{label:"Bill To",hideDetails:!0,variant:"outlined",autoGrow:!0,rows:1}),null,16,["modelValue"])]),_:1}),t(D,{cols:"12"},{default:a(()=>[t(M,k({modelValue:o.useStorage.invoiceProviderInfo,"onUpdate:modelValue":e[11]||(e[11]=n=>o.useStorage.invoiceProviderInfo=n)},{label:"Service provider",hideDetails:!0,variant:"outlined",autoGrow:!0,rows:1}),null,16,["modelValue"])]),_:1}),t(D,{cols:"12"},{default:a(()=>[l("table",ie,[de,ce,l("tbody",null,[l("tr",null,[l("td",null,[t(g,k({modelValue:o.useStorage.invoiceProviderServiceDescription,"onUpdate:modelValue":e[12]||(e[12]=n=>o.useStorage.invoiceProviderServiceDescription=n)},{hideDetails:!0,variant:"plain",density:"compact"}),null,16,["modelValue"])]),l("td",null,f(parseInt(s.results.durationHours))+" worked hours ",1),l("td",me,[y(f(r.$filter.numberFormat(s.results.amountTotalFrom))+" "+f(o.useStorage.currencyFrom)+" ",1),pe,y(" "+f(r.$filter.numberFormat(s.results.amountTotalTo))+" "+f(o.useStorage.currencyTo),1)])]),l("tr",null,[l("td",null,[t(g,k({modelValue:o.useStorage.invoiceProviderFeeDescription,"onUpdate:modelValue":e[13]||(e[13]=n=>o.useStorage.invoiceProviderFeeDescription=n)},{hideDetails:!0,variant:"plain",density:"compact"}),null,16,["modelValue"])]),l("td",null,[t(g,k({modelValue:o.useStorage.amountFeePercent,"onUpdate:modelValue":e[14]||(e[14]=n=>o.useStorage.amountFeePercent=n)},{hideDetails:!0,variant:"plain",density:"compact",type:"number",suffix:"%",class:"text-right"}),null,16,["modelValue"])]),l("td",fe,[y(f(r.$filter.numberFormat(s.results.amountTotalFromFee))+" "+f(o.useStorage.currencyFrom)+" ",1),ye,y(" "+f(r.$filter.numberFormat(s.results.amountTotalToFee))+" "+f(o.useStorage.currencyTo),1)])])])])]),_:1})]),_:1}),l("pre",null,f(s.results),1)]),_:1})]),_:1})])]),_:1})]),_:1})]),default:a(()=>[l("div",re,[t(m,{"model-value":r.$route.query.date||o.dateDefault,"onUpdate:modelValue":e[0]||(e[0]=n=>s.redirectQuery({date:n})),dates:s.clockifyUserTimeEntriesItemsCalendar(),style:{"min-width":"600px"}},{day:a(n=>[l("div",se,[l("div",ne,f(n.day),1),t(d,null,{activator:a(({props:F})=>[n.dates.length>0?(v(),_("div",B(k({key:0},F)),f((n.dates.map(q=>q.timeInterval.durationSeconds).reduce((q,z)=>q+z)/60/60).toFixed(1))+" hours ",17)):P("",!0)]),default:a(()=>[(v(!0),_(V,null,Y(n.dates,F=>(v(),_("div",null,f(F.description),1))),256))]),_:2},1024)])]),_:1},8,["model-value","dates"])]),o.clockifyWorkspaceUserTimeEntriesReq.loading?(v(),C(c,{key:0,indeterminate:""})):P("",!0)]),_:1})}const ge=U(oe,[["render",ve]]);export{ge as default};
