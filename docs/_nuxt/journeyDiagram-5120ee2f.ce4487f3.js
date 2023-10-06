import{c as V,x as gt,y as mt,s as xt,g as _t,b as kt,a as bt,e as vt,A as wt,i as H,j as Tt}from"./index.995ab903.js";import{d as $t,f as St,a as Mt,g as ct}from"./svgDrawCommon-f26cad39.d4359a0b.js";import{a as it}from"./arc.df9bde1e.js";import"./entry.2c083d03.js";import"./index.c7a941bd.js";import"./index.d0e39486.js";import"./index.91336184.js";import"./index.0d90c395.js";import"./Bookapp.ab6c422f.js";import"./Calculator.266d9ea7.js";import"./index.6b466124.js";import"./info.1e4bb3a9.js";import"./info.66f5a8a6.js";import"./three.module.8fae685a.js";import"./matter.fde04bf7.js";import"./scene-gltf.a0ddc4a0.js";import"./index.80f58acf.js";import"./index.3a61fd70.js";import"./index.7a326989.js";import"./index.b8d1a0b3.js";import"./index.7b5b2137.js";import"./index.697a8e40.js";import"./index.eacdf2b6.js";import"./___vite-browser-external.8f066153.js";import"./index.c7eca150.js";import"./index.67a65277.js";import"./index.990633ad.js";import"./info.72a08ec4.js";import"./info.bfb3dcff.js";import"./info.78333159.js";import"./info.72d8a16d.js";import"./info.71ed9620.js";import"./info.a88b74e6.js";import"./alert.0618cca2.js";import"./index.d278d699.js";import"https://cdn.skypack.dev/dat.gui@0.7.9";import"./index.dab0189b.js";import"./path.53f90ab3.js";var Z=function(){var t=function(_,s,a,h){for(a=a||{},h=_.length;h--;a[_[h]]=s);return a},e=[1,2],r=[1,5],n=[6,9,11,17,18,20,22,23,24,26],i=[1,15],l=[1,16],o=[1,17],p=[1,18],u=[1,19],x=[1,20],g=[1,24],f=[4,6,9,11,17,18,20,22,23,24,26],y={trace:function(){},yy:{},symbols_:{error:2,start:3,journey:4,document:5,EOF:6,directive:7,line:8,SPACE:9,statement:10,NEWLINE:11,openDirective:12,typeDirective:13,closeDirective:14,":":15,argDirective:16,title:17,acc_title:18,acc_title_value:19,acc_descr:20,acc_descr_value:21,acc_descr_multiline_value:22,section:23,taskName:24,taskData:25,open_directive:26,type_directive:27,arg_directive:28,close_directive:29,$accept:0,$end:1},terminals_:{2:"error",4:"journey",6:"EOF",9:"SPACE",11:"NEWLINE",15:":",17:"title",18:"acc_title",19:"acc_title_value",20:"acc_descr",21:"acc_descr_value",22:"acc_descr_multiline_value",23:"section",24:"taskName",25:"taskData",26:"open_directive",27:"type_directive",28:"arg_directive",29:"close_directive"},productions_:[0,[3,3],[3,2],[5,0],[5,2],[8,2],[8,1],[8,1],[8,1],[7,4],[7,6],[10,1],[10,2],[10,2],[10,1],[10,1],[10,2],[10,1],[12,1],[13,1],[16,1],[14,1]],performAction:function(s,a,h,d,m,c,R){var k=c.length-1;switch(m){case 1:return c[k-1];case 3:this.$=[];break;case 4:c[k-1].push(c[k]),this.$=c[k-1];break;case 5:case 6:this.$=c[k];break;case 7:case 8:this.$=[];break;case 11:d.setDiagramTitle(c[k].substr(6)),this.$=c[k].substr(6);break;case 12:this.$=c[k].trim(),d.setAccTitle(this.$);break;case 13:case 14:this.$=c[k].trim(),d.setAccDescription(this.$);break;case 15:d.addSection(c[k].substr(8)),this.$=c[k].substr(8);break;case 16:d.addTask(c[k-1],c[k]),this.$="task";break;case 18:d.parseDirective("%%{","open_directive");break;case 19:d.parseDirective(c[k],"type_directive");break;case 20:c[k]=c[k].trim().replace(/'/g,'"'),d.parseDirective(c[k],"arg_directive");break;case 21:d.parseDirective("}%%","close_directive","journey");break}},table:[{3:1,4:e,7:3,12:4,26:r},{1:[3]},t(n,[2,3],{5:6}),{3:7,4:e,7:3,12:4,26:r},{13:8,27:[1,9]},{27:[2,18]},{6:[1,10],7:21,8:11,9:[1,12],10:13,11:[1,14],12:4,17:i,18:l,20:o,22:p,23:u,24:x,26:r},{1:[2,2]},{14:22,15:[1,23],29:g},t([15,29],[2,19]),t(n,[2,8],{1:[2,1]}),t(n,[2,4]),{7:21,10:25,12:4,17:i,18:l,20:o,22:p,23:u,24:x,26:r},t(n,[2,6]),t(n,[2,7]),t(n,[2,11]),{19:[1,26]},{21:[1,27]},t(n,[2,14]),t(n,[2,15]),{25:[1,28]},t(n,[2,17]),{11:[1,29]},{16:30,28:[1,31]},{11:[2,21]},t(n,[2,5]),t(n,[2,12]),t(n,[2,13]),t(n,[2,16]),t(f,[2,9]),{14:32,29:g},{29:[2,20]},{11:[1,33]},t(f,[2,10])],defaultActions:{5:[2,18],7:[2,2],24:[2,21],31:[2,20]},parseError:function(s,a){if(a.recoverable)this.trace(s);else{var h=new Error(s);throw h.hash=a,h}},parse:function(s){var a=this,h=[0],d=[],m=[null],c=[],R=this.table,k="",z=0,Q=0,pt=2,tt=1,yt=c.slice.call(arguments,1),v=Object.create(this.lexer),A={yy:{}};for(var D in this.yy)Object.prototype.hasOwnProperty.call(this.yy,D)&&(A.yy[D]=this.yy[D]);v.setInput(s,A.yy),A.yy.lexer=v,A.yy.parser=this,typeof v.yylloc>"u"&&(v.yylloc={});var W=v.yylloc;c.push(W);var dt=v.options&&v.options.ranges;typeof A.yy.parseError=="function"?this.parseError=A.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function ft(){var E;return E=d.pop()||v.lex()||tt,typeof E!="number"&&(E instanceof Array&&(d=E,E=d.pop()),E=a.symbols_[E]||E),E}for(var w,I,$,X,F={},Y,M,et,O;;){if(I=h[h.length-1],this.defaultActions[I]?$=this.defaultActions[I]:((w===null||typeof w>"u")&&(w=ft()),$=R[I]&&R[I][w]),typeof $>"u"||!$.length||!$[0]){var G="";O=[];for(Y in R[I])this.terminals_[Y]&&Y>pt&&O.push("'"+this.terminals_[Y]+"'");v.showPosition?G="Parse error on line "+(z+1)+`:
`+v.showPosition()+`
Expecting `+O.join(", ")+", got '"+(this.terminals_[w]||w)+"'":G="Parse error on line "+(z+1)+": Unexpected "+(w==tt?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(G,{text:v.match,token:this.terminals_[w]||w,line:v.yylineno,loc:W,expected:O})}if($[0]instanceof Array&&$.length>1)throw new Error("Parse Error: multiple actions possible at state: "+I+", token: "+w);switch($[0]){case 1:h.push(w),m.push(v.yytext),c.push(v.yylloc),h.push($[1]),w=null,Q=v.yyleng,k=v.yytext,z=v.yylineno,W=v.yylloc;break;case 2:if(M=this.productions_[$[1]][1],F.$=m[m.length-M],F._$={first_line:c[c.length-(M||1)].first_line,last_line:c[c.length-1].last_line,first_column:c[c.length-(M||1)].first_column,last_column:c[c.length-1].last_column},dt&&(F._$.range=[c[c.length-(M||1)].range[0],c[c.length-1].range[1]]),X=this.performAction.apply(F,[k,Q,z,A.yy,$[1],m,c].concat(yt)),typeof X<"u")return X;M&&(h=h.slice(0,-1*M*2),m=m.slice(0,-1*M),c=c.slice(0,-1*M)),h.push(this.productions_[$[1]][0]),m.push(F.$),c.push(F._$),et=R[h[h.length-2]][h[h.length-1]],h.push(et);break;case 3:return!0}}return!0}},T=function(){var _={EOF:1,parseError:function(a,h){if(this.yy.parser)this.yy.parser.parseError(a,h);else throw new Error(a)},setInput:function(s,a){return this.yy=a||this.yy||{},this._input=s,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var s=this._input[0];this.yytext+=s,this.yyleng++,this.offset++,this.match+=s,this.matched+=s;var a=s.match(/(?:\r\n?|\n).*/g);return a?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),s},unput:function(s){var a=s.length,h=s.split(/(?:\r\n?|\n)/g);this._input=s+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-a),this.offset-=a;var d=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),h.length-1&&(this.yylineno-=h.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:h?(h.length===d.length?this.yylloc.first_column:0)+d[d.length-h.length].length-h[0].length:this.yylloc.first_column-a},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-a]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(s){this.unput(this.match.slice(s))},pastInput:function(){var s=this.matched.substr(0,this.matched.length-this.match.length);return(s.length>20?"...":"")+s.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var s=this.match;return s.length<20&&(s+=this._input.substr(0,20-s.length)),(s.substr(0,20)+(s.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var s=this.pastInput(),a=new Array(s.length+1).join("-");return s+this.upcomingInput()+`
`+a+"^"},test_match:function(s,a){var h,d,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),d=s[0].match(/(?:\r\n?|\n).*/g),d&&(this.yylineno+=d.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:d?d[d.length-1].length-d[d.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+s[0].length},this.yytext+=s[0],this.match+=s[0],this.matches=s,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(s[0].length),this.matched+=s[0],h=this.performAction.call(this,this.yy,this,a,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),h)return h;if(this._backtrack){for(var c in m)this[c]=m[c];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var s,a,h,d;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),c=0;c<m.length;c++)if(h=this._input.match(this.rules[m[c]]),h&&(!a||h[0].length>a[0].length)){if(a=h,d=c,this.options.backtrack_lexer){if(s=this.test_match(h,m[c]),s!==!1)return s;if(this._backtrack){a=!1;continue}else return!1}else if(!this.options.flex)break}return a?(s=this.test_match(a,m[d]),s!==!1?s:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var a=this.next();return a||this.lex()},begin:function(a){this.conditionStack.push(a)},popState:function(){var a=this.conditionStack.length-1;return a>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(a){return a=this.conditionStack.length-1-Math.abs(a||0),a>=0?this.conditionStack[a]:"INITIAL"},pushState:function(a){this.begin(a)},stateStackSize:function(){return this.conditionStack.length},options:{"case-insensitive":!0},performAction:function(a,h,d,m){switch(d){case 0:return this.begin("open_directive"),26;case 1:return this.begin("type_directive"),27;case 2:return this.popState(),this.begin("arg_directive"),15;case 3:return this.popState(),this.popState(),29;case 4:return 28;case 5:break;case 6:break;case 7:return 11;case 8:break;case 9:break;case 10:return 4;case 11:return 17;case 12:return this.begin("acc_title"),18;case 13:return this.popState(),"acc_title_value";case 14:return this.begin("acc_descr"),20;case 15:return this.popState(),"acc_descr_value";case 16:this.begin("acc_descr_multiline");break;case 17:this.popState();break;case 18:return"acc_descr_multiline_value";case 19:return 23;case 20:return 24;case 21:return 25;case 22:return 15;case 23:return 6;case 24:return"INVALID"}},rules:[/^(?:%%\{)/i,/^(?:((?:(?!\}%%)[^:.])*))/i,/^(?::)/i,/^(?:\}%%)/i,/^(?:((?:(?!\}%%).|\n)*))/i,/^(?:%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:\s+)/i,/^(?:#[^\n]*)/i,/^(?:journey\b)/i,/^(?:title\s[^#\n;]+)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:section\s[^#:\n;]+)/i,/^(?:[^#:\n;]+)/i,/^(?::[^#\n;]+)/i,/^(?::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{open_directive:{rules:[1],inclusive:!1},type_directive:{rules:[2,3],inclusive:!1},arg_directive:{rules:[3,4],inclusive:!1},acc_descr_multiline:{rules:[17,18],inclusive:!1},acc_descr:{rules:[15],inclusive:!1},acc_title:{rules:[13],inclusive:!1},INITIAL:{rules:[0,5,6,7,8,9,10,11,12,14,16,19,20,21,22,23,24],inclusive:!0}}};return _}();y.lexer=T;function b(){this.yy={}}return b.prototype=y,y.Parser=b,new b}();Z.parser=Z;const Et=Z;let L="";const J=[],N=[],j=[],Pt=function(t,e,r){vt.parseDirective(this,t,e,r)},At=function(){J.length=0,N.length=0,L="",j.length=0,wt()},It=function(t){L=t,J.push(t)},Ct=function(){return J},Vt=function(){let t=rt();const e=100;let r=0;for(;!t&&r<e;)t=rt(),r++;return N.push(...j),N},Ft=function(){const t=[];return N.forEach(r=>{r.people&&t.push(...r.people)}),[...new Set(t)].sort()},Lt=function(t,e){const r=e.substr(1).split(":");let n=0,i=[];r.length===1?(n=Number(r[0]),i=[]):(n=Number(r[0]),i=r[1].split(","));const l=i.map(p=>p.trim()),o={section:L,type:L,people:l,task:t,score:n};j.push(o)},Rt=function(t){const e={section:L,type:L,description:t,task:t,classes:[]};N.push(e)},rt=function(){const t=function(r){return j[r].processed};let e=!0;for(const[r,n]of j.entries())t(r),e=e&&n.processed;return e},Nt=function(){return Ft()},st={parseDirective:Pt,getConfig:()=>V().journey,clear:At,setDiagramTitle:gt,getDiagramTitle:mt,setAccTitle:xt,getAccTitle:_t,setAccDescription:kt,getAccDescription:bt,addSection:It,getSections:Ct,getTasks:Vt,addTask:Lt,addTaskOrg:Rt,getActors:Nt},jt=t=>`.label {
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);
    color: ${t.textColor};
  }
  .mouth {
    stroke: #666;
  }

  line {
    stroke: ${t.textColor}
  }

  .legend {
    fill: ${t.textColor};
  }

  .label text {
    fill: #333;
  }
  .label {
    color: ${t.textColor}
  }

  .face {
    ${t.faceColor?`fill: ${t.faceColor}`:"fill: #FFF8DC"};
    stroke: #999;
  }

  .node rect,
  .node circle,
  .node ellipse,
  .node polygon,
  .node path {
    fill: ${t.mainBkg};
    stroke: ${t.nodeBorder};
    stroke-width: 1px;
  }

  .node .label {
    text-align: center;
  }
  .node.clickable {
    cursor: pointer;
  }

  .arrowheadPath {
    fill: ${t.arrowheadColor};
  }

  .edgePath .path {
    stroke: ${t.lineColor};
    stroke-width: 1.5px;
  }

  .flowchart-link {
    stroke: ${t.lineColor};
    fill: none;
  }

  .edgeLabel {
    background-color: ${t.edgeLabelBackground};
    rect {
      opacity: 0.5;
    }
    text-align: center;
  }

  .cluster rect {
  }

  .cluster text {
    fill: ${t.titleColor};
  }

  div.mermaidTooltip {
    position: absolute;
    text-align: center;
    max-width: 200px;
    padding: 2px;
    font-family: 'trebuchet ms', verdana, arial, sans-serif;
    font-family: var(--mermaid-font-family);
    font-size: 12px;
    background: ${t.tertiaryColor};
    border: 1px solid ${t.border2};
    border-radius: 2px;
    pointer-events: none;
    z-index: 100;
  }

  .task-type-0, .section-type-0  {
    ${t.fillType0?`fill: ${t.fillType0}`:""};
  }
  .task-type-1, .section-type-1  {
    ${t.fillType0?`fill: ${t.fillType1}`:""};
  }
  .task-type-2, .section-type-2  {
    ${t.fillType0?`fill: ${t.fillType2}`:""};
  }
  .task-type-3, .section-type-3  {
    ${t.fillType0?`fill: ${t.fillType3}`:""};
  }
  .task-type-4, .section-type-4  {
    ${t.fillType0?`fill: ${t.fillType4}`:""};
  }
  .task-type-5, .section-type-5  {
    ${t.fillType0?`fill: ${t.fillType5}`:""};
  }
  .task-type-6, .section-type-6  {
    ${t.fillType0?`fill: ${t.fillType6}`:""};
  }
  .task-type-7, .section-type-7  {
    ${t.fillType0?`fill: ${t.fillType7}`:""};
  }

  .actor-0 {
    ${t.actor0?`fill: ${t.actor0}`:""};
  }
  .actor-1 {
    ${t.actor1?`fill: ${t.actor1}`:""};
  }
  .actor-2 {
    ${t.actor2?`fill: ${t.actor2}`:""};
  }
  .actor-3 {
    ${t.actor3?`fill: ${t.actor3}`:""};
  }
  .actor-4 {
    ${t.actor4?`fill: ${t.actor4}`:""};
  }
  .actor-5 {
    ${t.actor5?`fill: ${t.actor5}`:""};
  }
`,Bt=jt,K=function(t,e){return $t(t,e)},zt=function(t,e){const n=t.append("circle").attr("cx",e.cx).attr("cy",e.cy).attr("class","face").attr("r",15).attr("stroke-width",2).attr("overflow","visible"),i=t.append("g");i.append("circle").attr("cx",e.cx-15/3).attr("cy",e.cy-15/3).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666"),i.append("circle").attr("cx",e.cx+15/3).attr("cy",e.cy-15/3).attr("r",1.5).attr("stroke-width",2).attr("fill","#666").attr("stroke","#666");function l(u){const x=it().startAngle(Math.PI/2).endAngle(3*(Math.PI/2)).innerRadius(7.5).outerRadius(6.8181818181818175);u.append("path").attr("class","mouth").attr("d",x).attr("transform","translate("+e.cx+","+(e.cy+2)+")")}function o(u){const x=it().startAngle(3*Math.PI/2).endAngle(5*(Math.PI/2)).innerRadius(7.5).outerRadius(6.8181818181818175);u.append("path").attr("class","mouth").attr("d",x).attr("transform","translate("+e.cx+","+(e.cy+7)+")")}function p(u){u.append("line").attr("class","mouth").attr("stroke",2).attr("x1",e.cx-5).attr("y1",e.cy+7).attr("x2",e.cx+5).attr("y2",e.cy+7).attr("class","mouth").attr("stroke-width","1px").attr("stroke","#666")}return e.score>3?l(i):e.score<3?o(i):p(i),n},lt=function(t,e){const r=t.append("circle");return r.attr("cx",e.cx),r.attr("cy",e.cy),r.attr("class","actor-"+e.pos),r.attr("fill",e.fill),r.attr("stroke",e.stroke),r.attr("r",e.r),r.class!==void 0&&r.attr("class",r.class),e.title!==void 0&&r.append("title").text(e.title),r},ht=function(t,e){return St(t,e)},Yt=function(t,e){function r(i,l,o,p,u){return i+","+l+" "+(i+o)+","+l+" "+(i+o)+","+(l+p-u)+" "+(i+o-u*1.2)+","+(l+p)+" "+i+","+(l+p)}const n=t.append("polygon");n.attr("points",r(e.x,e.y,50,20,7)),n.attr("class","labelBox"),e.y=e.y+e.labelMargin,e.x=e.x+.5*e.labelMargin,ht(t,e)},Ot=function(t,e,r){const n=t.append("g"),i=ct();i.x=e.x,i.y=e.y,i.fill=e.fill,i.width=r.width*e.taskCount+r.diagramMarginX*(e.taskCount-1),i.height=r.height,i.class="journey-section section-type-"+e.num,i.rx=3,i.ry=3,K(n,i),ut(r)(e.text,n,i.x,i.y,i.width,i.height,{class:"journey-section section-type-"+e.num},r,e.colour)};let nt=-1;const qt=function(t,e,r){const n=e.x+r.width/2,i=t.append("g");nt++;const l=300+5*30;i.append("line").attr("id","task"+nt).attr("x1",n).attr("y1",e.y).attr("x2",n).attr("y2",l).attr("class","task-line").attr("stroke-width","1px").attr("stroke-dasharray","4 2").attr("stroke","#666"),zt(i,{cx:n,cy:300+(5-e.score)*30,score:e.score});const o=ct();o.x=e.x,o.y=e.y,o.fill=e.fill,o.width=r.width,o.height=r.height,o.class="task task-type-"+e.num,o.rx=3,o.ry=3,K(i,o);let p=e.x+14;e.people.forEach(u=>{const x=e.actors[u].color,g={cx:p,cy:e.y,r:7,fill:x,stroke:"#000",title:u,pos:e.actors[u].position};lt(i,g),p+=10}),ut(r)(e.task,i,o.x,o.y,o.width,o.height,{class:"task"},r,e.colour)},Dt=function(t,e){Mt(t,e)},ut=function(){function t(i,l,o,p,u,x,g,f){const y=l.append("text").attr("x",o+u/2).attr("y",p+x/2+5).style("font-color",f).style("text-anchor","middle").text(i);n(y,g)}function e(i,l,o,p,u,x,g,f,y){const{taskFontSize:T,taskFontFamily:b}=f,_=i.split(/<br\s*\/?>/gi);for(let s=0;s<_.length;s++){const a=s*T-T*(_.length-1)/2,h=l.append("text").attr("x",o+u/2).attr("y",p).attr("fill",y).style("text-anchor","middle").style("font-size",T).style("font-family",b);h.append("tspan").attr("x",o+u/2).attr("dy",a).text(_[s]),h.attr("y",p+x/2).attr("dominant-baseline","central").attr("alignment-baseline","central"),n(h,g)}}function r(i,l,o,p,u,x,g,f){const y=l.append("switch"),b=y.append("foreignObject").attr("x",o).attr("y",p).attr("width",u).attr("height",x).attr("position","fixed").append("xhtml:div").style("display","table").style("height","100%").style("width","100%");b.append("div").attr("class","label").style("display","table-cell").style("text-align","center").style("vertical-align","middle").text(i),e(i,y,o,p,u,x,g,f),n(b,g)}function n(i,l){for(const o in l)o in l&&i.attr(o,l[o])}return function(i){return i.textPlacement==="fo"?r:i.textPlacement==="old"?t:e}}(),Wt=function(t){t.append("defs").append("marker").attr("id","arrowhead").attr("refX",5).attr("refY",2).attr("markerWidth",6).attr("markerHeight",4).attr("orient","auto").append("path").attr("d","M 0,0 V 4 L6,2 Z")},B={drawRect:K,drawCircle:lt,drawSection:Ot,drawText:ht,drawLabel:Yt,drawTask:qt,drawBackgroundRect:Dt,initGraphics:Wt},Xt=function(t){Object.keys(t).forEach(function(r){q[r]=t[r]})},P={};function Gt(t){const e=V().journey;let r=60;Object.keys(P).forEach(n=>{const i=P[n].color,l={cx:20,cy:r,r:7,fill:i,stroke:"#000",pos:P[n].position};B.drawCircle(t,l);const o={x:40,y:r+7,fill:"#666",text:n,textMargin:e.boxTextMargin|5};B.drawText(t,o),r+=20})}const q=V().journey,C=q.leftMargin,Ht=function(t,e,r,n){const i=V().journey,l=V().securityLevel;let o;l==="sandbox"&&(o=H("#i"+e));const p=l==="sandbox"?H(o.nodes()[0].contentDocument.body):H("body");S.init();const u=p.select("#"+e);B.initGraphics(u);const x=n.db.getTasks(),g=n.db.getDiagramTitle(),f=n.db.getActors();for(const a in P)delete P[a];let y=0;f.forEach(a=>{P[a]={color:i.actorColours[y%i.actorColours.length],position:y},y++}),Gt(u),S.insert(0,0,C,Object.keys(P).length*50),Ut(u,x,0);const T=S.getBounds();g&&u.append("text").text(g).attr("x",C).attr("font-size","4ex").attr("font-weight","bold").attr("y",25);const b=T.stopy-T.starty+2*i.diagramMarginY,_=C+T.stopx+2*i.diagramMarginX;Tt(u,b,_,i.useMaxWidth),u.append("line").attr("x1",C).attr("y1",i.height*4).attr("x2",_-C-4).attr("y2",i.height*4).attr("stroke-width",4).attr("stroke","black").attr("marker-end","url(#arrowhead)");const s=g?70:0;u.attr("viewBox",`${T.startx} -25 ${_} ${b+s}`),u.attr("preserveAspectRatio","xMinYMin meet"),u.attr("height",b+s+25)},S={data:{startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},verticalPos:0,sequenceItems:[],init:function(){this.sequenceItems=[],this.data={startx:void 0,stopx:void 0,starty:void 0,stopy:void 0},this.verticalPos=0},updateVal:function(t,e,r,n){t[e]===void 0?t[e]=r:t[e]=n(r,t[e])},updateBounds:function(t,e,r,n){const i=V().journey,l=this;let o=0;function p(u){return function(g){o++;const f=l.sequenceItems.length-o+1;l.updateVal(g,"starty",e-f*i.boxMargin,Math.min),l.updateVal(g,"stopy",n+f*i.boxMargin,Math.max),l.updateVal(S.data,"startx",t-f*i.boxMargin,Math.min),l.updateVal(S.data,"stopx",r+f*i.boxMargin,Math.max),u!=="activation"&&(l.updateVal(g,"startx",t-f*i.boxMargin,Math.min),l.updateVal(g,"stopx",r+f*i.boxMargin,Math.max),l.updateVal(S.data,"starty",e-f*i.boxMargin,Math.min),l.updateVal(S.data,"stopy",n+f*i.boxMargin,Math.max))}}this.sequenceItems.forEach(p())},insert:function(t,e,r,n){const i=Math.min(t,r),l=Math.max(t,r),o=Math.min(e,n),p=Math.max(e,n);this.updateVal(S.data,"startx",i,Math.min),this.updateVal(S.data,"starty",o,Math.min),this.updateVal(S.data,"stopx",l,Math.max),this.updateVal(S.data,"stopy",p,Math.max),this.updateBounds(i,o,l,p)},bumpVerticalPos:function(t){this.verticalPos=this.verticalPos+t,this.data.stopy=this.verticalPos},getVerticalPos:function(){return this.verticalPos},getBounds:function(){return this.data}},U=q.sectionFills,at=q.sectionColours,Ut=function(t,e,r){const n=V().journey;let i="";const l=n.height*2+n.diagramMarginY,o=r+l;let p=0,u="#CCC",x="black",g=0;for(const[f,y]of e.entries()){if(i!==y.section){u=U[p%U.length],g=p%U.length,x=at[p%at.length];let b=0;const _=y.section;for(let a=f;a<e.length&&e[a].section==_;a++)b=b+1;const s={x:f*n.taskMargin+f*n.width+C,y:50,text:y.section,fill:u,num:g,colour:x,taskCount:b};B.drawSection(t,s,n),i=y.section,p++}const T=y.people.reduce((b,_)=>(P[_]&&(b[_]=P[_]),b),{});y.x=f*n.taskMargin+f*n.width+C,y.y=o,y.width=n.diagramMarginX,y.height=n.diagramMarginY,y.colour=x,y.fill=u,y.num=g,y.actors=T,B.drawTask(t,y,n),S.insert(y.x,y.y,y.x+y.width+n.taskMargin,300+5*30)}},ot={setConf:Xt,draw:Ht},Fe={parser:Et,db:st,renderer:ot,styles:Bt,init:t=>{ot.setConf(t.journey),st.clear()}};export{Fe as diagram};
