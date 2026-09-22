(()=>{function v(e,t){let{width:n,height:r,radius:c,opacity:m}=t,l="";return e.forEach((o,a)=>{let s=c*(.8+o.weight*.6),i=`pt-grad-${a}`;l+=`
      <defs>
        <radialGradient id="${i}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ef4444" stop-opacity="${(o.weight*.85).toFixed(2)}" />
          <stop offset="35%" stop-color="#f59e0b" stop-opacity="${(o.weight*.6).toFixed(2)}" />
          <stop offset="65%" stop-color="#10b981" stop-opacity="${(o.weight*.35).toFixed(2)}" />
          <stop offset="100%" stop-color="#3b82f6" stop-opacity="0" />
        </radialGradient>
      </defs>
      <circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${s.toFixed(1)}" fill="url(#${i})" />
    `}),`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${r}" width="${n}" height="${r}" style="opacity: ${m}; pointer-events: none;">
  <g id="quantux-heatmap-overlay">
    ${l}
  </g>
</svg>
  `.trim()}function g(e,t,n=35){let r=[],c=e*.5,m=t*.65,l=e*.85,o=t*.08;for(let a=0;a<n;a++){let s=Math.random(),i=0,d=0;s<.6?(i=c+(Math.random()-.5)*(e*.25),d=m+(Math.random()-.5)*(t*.12)):s<.85?(i=l+(Math.random()-.5)*(e*.2),d=o+(Math.random()-.5)*(t*.08)):(i=Math.random()*e,d=Math.random()*t),r.push({x:Math.max(10,Math.min(e-10,i)),y:Math.max(10,Math.min(t-10,d)),weight:.4+Math.random()*.6,type:s>=.85?"dead_click":"click"})}return r}function f(e){let t=[],n=e.length>0?e[0].visitors:0,r=-1,c="None";for(let o=0;o<e.length;o++){let a=e[o],s=o+1<e.length?e[o+1].visitors:a.visitors,i=a.visitors-s,d=n>0?a.visitors/n*100:0;i>r&&(r=i,c=a.name),t.push({stepIndex:o+1,name:a.name,screenName:a.screenName,visitors:a.visitors,dropOffs:i,conversionRate:Math.round(d*10)/10,avgTimeSeconds:a.avgTimeSeconds})}let m=t.length>0?t[t.length-1].visitors:0,l=n>0?m/n*100:0;return{totalStarted:n,totalCompleted:m,overallConversionRate:Math.round(l*10)/10,bottleneckStep:c,steps:t}}var h="tab-heatmaps",u="",b=document.getElementById("heatmap-preview-container"),p=document.getElementById("btn-overlay-heatmap"),y=document.getElementById("funnel-steps-container");document.querySelectorAll(".tab-btn").forEach(e=>{e.addEventListener("click",()=>{document.querySelectorAll(".tab-btn").forEach(n=>n.classList.remove("active")),document.querySelectorAll(".tab-content").forEach(n=>n.classList.remove("active")),e.classList.add("active"),h=e.dataset.tab||"tab-heatmaps";let t=document.getElementById(h);t&&t.classList.add("active")})});function x(){let n=g(360,180,40);u=v(n,{width:360,height:180,radius:28,opacity:.85,colorTheme:"thermal"}),b&&(b.innerHTML=u)}function S(){let e=f([{name:"1. Landing Screen",screenName:"Home",visitors:1240,avgTimeSeconds:8.2},{name:"2. Pricing Selection",screenName:"Pricing",visitors:980,avgTimeSeconds:15.4},{name:"3. Registration Form",screenName:"Sign Up",visitors:820,avgTimeSeconds:22.1},{name:"4. Checkout Complete",screenName:"Success",visitors:762,avgTimeSeconds:11}]);y&&(y.innerHTML=e.steps.map(t=>`
        <div class="funnel-step-bar">
          <span>${t.name}</span>
          <span style="font-weight: 700; color: #38bdf8;">${t.visitors} (${t.conversionRate}%)</span>
        </div>
      `).join(""))}p.addEventListener("click",()=>{if(!u)return;parent.postMessage({type:"overlay-heatmap",content:{svg:u,boardName:"Demo Preview Usability Heatmap"}},"*");let e=p.textContent;p.textContent="Demo Heatmap Overlaid on Canvas!",setTimeout(()=>{p.textContent=e},1400)});x();S();})();
