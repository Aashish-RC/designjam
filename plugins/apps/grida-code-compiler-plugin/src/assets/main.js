(()=>{function w(t){let e=F(t.name||"Component"),i=T(t,2);return`import React from 'react';

export interface ${e}Props {
  className?: string;
  children?: React.ReactNode;
}

export const ${e}: React.FC<${e}Props> = ({
  className = '',
  children,
}) => {
  return (
${i}
  );
};

export default ${e};
`}function T(t,e){let i=" ".repeat(e*2),n=[],r=R(t);if((t.layoutMode==="flex"||t.flexDirection)&&(n.push("flex"),t.flexDirection==="column"?n.push("flex-col"):n.push("flex-row"),t.justifyContent==="center"?n.push("justify-center"):t.justifyContent==="space-between"||t.justifyContent==="between"?n.push("justify-between"):t.justifyContent==="flex-end"||t.justifyContent==="end"?n.push("justify-end"):(t.justifyContent==="flex-start"||t.justifyContent==="start")&&n.push("justify-start"),t.alignItems==="center"?n.push("items-center"):t.alignItems==="flex-start"||t.alignItems==="start"?n.push("items-start"):t.alignItems==="flex-end"||t.alignItems==="end"?n.push("items-end"):t.alignItems==="stretch"&&n.push("items-stretch"),t.gap&&n.push(u("gap",t.gap))),t.paddingTop||t.paddingRight||t.paddingBottom||t.paddingLeft){let s=t.paddingTop||0,a=t.paddingRight||0,o=t.paddingBottom||0,c=t.paddingLeft||0;s===o&&c===a&&s===c&&s>0?n.push(u("p",s)):(s===o&&s>0?n.push(u("py",s)):(s&&n.push(u("pt",s)),o&&n.push(u("pb",o))),c===a&&c>0?n.push(u("px",c)):(c&&n.push(u("pl",c)),a&&n.push(u("pr",a))))}t.width&&(!t.layoutMode||r==="button"||r==="input"||r==="img")&&n.push(u("w",Math.round(t.width))),t.height&&(!t.layoutMode||r==="button"||r==="input"||r==="img")&&n.push(u("h",Math.round(t.height))),t.backgroundColor&&n.push(g("bg",t.backgroundColor)),t.borderRadius&&n.push(I(t.borderRadius)),t.borderWidth&&t.borderColor&&(n.push(t.borderWidth===1?"border":`border-[${t.borderWidth}px]`),n.push(g("border",t.borderColor))),t.type==="text"&&(t.textColor&&n.push(g("text",t.textColor)),t.fontSize&&n.push(A(t.fontSize)),t.fontWeight&&n.push(B(t.fontWeight))),t.opacity!==void 0&&t.opacity<1&&t.opacity>=0&&n.push(`opacity-${Math.round(t.opacity*100)}`),t.shadow&&n.push(t.shadow);let l=n.length>0?` className="${n.join(" ")}"`:"";if(t.type==="text"){let s=t.textContent||"Text";return`${i}<${r}${l}>${h(s)}</${r}>`}if(r==="input"){let s=t.textContent||t.name||"Enter value...";return`${i}<input type="text" placeholder="${h(s)}"${l} />`}if(r==="img")return`${i}<img src="https://via.placeholder.com/${Math.round(t.width||100)}x${Math.round(t.height||100)}" alt="${h(t.name)}"${l} />`;if(t.children&&t.children.length>0){let s=t.children.map(a=>T(a,e+1)).join(`
`);return`${i}<${r}${l}>
${s}
${i}</${r}>`}return`${i}<${r}${l} />`}function R(t){let e=(t.name||"").toLowerCase();return t.type==="text"?e.includes("h1")||e.includes("hero")?"h1":e.includes("subtitle")||e.includes("subheading")||e.includes("h3")?"h3":e.includes("h2")||e.includes("title")||e.includes("heading")?"h2":"p":e.includes("button")||e.includes("btn")||e.includes("cta")?"button":e.includes("input")||e.includes("textfield")||e.includes("textbox")?"input":e.includes("avatar")||e.includes("image")||e.includes("icon")?"div":e.includes("nav")||e.includes("navbar")||e.includes("header")?"nav":e.includes("form")?"form":"div"}function u(t,e){let i={0:"0",2:"0.5",4:"1",6:"1.5",8:"2",10:"2.5",12:"3",14:"3.5",16:"4",20:"5",24:"6",28:"7",32:"8",36:"9",40:"10",44:"11",48:"12",56:"14",64:"16",72:"18",80:"20",96:"24"};return i[e]?`${t}-${i[e]}`:`${t}-[${e}px]`}function A(t){let e=Math.round(t);return e<=12?"text-xs":e<=14?"text-sm":e<=16?"text-base":e<=18?"text-lg":e<=20?"text-xl":e<=24?"text-2xl":e<=30?"text-3xl":e<=36?"text-4xl":`text-[${e}px]`}function B(t){let e=String(t).toLowerCase();return e==="400"||e==="normal"||e==="regular"?"font-normal":e==="500"||e==="medium"?"font-medium":e==="600"||e==="semibold"?"font-semibold":e==="700"||e==="bold"?"font-bold":e==="800"||e==="extrabold"?"font-extrabold":e==="900"||e==="black"?"font-black":"font-normal"}function I(t){return t<=2?"rounded-sm":t<=4?"rounded":t<=6?"rounded-md":t<=8?"rounded-lg":t<=12?"rounded-xl":t<=16?"rounded-2xl":t>=999?"rounded-full":`rounded-[${t}px]`}function g(t,e){let i=e.toLowerCase().trim(),n={"#ffffff":`${t}-white`,"#000000":`${t}-black`,"#f8fafc":`${t}-slate-50`,"#f1f5f9":`${t}-slate-100`,"#e2e8f0":`${t}-slate-200`,"#94a3b8":`${t}-slate-400`,"#64748b":`${t}-slate-500`,"#475569":`${t}-slate-600`,"#334155":`${t}-slate-700`,"#1e293b":`${t}-slate-800`,"#0f172a":`${t}-slate-900`,"#020617":`${t}-slate-950`,"#3b82f6":`${t}-blue-500`,"#2563eb":`${t}-blue-600`,"#1d4ed8":`${t}-blue-700`,"#10b981":`${t}-emerald-500`,"#ef4444":`${t}-red-500`,"#f59e0b":`${t}-amber-500`};return n[i]?n[i]:`${t}-[${e}]`}function F(t){return t.replace(/[^a-zA-Z0-9]/g," ").trim().split(/\s+/).map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join("")||"CustomComponent"}function h(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function L(t){let e=k(t.name||"CustomWidget"),i=v(t,2);return`import 'package:flutter/material.dart';

class ${e} extends StatelessWidget {
  const ${e}({super.key});

  @override
  Widget build(BuildContext context) {
    return ${i};
  }
}
`}function v(t,e){let i=" ".repeat(e*2);if(t.type==="text"){let a=(t.textContent||"Text").replace(/'/g,"\\'"),o=[];t.textColor&&o.push(`color: ${$(t.textColor)}`),t.fontSize&&o.push(`fontSize: ${Math.round(t.fontSize)}.0`),t.fontWeight&&(t.fontWeight==="700"||t.fontWeight===700||t.fontWeight==="bold"?o.push("fontWeight: FontWeight.bold"):t.fontWeight==="600"||t.fontWeight===600||t.fontWeight==="semibold"?o.push("fontWeight: FontWeight.w600"):(t.fontWeight==="500"||t.fontWeight===500)&&o.push("fontWeight: FontWeight.w500"));let c=o.length>0?`, style: TextStyle(${o.join(", ")})`:"";return`Text('${a}'${c})`}let n="";if(t.children&&t.children.length>0){let o=t.flexDirection==="column"?"Column":"Row",c=t.children.map(E=>`${i}    ${v(E,e+2)},`).join(`
`),m=[];t.justifyContent==="center"?m.push("mainAxisAlignment: MainAxisAlignment.center"):t.justifyContent==="space-between"&&m.push("mainAxisAlignment: MainAxisAlignment.spaceBetween"),t.alignItems==="center"&&m.push("crossAxisAlignment: CrossAxisAlignment.center");let M=m.length>0?`${m.join(", ")}, `:"";n=`
${i}  child: ${o}(
${i}    ${M}children: [
${c}
${i}    ],
${i}  ),`}let r=[];t.backgroundColor&&r.push(`color: ${$(t.backgroundColor)}`),t.borderRadius&&r.push(`borderRadius: BorderRadius.circular(${t.borderRadius}.0)`),t.borderWidth&&t.borderColor&&r.push(`border: Border.all(color: ${$(t.borderColor)}, width: ${t.borderWidth}.0)`);let l=[];if(t.width&&!t.layoutMode&&l.push(`width: ${Math.round(t.width)}.0`),t.height&&!t.layoutMode&&l.push(`height: ${Math.round(t.height)}.0`),t.paddingTop||t.paddingRight||t.paddingBottom||t.paddingLeft){let a=t.paddingTop||0;l.push(`padding: const EdgeInsets.all(${a}.0)`)}return r.length>0&&l.push(`decoration: BoxDecoration(${r.join(", ")})`),`Container(${l.length>0?`
${i}  ${l.join(`,
${i}  `)},`:""}${n}
${i})`}function $(t){let e=t.replace("#","");return e.length===6?`const Color(0xFF${e.toUpperCase()})`:`const Color(0xFF${e.toUpperCase()})`}function k(t){return t.replace(/[^a-zA-Z0-9]/g," ").trim().split(/\s+/).map(n=>n.charAt(0).toUpperCase()+n.slice(1)).join("")||"CustomWidget"}function S(t){return`<script lang="ts">
  // Generated Svelte Component: ${t.name||"Component"}
  let { class: className = '' } = $props();
<\/script>

<div class="component-root {className}">
  ${W(t,1)}
</div>

<style>
  /* Optional scoped overrides */
</style>
`}function W(t,e){let i="  ".repeat(e);if(t.type==="text")return`${i}<p style="color: ${t.textColor||"#fff"}; font-size: ${t.fontSize||14}px;">${t.textContent||""}</p>`;if(t.children&&t.children.length>0){let n=t.children.map(r=>W(r,e+1)).join(`
`);return`${i}<div style="display: flex; flex-direction: ${t.flexDirection||"column"}; gap: ${t.gap||0}px;">
${n}
${i}</div>`}return`${i}<div />`}var C="react-tailwind",p=null,f="",N=document.getElementById("code-output"),z=document.getElementById("node-info"),d=document.getElementById("btn-copy");document.querySelectorAll(".nav-btn").forEach(t=>{t.addEventListener("click",()=>{document.querySelectorAll(".nav-btn").forEach(e=>e.classList.remove("active")),t.classList.add("active"),C=t.dataset.framework||"react-tailwind",j()})});function j(){if(!p){N.textContent="// Select a layer or artboard on the canvas to inspect code";return}z.textContent=`Target: ${p.name} (${p.type})`,C==="react-tailwind"?f=w(p):C==="flutter"?f=L(p):f=S(p),N.textContent=f}d.addEventListener("click",async()=>{if(f)try{await navigator.clipboard.writeText(f);let t=d.textContent;d.textContent="Copied to Clipboard!",setTimeout(()=>{d.textContent=t},1200)}catch(t){console.error("Failed to copy code:",t)}});var x=document.getElementById("selection-status"),y=document.getElementById("status-badge"),b=document.getElementById("status-text");window.addEventListener("message",t=>{if(t.data?.type==="selection-change"){p=t.data.content?.selectedNode||null;let e=!!t.data.content?.isSample;x&&y&&b&&(e?(x.classList.remove("live"),y.textContent="Preview",b.textContent="No shape selected \u2014 displaying sample. Select any frame or layer to compile."):(x.classList.add("live"),y.textContent="Canvas",b.textContent=`Compiling live selection: ${p?.name||"Selected Layer"}`)),j()}});parent.postMessage({type:"request-selection"},"*");})();
