import Eo,{useMemo,useRef,useEffect}from'react';import {Renderer,Plane,Program,Mesh,Transform}from'ogl';var je=Object.defineProperty;var xe=Object.getOwnPropertySymbols;var We=Object.prototype.hasOwnProperty,De=Object.prototype.propertyIsEnumerable;var ye=(e,t,o)=>t in e?je(e,t,{enumerable:true,configurable:true,writable:true,value:o}):e[t]=o,K=(e,t)=>{for(var o in t||(t={}))We.call(t,o)&&ye(e,o,t[o]);if(xe)for(var o of xe(t))De.call(t,o)&&ye(e,o,t[o]);return e};function we(e){var t,o,r="";if(typeof e=="string"||typeof e=="number")r+=e;else if(typeof e=="object")if(Array.isArray(e)){var a=e.length;for(t=0;t<a;t++)e[t]&&(o=we(e[t]))&&(r&&(r+=" "),r+=o);}else for(o in e)e[o]&&(r&&(r+=" "),r+=o);return r}function ke(){for(var e,t,o=0,r="",a=arguments.length;o<a;o++)(e=arguments[o])&&(t=we(e))&&(r&&(r+=" "),r+=t);return r}var He=e=>{let t=$e(e),{conflictingClassGroups:o,conflictingClassGroupModifiers:r}=e;return {getClassGroupId:i=>{let c=i.split("-");return c[0]===""&&c.length!==1&&c.shift(),Me(c,t)||qe(i)},getConflictingClassGroupIds:(i,c)=>{let d=o[i]||[];return c&&r[i]?[...d,...r[i]]:d}}},Me=(e,t)=>{var i;if(e.length===0)return t.classGroupId;let o=e[0],r=t.nextPart.get(o),a=r?Me(e.slice(1),r):void 0;if(a)return a;if(t.validators.length===0)return;let u=e.join("-");return (i=t.validators.find(({validator:c})=>c(u)))==null?void 0:i.classGroupId},_e=/^\[(.+)\]$/,qe=e=>{if(_e.test(e)){let t=_e.exec(e)[1],o=t==null?void 0:t.substring(0,t.indexOf(":"));if(o)return "arbitrary.."+o}},$e=e=>{let{theme:t,classGroups:o}=e,r={nextPart:new Map,validators:[]};for(let a in o)le(o[a],r,a,t);return r},le=(e,t,o,r)=>{e.forEach(a=>{if(typeof a=="string"){let u=a===""?t:Re(t,a);u.classGroupId=o;return}if(typeof a=="function"){if(Ye(a)){le(a(r),t,o,r);return}t.validators.push({validator:a,classGroupId:o});return}Object.entries(a).forEach(([u,i])=>{le(i,Re(t,u),o,r);});});},Re=(e,t)=>{let o=e;return t.split("-").forEach(r=>{o.nextPart.has(r)||o.nextPart.set(r,{nextPart:new Map,validators:[]}),o=o.nextPart.get(r);}),o},Ye=e=>e.isThemeGetter,Je=e=>{if(e<1)return {get:()=>{},set:()=>{}};let t=0,o=new Map,r=new Map,a=(u,i)=>{o.set(u,i),t++,t>e&&(t=0,r=o,o=new Map);};return {get(u){let i=o.get(u);if(i!==void 0)return i;if((i=r.get(u))!==void 0)return a(u,i),i},set(u,i){o.has(u)?o.set(u,i):a(u,i);}}};var Xe=e=>{let{prefix:t,experimentalParseClassName:o}=e,r=a=>{let u=[],i=0,c=0,d=0,f;for(let y=0;y<a.length;y++){let k=a[y];if(i===0&&c===0){if(k===":"){u.push(a.slice(d,y)),d=y+1;continue}if(k==="/"){f=y;continue}}k==="["?i++:k==="]"?i--:k==="("?c++:k===")"&&c--;}let h=u.length===0?a:a.substring(d),R=Ke(h),M=R!==h,T=f&&f>d?f-d:void 0;return {modifiers:u,hasImportantModifier:M,baseClassName:R,maybePostfixModifierPosition:T}};if(t){let a=t+":",u=r;r=i=>i.startsWith(a)?u(i.substring(a.length)):{isExternal:true,modifiers:[],hasImportantModifier:false,baseClassName:i,maybePostfixModifierPosition:void 0};}if(o){let a=r;r=u=>o({className:u,parseClassName:a});}return r},Ke=e=>e.endsWith("!")?e.substring(0,e.length-1):e.startsWith("!")?e.substring(1):e,Qe=e=>{let t=Object.fromEntries(e.orderSensitiveModifiers.map(r=>[r,true]));return r=>{if(r.length<=1)return r;let a=[],u=[];return r.forEach(i=>{i[0]==="["||t[i]?(a.push(...u.sort(),i),u=[]):u.push(i);}),a.push(...u.sort()),a}},Ze=e=>K({cache:Je(e.cacheSize),parseClassName:Xe(e),sortModifiers:Qe(e)},He(e)),eo=/\s+/,oo=(e,t)=>{let{parseClassName:o,getClassGroupId:r,getConflictingClassGroupIds:a,sortModifiers:u}=t,i=[],c=e.trim().split(eo),d="";for(let f=c.length-1;f>=0;f-=1){let h=c[f],{isExternal:R,modifiers:M,hasImportantModifier:T,baseClassName:y,maybePostfixModifierPosition:k}=o(h);if(R){d=h+(d.length>0?" "+d:d);continue}let A=!!k,P=r(A?y.substring(0,k):y);if(!P){if(!A){d=h+(d.length>0?" "+d:d);continue}if(P=r(y),!P){d=h+(d.length>0?" "+d:d);continue}A=false;}let G=u(M).join(":"),v=T?G+"!":G,w=v+P;if(i.includes(w))continue;i.push(w);let z=a(P,A);for(let N=0;N<z.length;++N){let j=z[N];i.push(v+j);}d=h+(d.length>0?" "+d:d);}return d};function ro(){let e=0,t,o,r="";for(;e<arguments.length;)(t=arguments[e++])&&(o=Te(t))&&(r&&(r+=" "),r+=o);return r}var Te=e=>{if(typeof e=="string")return e;let t,o="";for(let r=0;r<e.length;r++)e[r]&&(t=Te(e[r]))&&(o&&(o+=" "),o+=t);return o};function to(e,...t){let o,r,a,u=i;function i(d){let f=t.reduce((h,R)=>R(h),e());return o=Ze(f),r=o.cache.get,a=o.cache.set,u=c,c(d)}function c(d){let f=r(d);if(f)return f;let h=oo(d,o);return a(d,h),h}return function(){return u(ro.apply(null,arguments))}}var g=e=>{let t=o=>o[e]||[];return t.isThemeGetter=true,t},Ae=/^\[(?:(\w[\w-]*):)?(.+)\]$/i,ze=/^\((?:(\w[\w-]*):)?(.+)\)$/i,no=/^\d+\/\d+$/,so=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,ao=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,io=/^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,lo=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,co=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,U=e=>no.test(e),p=e=>!!e&&!Number.isNaN(Number(e)),E=e=>!!e&&Number.isInteger(Number(e)),ae=e=>e.endsWith("%")&&p(e.slice(0,-1)),C=e=>so.test(e),uo=()=>true,mo=e=>ao.test(e)&&!io.test(e),Se=()=>false,po=e=>lo.test(e),fo=e=>co.test(e),go=e=>!n(e)&&!s(e),bo=e=>B(e,Ee,Se),n=e=>Ae.test(e),L=e=>B(e,Ne,mo),ie=e=>B(e,wo,p),Ge=e=>B(e,Ie,Se),ho=e=>B(e,Ce,fo),Q=e=>B(e,Fe,po),s=e=>ze.test(e),W=e=>V(e,Ne),vo=e=>V(e,ko),Pe=e=>V(e,Ie),xo=e=>V(e,Ee),yo=e=>V(e,Ce),Z=e=>V(e,Fe,true),B=(e,t,o)=>{let r=Ae.exec(e);return r?r[1]?t(r[1]):o(r[2]):false},V=(e,t,o=false)=>{let r=ze.exec(e);return r?r[1]?t(r[1]):o:false},Ie=e=>e==="position"||e==="percentage",Ce=e=>e==="image"||e==="url",Ee=e=>e==="length"||e==="size"||e==="bg-size",Ne=e=>e==="length",wo=e=>e==="number",ko=e=>e==="family-name",Fe=e=>e==="shadow";var _o=()=>{let e=g("color"),t=g("font"),o=g("text"),r=g("font-weight"),a=g("tracking"),u=g("leading"),i=g("breakpoint"),c=g("container"),d=g("spacing"),f=g("radius"),h=g("shadow"),R=g("inset-shadow"),M=g("text-shadow"),T=g("drop-shadow"),y=g("blur"),k=g("perspective"),A=g("aspect"),P=g("ease"),G=g("animate"),v=()=>["auto","avoid","all","avoid-page","page","left","right","column"],w=()=>["center","top","bottom","left","right","top-left","left-top","top-right","right-top","bottom-right","right-bottom","bottom-left","left-bottom"],z=()=>[...w(),s,n],N=()=>["auto","hidden","clip","visible","scroll"],j=()=>["auto","contain","none"],m=()=>[s,n,d],S=()=>[U,"full","auto",...m()],ue=()=>[E,"none","subgrid",s,n],me=()=>["auto",{span:["full",E,s,n]},E,s,n],q=()=>[E,"auto",s,n],pe=()=>["auto","min","max","fr",s,n],te=()=>["start","end","center","between","around","evenly","stretch","baseline","center-safe","end-safe"],O=()=>["start","end","center","stretch","center-safe","end-safe"],I=()=>["auto",...m()],F=()=>[U,"auto","full","dvw","dvh","lvw","lvh","svw","svh","min","max","fit",...m()],l=()=>[e,s,n],fe=()=>[...w(),Pe,Ge,{position:[s,n]}],ge=()=>["no-repeat",{repeat:["","x","y","space","round"]}],be=()=>["auto","cover","contain",xo,bo,{size:[s,n]}],ne=()=>[ae,W,L],x=()=>["","none","full",f,s,n],_=()=>["",p,W,L],$=()=>["solid","dashed","dotted","double"],he=()=>["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"],b=()=>[p,ae,Pe,Ge],ve=()=>["","none",y,s,n],Y=()=>["none",p,s,n],J=()=>["none",p,s,n],se=()=>[p,s,n],X=()=>[U,"full",...m()];return {cacheSize:500,theme:{animate:["spin","ping","pulse","bounce"],aspect:["video"],blur:[C],breakpoint:[C],color:[uo],container:[C],"drop-shadow":[C],ease:["in","out","in-out"],font:[go],"font-weight":["thin","extralight","light","normal","medium","semibold","bold","extrabold","black"],"inset-shadow":[C],leading:["none","tight","snug","normal","relaxed","loose"],perspective:["dramatic","near","normal","midrange","distant","none"],radius:[C],shadow:[C],spacing:["px",p],text:[C],"text-shadow":[C],tracking:["tighter","tight","normal","wide","wider","widest"]},classGroups:{aspect:[{aspect:["auto","square",U,n,s,A]}],container:["container"],columns:[{columns:[p,n,s,c]}],"break-after":[{"break-after":v()}],"break-before":[{"break-before":v()}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],sr:["sr-only","not-sr-only"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:z()}],overflow:[{overflow:N()}],"overflow-x":[{"overflow-x":N()}],"overflow-y":[{"overflow-y":N()}],overscroll:[{overscroll:j()}],"overscroll-x":[{"overscroll-x":j()}],"overscroll-y":[{"overscroll-y":j()}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:S()}],"inset-x":[{"inset-x":S()}],"inset-y":[{"inset-y":S()}],start:[{start:S()}],end:[{end:S()}],top:[{top:S()}],right:[{right:S()}],bottom:[{bottom:S()}],left:[{left:S()}],visibility:["visible","invisible","collapse"],z:[{z:[E,"auto",s,n]}],basis:[{basis:[U,"full","auto",c,...m()]}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["nowrap","wrap","wrap-reverse"]}],flex:[{flex:[p,U,"auto","initial","none",n]}],grow:[{grow:["",p,s,n]}],shrink:[{shrink:["",p,s,n]}],order:[{order:[E,"first","last","none",s,n]}],"grid-cols":[{"grid-cols":ue()}],"col-start-end":[{col:me()}],"col-start":[{"col-start":q()}],"col-end":[{"col-end":q()}],"grid-rows":[{"grid-rows":ue()}],"row-start-end":[{row:me()}],"row-start":[{"row-start":q()}],"row-end":[{"row-end":q()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":pe()}],"auto-rows":[{"auto-rows":pe()}],gap:[{gap:m()}],"gap-x":[{"gap-x":m()}],"gap-y":[{"gap-y":m()}],"justify-content":[{justify:[...te(),"normal"]}],"justify-items":[{"justify-items":[...O(),"normal"]}],"justify-self":[{"justify-self":["auto",...O()]}],"align-content":[{content:["normal",...te()]}],"align-items":[{items:[...O(),{baseline:["","last"]}]}],"align-self":[{self:["auto",...O(),{baseline:["","last"]}]}],"place-content":[{"place-content":te()}],"place-items":[{"place-items":[...O(),"baseline"]}],"place-self":[{"place-self":["auto",...O()]}],p:[{p:m()}],px:[{px:m()}],py:[{py:m()}],ps:[{ps:m()}],pe:[{pe:m()}],pt:[{pt:m()}],pr:[{pr:m()}],pb:[{pb:m()}],pl:[{pl:m()}],m:[{m:I()}],mx:[{mx:I()}],my:[{my:I()}],ms:[{ms:I()}],me:[{me:I()}],mt:[{mt:I()}],mr:[{mr:I()}],mb:[{mb:I()}],ml:[{ml:I()}],"space-x":[{"space-x":m()}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":m()}],"space-y-reverse":["space-y-reverse"],size:[{size:F()}],w:[{w:[c,"screen",...F()]}],"min-w":[{"min-w":[c,"screen","none",...F()]}],"max-w":[{"max-w":[c,"screen","none","prose",{screen:[i]},...F()]}],h:[{h:["screen","lh",...F()]}],"min-h":[{"min-h":["screen","lh","none",...F()]}],"max-h":[{"max-h":["screen","lh",...F()]}],"font-size":[{text:["base",o,W,L]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:[r,s,ie]}],"font-stretch":[{"font-stretch":["ultra-condensed","extra-condensed","condensed","semi-condensed","normal","semi-expanded","expanded","extra-expanded","ultra-expanded",ae,n]}],"font-family":[{font:[vo,n,t]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractions"],tracking:[{tracking:[a,s,n]}],"line-clamp":[{"line-clamp":[p,"none",s,ie]}],leading:[{leading:[u,...m()]}],"list-image":[{"list-image":["none",s,n]}],"list-style-position":[{list:["inside","outside"]}],"list-style-type":[{list:["disc","decimal","none",s,n]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"placeholder-color":[{placeholder:l()}],"text-color":[{text:l()}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:[...$(),"wavy"]}],"text-decoration-thickness":[{decoration:[p,"from-font","auto",s,L]}],"text-decoration-color":[{decoration:l()}],"underline-offset":[{"underline-offset":[p,"auto",s,n]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:m()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",s,n]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],wrap:[{wrap:["break-word","anywhere","normal"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",s,n]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:fe()}],"bg-repeat":[{bg:ge()}],"bg-size":[{bg:be()}],"bg-image":[{bg:["none",{linear:[{to:["t","tr","r","br","b","bl","l","tl"]},E,s,n],radial:["",s,n],conic:[E,s,n]},yo,ho]}],"bg-color":[{bg:l()}],"gradient-from-pos":[{from:ne()}],"gradient-via-pos":[{via:ne()}],"gradient-to-pos":[{to:ne()}],"gradient-from":[{from:l()}],"gradient-via":[{via:l()}],"gradient-to":[{to:l()}],rounded:[{rounded:x()}],"rounded-s":[{"rounded-s":x()}],"rounded-e":[{"rounded-e":x()}],"rounded-t":[{"rounded-t":x()}],"rounded-r":[{"rounded-r":x()}],"rounded-b":[{"rounded-b":x()}],"rounded-l":[{"rounded-l":x()}],"rounded-ss":[{"rounded-ss":x()}],"rounded-se":[{"rounded-se":x()}],"rounded-ee":[{"rounded-ee":x()}],"rounded-es":[{"rounded-es":x()}],"rounded-tl":[{"rounded-tl":x()}],"rounded-tr":[{"rounded-tr":x()}],"rounded-br":[{"rounded-br":x()}],"rounded-bl":[{"rounded-bl":x()}],"border-w":[{border:_()}],"border-w-x":[{"border-x":_()}],"border-w-y":[{"border-y":_()}],"border-w-s":[{"border-s":_()}],"border-w-e":[{"border-e":_()}],"border-w-t":[{"border-t":_()}],"border-w-r":[{"border-r":_()}],"border-w-b":[{"border-b":_()}],"border-w-l":[{"border-l":_()}],"divide-x":[{"divide-x":_()}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":_()}],"divide-y-reverse":["divide-y-reverse"],"border-style":[{border:[...$(),"hidden","none"]}],"divide-style":[{divide:[...$(),"hidden","none"]}],"border-color":[{border:l()}],"border-color-x":[{"border-x":l()}],"border-color-y":[{"border-y":l()}],"border-color-s":[{"border-s":l()}],"border-color-e":[{"border-e":l()}],"border-color-t":[{"border-t":l()}],"border-color-r":[{"border-r":l()}],"border-color-b":[{"border-b":l()}],"border-color-l":[{"border-l":l()}],"divide-color":[{divide:l()}],"outline-style":[{outline:[...$(),"none","hidden"]}],"outline-offset":[{"outline-offset":[p,s,n]}],"outline-w":[{outline:["",p,W,L]}],"outline-color":[{outline:l()}],shadow:[{shadow:["","none",h,Z,Q]}],"shadow-color":[{shadow:l()}],"inset-shadow":[{"inset-shadow":["none",R,Z,Q]}],"inset-shadow-color":[{"inset-shadow":l()}],"ring-w":[{ring:_()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:l()}],"ring-offset-w":[{"ring-offset":[p,L]}],"ring-offset-color":[{"ring-offset":l()}],"inset-ring-w":[{"inset-ring":_()}],"inset-ring-color":[{"inset-ring":l()}],"text-shadow":[{"text-shadow":["none",M,Z,Q]}],"text-shadow-color":[{"text-shadow":l()}],opacity:[{opacity:[p,s,n]}],"mix-blend":[{"mix-blend":[...he(),"plus-darker","plus-lighter"]}],"bg-blend":[{"bg-blend":he()}],"mask-clip":[{"mask-clip":["border","padding","content","fill","stroke","view"]},"mask-no-clip"],"mask-composite":[{mask:["add","subtract","intersect","exclude"]}],"mask-image-linear-pos":[{"mask-linear":[p]}],"mask-image-linear-from-pos":[{"mask-linear-from":b()}],"mask-image-linear-to-pos":[{"mask-linear-to":b()}],"mask-image-linear-from-color":[{"mask-linear-from":l()}],"mask-image-linear-to-color":[{"mask-linear-to":l()}],"mask-image-t-from-pos":[{"mask-t-from":b()}],"mask-image-t-to-pos":[{"mask-t-to":b()}],"mask-image-t-from-color":[{"mask-t-from":l()}],"mask-image-t-to-color":[{"mask-t-to":l()}],"mask-image-r-from-pos":[{"mask-r-from":b()}],"mask-image-r-to-pos":[{"mask-r-to":b()}],"mask-image-r-from-color":[{"mask-r-from":l()}],"mask-image-r-to-color":[{"mask-r-to":l()}],"mask-image-b-from-pos":[{"mask-b-from":b()}],"mask-image-b-to-pos":[{"mask-b-to":b()}],"mask-image-b-from-color":[{"mask-b-from":l()}],"mask-image-b-to-color":[{"mask-b-to":l()}],"mask-image-l-from-pos":[{"mask-l-from":b()}],"mask-image-l-to-pos":[{"mask-l-to":b()}],"mask-image-l-from-color":[{"mask-l-from":l()}],"mask-image-l-to-color":[{"mask-l-to":l()}],"mask-image-x-from-pos":[{"mask-x-from":b()}],"mask-image-x-to-pos":[{"mask-x-to":b()}],"mask-image-x-from-color":[{"mask-x-from":l()}],"mask-image-x-to-color":[{"mask-x-to":l()}],"mask-image-y-from-pos":[{"mask-y-from":b()}],"mask-image-y-to-pos":[{"mask-y-to":b()}],"mask-image-y-from-color":[{"mask-y-from":l()}],"mask-image-y-to-color":[{"mask-y-to":l()}],"mask-image-radial":[{"mask-radial":[s,n]}],"mask-image-radial-from-pos":[{"mask-radial-from":b()}],"mask-image-radial-to-pos":[{"mask-radial-to":b()}],"mask-image-radial-from-color":[{"mask-radial-from":l()}],"mask-image-radial-to-color":[{"mask-radial-to":l()}],"mask-image-radial-shape":[{"mask-radial":["circle","ellipse"]}],"mask-image-radial-size":[{"mask-radial":[{closest:["side","corner"],farthest:["side","corner"]}]}],"mask-image-radial-pos":[{"mask-radial-at":w()}],"mask-image-conic-pos":[{"mask-conic":[p]}],"mask-image-conic-from-pos":[{"mask-conic-from":b()}],"mask-image-conic-to-pos":[{"mask-conic-to":b()}],"mask-image-conic-from-color":[{"mask-conic-from":l()}],"mask-image-conic-to-color":[{"mask-conic-to":l()}],"mask-mode":[{mask:["alpha","luminance","match"]}],"mask-origin":[{"mask-origin":["border","padding","content","fill","stroke","view"]}],"mask-position":[{mask:fe()}],"mask-repeat":[{mask:ge()}],"mask-size":[{mask:be()}],"mask-type":[{"mask-type":["alpha","luminance"]}],"mask-image":[{mask:["none",s,n]}],filter:[{filter:["","none",s,n]}],blur:[{blur:ve()}],brightness:[{brightness:[p,s,n]}],contrast:[{contrast:[p,s,n]}],"drop-shadow":[{"drop-shadow":["","none",T,Z,Q]}],"drop-shadow-color":[{"drop-shadow":l()}],grayscale:[{grayscale:["",p,s,n]}],"hue-rotate":[{"hue-rotate":[p,s,n]}],invert:[{invert:["",p,s,n]}],saturate:[{saturate:[p,s,n]}],sepia:[{sepia:["",p,s,n]}],"backdrop-filter":[{"backdrop-filter":["","none",s,n]}],"backdrop-blur":[{"backdrop-blur":ve()}],"backdrop-brightness":[{"backdrop-brightness":[p,s,n]}],"backdrop-contrast":[{"backdrop-contrast":[p,s,n]}],"backdrop-grayscale":[{"backdrop-grayscale":["",p,s,n]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[p,s,n]}],"backdrop-invert":[{"backdrop-invert":["",p,s,n]}],"backdrop-opacity":[{"backdrop-opacity":[p,s,n]}],"backdrop-saturate":[{"backdrop-saturate":[p,s,n]}],"backdrop-sepia":[{"backdrop-sepia":["",p,s,n]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":m()}],"border-spacing-x":[{"border-spacing-x":m()}],"border-spacing-y":[{"border-spacing-y":m()}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["","all","colors","opacity","shadow","transform","none",s,n]}],"transition-behavior":[{transition:["normal","discrete"]}],duration:[{duration:[p,"initial",s,n]}],ease:[{ease:["linear","initial",P,s,n]}],delay:[{delay:[p,s,n]}],animate:[{animate:["none",G,s,n]}],backface:[{backface:["hidden","visible"]}],perspective:[{perspective:[k,s,n]}],"perspective-origin":[{"perspective-origin":z()}],rotate:[{rotate:Y()}],"rotate-x":[{"rotate-x":Y()}],"rotate-y":[{"rotate-y":Y()}],"rotate-z":[{"rotate-z":Y()}],scale:[{scale:J()}],"scale-x":[{"scale-x":J()}],"scale-y":[{"scale-y":J()}],"scale-z":[{"scale-z":J()}],"scale-3d":["scale-3d"],skew:[{skew:se()}],"skew-x":[{"skew-x":se()}],"skew-y":[{"skew-y":se()}],transform:[{transform:[s,n,"","none","gpu","cpu"]}],"transform-origin":[{origin:z()}],"transform-style":[{transform:["3d","flat"]}],translate:[{translate:X()}],"translate-x":[{"translate-x":X()}],"translate-y":[{"translate-y":X()}],"translate-z":[{"translate-z":X()}],"translate-none":["translate-none"],accent:[{accent:l()}],appearance:[{appearance:["none","auto"]}],"caret-color":[{caret:l()}],"color-scheme":[{scheme:["normal","dark","light","light-dark","only-dark","only-light"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",s,n]}],"field-sizing":[{"field-sizing":["fixed","content"]}],"pointer-events":[{"pointer-events":["auto","none"]}],resize:[{resize:["none","","y","x"]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":m()}],"scroll-mx":[{"scroll-mx":m()}],"scroll-my":[{"scroll-my":m()}],"scroll-ms":[{"scroll-ms":m()}],"scroll-me":[{"scroll-me":m()}],"scroll-mt":[{"scroll-mt":m()}],"scroll-mr":[{"scroll-mr":m()}],"scroll-mb":[{"scroll-mb":m()}],"scroll-ml":[{"scroll-ml":m()}],"scroll-p":[{"scroll-p":m()}],"scroll-px":[{"scroll-px":m()}],"scroll-py":[{"scroll-py":m()}],"scroll-ps":[{"scroll-ps":m()}],"scroll-pe":[{"scroll-pe":m()}],"scroll-pt":[{"scroll-pt":m()}],"scroll-pr":[{"scroll-pr":m()}],"scroll-pb":[{"scroll-pb":m()}],"scroll-pl":[{"scroll-pl":m()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",s,n]}],fill:[{fill:["none",...l()]}],"stroke-w":[{stroke:[p,W,L,ie]}],stroke:[{stroke:["none",...l()]}],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-x","border-w-y","border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-x","border-color-y","border-color-s","border-color-e","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],translate:["translate-x","translate-y","translate-none"],"translate-none":["translate","translate-x","translate-y","translate-z"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]},orderSensitiveModifiers:["*","**","after","backdrop","before","details-content","file","first-letter","first-line","marker","placeholder","selection"]}};var Le=to(_o);function Oe(...e){return Le(ke(e))}var ce={color1:{r:226,g:98,b:75},color2:{r:255,g:255,b:255},color3:{r:30,g:34,b:159},speed:.4,scale:1,type:"stripe",noise:.08},ee={linear:0,conic:1,animated:2,wave:3,silk:4,smoke:5,stripe:6},Ro={cosmic:{color1:{r:85,g:4,b:129},color2:{r:0,g:145,b:255},color3:{r:0,g:4,b:5},speed:.4,scale:1.2,type:"silk",noise:.1},matrix:{color1:{r:34,g:54,b:145},color2:{r:0,g:0,b:0},color3:{r:147,g:251,b:173},speed:.8,scale:1,type:"silk",noise:.1},electric:{color1:{r:5,g:65,b:245},color2:{r:178,g:224,b:209},color3:{r:87,g:229,b:149},speed:.9,scale:2,type:"animated",noise:.18},inferno:{color1:{r:77,g:0,b:0},color2:{r:0,g:0,b:0},color3:{r:255,g:187,b:0},speed:.9,scale:1.1,type:"wave",noise:.18},mystic:{color1:{r:192,g:155,b:197},color2:{r:0,g:0,b:0},color3:{r:53,g:0,b:97},speed:.9,scale:2,type:"smoke",noise:.18},cyber:{color1:{r:102,g:237,b:255},color2:{r:0,g:0,b:0},color3:{r:0,g:255,b:110},speed:.9,scale:2,type:"silk",noise:.18},neon:{color1:{r:102,g:237,b:255},color2:{r:0,g:0,b:0},color3:{r:0,g:255,b:110},speed:.6,scale:2,type:"animated",noise:.18},plasma:{color1:{r:163,g:106,b:242},color2:{r:0,g:0,b:0},color3:{r:234,g:130,b:106},speed:.6,scale:1.2,type:"silk",noise:.18}};var oe=e=>[e.r/255,e.g/255,e.b/255];var So=`
  attribute vec2 position;
  varying vec2 vUv;

  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`,Io=`
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  uniform float u_time;
  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_speed;
  uniform float u_scale;
  uniform int u_type;
  uniform float u_noise;
  uniform vec2 u_resolution;

  varying vec2 vUv;

  #define PI 3.14159265359


  // @Utility
  float noise(vec2 st) {
    return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
  }

  // @Gradient Types
  vec3 linearGradient(vec2 uv, float time) {
    float t = (uv.y * u_scale) + sin(uv.x * PI + time) * 0.1;
    t = clamp(t, 0.0, 1.0);

    return t < 0.5
      ? mix(u_color1, u_color2, t * 2.0)
      : mix(u_color2, u_color3, (t - 0.5) * 2.0);
  }

  vec3 conicGradient(vec2 uv, float time) {
    vec2 center = vec2(0.5);
    vec2 pos = uv - center;

    float angle = atan(pos.y, pos.x);
    float normalizedAngle = (angle + PI) / (2.0 * PI);

    float t = fract(normalizedAngle * u_scale + time * 0.3);
    float smoothT = t;

    vec3 color;
    if (smoothT < 0.33) {
      color = mix(u_color1, u_color2, smoothstep(0.0, 0.33, smoothT));
    } else if (smoothT < 0.66) {
      color = mix(u_color2, u_color3, smoothstep(0.33, 0.66, smoothT));
    } else {
      color = mix(u_color3, u_color1, smoothstep(0.66, 1.0, smoothT));
    }

    float dist = length(pos);
    color += sin(dist * 8.0 + time * 1.5) * 0.03;

    return color;
  }

  #define S(a,b,t) smoothstep(a,b,t)

  mat2 Rot(float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c);
  }

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(2127.1, 81.17)), dot(p, vec2(1269.5, 283.37)));
    return fract(sin(p) * 43758.5453);
  }

  float advancedNoise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    vec2 u = f * f * (3.0 - 2.0 * f);
    float n = mix(mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
                      dot(-1.0 + 2.0 * hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
                  mix(dot(-1.0 + 2.0 * hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
                      dot(-1.0 + 2.0 * hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
    return 0.5 + 0.5 * n;
  }

  vec3 animatedGradient(vec2 uv, float time) {
    float ratio = u_resolution.x / u_resolution.y;
    vec2 tuv = uv;
    tuv -= 0.5;

    float degree = advancedNoise(vec2(time * 0.1 * u_speed, tuv.x * tuv.y));
    tuv.y *= 1.0 / ratio;
    tuv *= Rot(radians((degree - 0.5) * 720.0 * u_scale + 180.0));
    tuv.y *= ratio;

    float frequency = 5.0 * u_scale;
    float amplitude = 30.0;
    float speed = time * 2.0 * u_speed;
    tuv.x += sin(tuv.y * frequency + speed) / amplitude;
    tuv.y += sin(tuv.x * frequency * 1.5 + speed) / (amplitude * 0.5);

    vec3 layer1 = mix(u_color1, u_color2, S(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));
    vec3 layer2 = mix(u_color2, u_color3, S(-0.3, 0.2, (tuv * Rot(radians(-5.0))).x));

    vec3 finalComp = mix(layer1, layer2, S(0.05, -0.2, tuv.y));

    return finalComp;
  }

  vec3 waveGradient(vec2 uv, float time) {
    float y = uv.y;

    float wave1 = sin(uv.x * PI * u_scale * 0.8 + time * u_speed * 0.5) * 0.1;
    float wave2 = sin(uv.x * PI * u_scale * 0.5 + time * u_speed * 0.3) * 0.15;
    float wave3 = sin(uv.x * PI * u_scale * 1.2 + time * u_speed * 0.8) * 0.2;

    float flowingY = y + wave1 + wave2 + wave3;
    float pattern = smoothstep(0.0, 1.0, clamp(flowingY, 0.0, 1.0));

    vec3 color;
    if (pattern < 0.33) {
      float t = smoothstep(0.0, 0.33, pattern);
      color = mix(u_color1, u_color2, t);
    } else if (pattern < 0.66) {
      float t = smoothstep(0.33, 0.66, pattern);
      color = mix(u_color2, u_color3, t);
    } else {
      float t = smoothstep(0.66, 1.0, pattern);
      color = mix(u_color3, u_color1, t);
    }

    float variation = sin(uv.x * PI * 2.0 + time * u_speed) *
                      cos(uv.y * PI * 1.5 + time * u_speed * 0.7) * 0.02;
    color += variation;

    return clamp(color, 0.0, 1.0);
  }

  vec3 silkGradient(vec2 uv, float time) {
    vec2 fragCoord = uv * u_resolution;
    vec2 invResolution = 1.0 / u_resolution.xy;
    vec2 centeredUv = (fragCoord * 2.0 - u_resolution.xy) * invResolution;

    centeredUv *= u_scale;

    float dampening = 1.0 / (1.0 + u_scale * 0.1);

    float d = -time * u_speed * 0.5;
    float a = 0.0;

    for (float i = 0.0; i < 8.0; ++i) {
        a += cos(i - d - a * centeredUv.x) * dampening;
        d += sin(centeredUv.y * i + a) * dampening;
    }

    d += time * u_speed * 0.5;

    vec3 patterns = vec3(
      cos(centeredUv.x * d + a) * 0.5 + 0.5,
      cos(centeredUv.y * a + d) * 0.5 + 0.5,
      cos((centeredUv.x + centeredUv.y) * (d + a) * 0.5) * 0.5 + 0.5
    );

    vec3 color1Mix = mix(u_color1, u_color2, patterns.x);
    vec3 color2Mix = mix(u_color2, u_color3, patterns.y);
    vec3 color3Mix = mix(u_color3, u_color1, patterns.z);

    vec3 finalColor = mix(color1Mix, color2Mix, patterns.z);
    finalColor = mix(finalColor, color3Mix, patterns.x * 0.5);

    vec3 originalPattern = vec3(cos(centeredUv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
    originalPattern = cos(originalPattern * cos(vec3(d, a, 2.5)) * 0.5 + 0.5);

    return mix(finalColor, originalPattern * finalColor, 0.3);
  }

  vec3 smokeGradient(vec2 uv, float time) {
    float mr = min(u_resolution.x, u_resolution.y);
    vec2 fragCoord = uv * u_resolution;
    vec2 p = (2.0 * fragCoord.xy - u_resolution.xy) / mr;

    p *= u_scale;

    float iTime = time * u_speed;

    for(int i = 1; i < 10; i++) {
      vec2 newp = p;
      float fi = float(i);
      newp.x += 0.6 / fi * sin(fi * p.y + iTime + 0.3 * fi) + 1.0;
      newp.y += 0.6 / fi * sin(fi * p.x + iTime + 0.3 * (fi + 10.0)) - 1.4;
      p = newp;
    }

    float redPattern = 1.0;
    float greenPattern = 1.0 - sin(p.y);
    float bluePattern = sin(p.x + p.y);

    greenPattern = clamp(greenPattern, 0.0, 1.0);
    bluePattern = bluePattern * 0.5 + 0.5;

    vec3 color;

    vec3 color12 = mix(u_color1, u_color2, greenPattern);

    color = mix(color12, u_color3, bluePattern);

    return clamp(color, 0.0, 1.0);
  }

  vec3 stripeGradient(vec2 uv, float time) {
    vec2 p = ((uv * u_resolution * 2.0 - u_resolution.xy) / (u_resolution.x + u_resolution.y) * 2.0) * u_scale;
    float t = time * 0.7, a = 4.0 * p.y - sin(-p.x * 3.0 + p.y - t);
    a = smoothstep(cos(a) * 0.7, sin(a) * 0.7 + 1.0, cos(a - 4.0 * p.y) - sin(a + 3.0 * p.x));

    vec2 warped = (cos(a) * p + sin(a) * vec2(-p.y, p.x)) * 0.5 + 0.5;
    vec3 color = mix(u_color1, u_color2, warped.x);

    color = mix(color, u_color3, warped.y);
    color *= color + 0.6 * sqrt(color);

    return clamp(color, 0.0, 1.0);
  }

  // @Main
  void main() {
    vec2 uv = vUv;
    float time = u_time * u_speed;

    vec3 color;

    if (u_type == 0) {
      color = linearGradient(uv, time);
    } else if (u_type == 1) {
      color = conicGradient(uv, time);
    } else if (u_type == 2) {
      color = animatedGradient(uv, time);
    } else if (u_type == 3) {
      color = waveGradient(uv, time);
    } else if (u_type == 4) {
      color = silkGradient(uv, time);
    } else if (u_type == 5) {
      color = smokeGradient(uv, time);
    } else if (u_type == 6) {
      color = stripeGradient(uv, time);
    } else {
      color = animatedGradient(uv, time);
    }

    if (u_noise > 0.001) {
      float grain = noise(uv * 200.0 + time * 0.1);
      color *= (1.0 - u_noise * 0.4 + u_noise * grain * 0.4);
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;function Be(e){let t=useRef(null),o=useRef(null),r=useRef(null),a=useRef(null),u=useRef(0),i=useMemo(()=>({color1:oe(e.color1),color2:oe(e.color2),color3:oe(e.color3)}),[e.color1,e.color2,e.color3]);return useEffect(()=>{var P;let c=t.current;if(!c)return;let d=new Renderer({canvas:c,dpr:Math.min(window.devicePixelRatio,2),alpha:false,antialias:false,powerPreference:"high-performance"});o.current=d;let f=d.gl,h=new Plane(f,{width:2,height:2}),R=()=>{if(!c.parentElement)return;let G=c.parentElement,v=G.clientWidth,w=G.clientHeight,z=Math.min(window.devicePixelRatio,2);c.width=v*z,c.height=w*z,c.style.width=v+"px",c.style.height=w+"px",d.setSize(v,w),r.current&&(r.current.uniforms.u_resolution.value=[v,w]);},M=new Program(f,{vertex:So,fragment:Io,uniforms:{u_time:{value:0},u_color1:{value:i.color1},u_color2:{value:i.color2},u_color3:{value:i.color3},u_speed:{value:e.speed},u_scale:{value:e.scale},u_type:{value:ee[(P=e.type)!=null?P:"animated"]},u_noise:{value:e.noise},u_resolution:{value:[c.clientWidth,c.clientHeight]}}});r.current=M;let T=new Mesh(f,{geometry:h,program:M});a.current=T;let y=new Transform;T.setParent(y),R(),window.addEventListener("resize",R,{passive:true});let k=performance.now(),A=G=>{let v=(G-k)/1e3;M.uniforms.u_time.value=v,d.render({scene:T}),u.current=requestAnimationFrame(A);};return u.current=requestAnimationFrame(A),()=>{var v,w;cancelAnimationFrame(u.current),window.removeEventListener("resize",R);let G=(v=o.current)==null?void 0:v.gl;(w=r.current)!=null&&w.program&&G&&G.deleteProgram(r.current.program),o.current=null,r.current=null,a.current=null;}},[]),useEffect(()=>{var d;let c=r.current;c&&(c.uniforms.u_color1.value=i.color1,c.uniforms.u_color2.value=i.color2,c.uniforms.u_color3.value=i.color3,c.uniforms.u_speed.value=e.speed,c.uniforms.u_scale.value=e.scale,c.uniforms.u_type.value=ee[(d=e.type)!=null?d:"animated"],c.uniforms.u_noise.value=e.noise);},[e,i]),{canvasRef:t,rendererRef:o,programRef:r,meshRef:a}}function Ve(e){let t=e.replace("#",""),o=parseInt(t,16),r=o>>16&255,a=o>>8&255,u=o&255;return {r,g:a,b:u}}function Co(e){let{r:t,g:o,b:r}=e;return "#"+((1<<24)+(t<<16)+(o<<8)+r).toString(16).slice(1)}function H(e){return typeof e=="string"?Ve(e):e}function de({config:e,className:t=""}){let o=useMemo(()=>{let a=K({},ce);return e&&(e.color1&&(a.color1=H(e.color1)),e.color2&&(a.color2=H(e.color2)),e.color3&&(a.color3=H(e.color3)),e.speed!==void 0&&(a.speed=e.speed),e.scale!==void 0&&(a.scale=e.scale),e.type&&(a.type=e.type),e.noise!==void 0&&(a.noise=e.noise)),a},[e]),{canvasRef:r}=Be(o);return Eo.createElement("canvas",{ref:r,className:Oe("w-full h-full block select-none touch-none",t),"aria-label":"gradflow animated gradient background"})}function re(){return {r:Math.floor(Math.random()*256),g:Math.floor(Math.random()*256),b:Math.floor(Math.random()*256)}}function Fo(){return {color1:re(),color2:re(),color3:re()}}export{ce as DEFAULT_CONFIG,ee as GRADIENT_TYPE_NUMBER,de as GradFlow,Ro as PRESETS,de as default,Fo as generateRandomColors,Ve as hexToRgb,H as normalizeColor,re as randomRGB,Co as rgbToHex};