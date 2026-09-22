(()=>{function y(i="Click Me",e=140,t=44){return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${t}" width="${e}" height="${t}">
  <path d="M 4 5 Q ${e*.45} 3, ${e-5} 4 Q ${e-3} ${t*.5}, ${e-4} ${t-5} Q ${e*.5} ${t-3}, 5 ${t-4} Q 3 ${t*.5}, 4 5 Z" fill="#2d3748" stroke="#cbd5e1" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
  <text x="${e/2}" y="${t/2+5}" text-anchor="middle" font-family="'Comic Sans MS', 'Chalkboard SE', cursive, sans-serif" font-size="14" fill="#f8fafc" font-weight="bold">${i}</text>
</svg>
  `.trim()}function S(i="Enter text...",e=220,t=42){return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${t}" width="${e}" height="${t}">
  <path d="M 3 4 Q ${e*.5} 2, ${e-3} 3 Q ${e-2} ${t*.5}, ${e-4} ${t-3} Q ${e*.5} ${t-2}, 4 ${t-4} Q 2 ${t*.5}, 3 4 Z" fill="#1e293b" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
  <text x="14" y="${t/2+5}" font-family="'Comic Sans MS', 'Chalkboard SE', cursive, sans-serif" font-size="13" fill="#64748b">${i}</text>
</svg>
  `.trim()}function B(i="Remember choice",e=!0){return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 32" width="180" height="32">
  <rect x="3" y="5" width="22" height="22" rx="4" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
  ${e?'<path d="M 6 12 L 11 18 L 18 6" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />':""}
  <text x="34" y="21" font-family="'Comic Sans MS', cursive, sans-serif" font-size="13" fill="#f8fafc">${i}</text>
</svg>
  `.trim()}function E(i="Option choice",e=!0){return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 32" width="180" height="32">
  <circle cx="14" cy="16" r="10" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
  ${e?'<circle cx="14" cy="16" r="5" fill="#38bdf8" />':""}
  <text x="34" y="21" font-family="'Comic Sans MS', cursive, sans-serif" font-size="13" fill="#f8fafc">${i}</text>
</svg>
  `.trim()}function M(i="Enable feature",e=!0){return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 32" width="180" height="32">
  <rect x="4" y="6" width="44" height="20" rx="10" fill="${e?"#2563eb":"#334155"}" stroke="#94a3b8" stroke-width="1.8" />
  <circle cx="${e?36:14}" cy="16" r="7" fill="#f8fafc" stroke="#64748b" stroke-width="1.5" />
  <text x="58" y="21" font-family="'Comic Sans MS', cursive, sans-serif" font-size="13" fill="#f8fafc">${i}</text>
</svg>
  `.trim()}function L(i="Select option...",e=220,t=42){return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${t}" width="${e}" height="${t}">
  <rect x="3" y="4" width="${e-6}" height="${t-8}" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
  <text x="14" y="${t/2+5}" font-family="'Comic Sans MS', cursive, sans-serif" font-size="13" fill="#94a3b8">${i}</text>
  <polyline points="${e-24},${t/2-2} ${e-18},${t/2+4} ${e-12},${t/2-2}" fill="none" stroke="#94a3b8" stroke-width="2" stroke-linecap="round" />
</svg>
  `.trim()}function C(i="Avatar",e=64,t=64){return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${t}" width="${e}" height="${t}">
  <circle cx="${e/2}" cy="${t/2}" r="${e/2-4}" fill="#334155" stroke="#94a3b8" stroke-width="2.5" />
  <circle cx="${e/2}" cy="${t*.4}" r="${e*.18}" fill="#64748b" />
  <path d="M ${e*.22} ${t*.85} C ${e*.25} ${t*.6}, ${e*.75} ${t*.6}, ${e*.78} ${t*.85} Z" fill="#64748b" />
</svg>
  `.trim()}function I(i=3,e=3,t=280,n=140){let r=n/(i+1),o=t/e,c="";c+=`<line x1="4" y1="${r}" x2="${t-4}" y2="${r}" stroke="#64748b" stroke-width="2" />`;for(let l=2;l<=i;l++)c+=`<line x1="4" y1="${l*r}" x2="${t-4}" y2="${l*r}" stroke="#475569" stroke-width="1.5" stroke-dasharray="3,3" />`;for(let l=1;l<e;l++)c+=`<line x1="${l*o}" y1="4" x2="${l*o}" y2="${n-4}" stroke="#475569" stroke-width="1.5" />`;return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${t} ${n}" width="${t}" height="${n}">
  <rect x="3" y="3" width="${t-6}" height="${n-6}" rx="6" fill="#1e293b" stroke="#94a3b8" stroke-width="2" />
  ${c}
  <text x="12" y="${r/2+5}" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f8fafc">Col 1</text>
  <text x="${o+12}" y="${r/2+5}" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f8fafc">Col 2</text>
  <text x="${o*2+12}" y="${r/2+5}" font-family="sans-serif" font-size="11" font-weight="bold" fill="#f8fafc">Col 3</text>
</svg>
  `.trim()}function A(i="Confirm Action",e=280,t=160){return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${t}" width="${e}" height="${t}">
  <path d="M 4 6 Q ${e*.5} 3, ${e-5} 5 Q ${e-3} ${t*.5}, ${e-4} ${t-5} Q ${e*.5} ${t-3}, 5 ${t-4} Q 2 ${t*.5}, 4 6 Z" fill="#1e293b" stroke="#cbd5e1" stroke-width="2.5" />
  <path d="M 6 36 Q ${e*.5} 34, ${e-6} 36" stroke="#475569" stroke-width="2" stroke-linecap="round" />
  <text x="16" y="24" font-family="'Comic Sans MS', cursive, sans-serif" font-size="14" font-weight="bold" fill="#f8fafc">${i}</text>
  <text x="16" y="70" font-family="'Comic Sans MS', cursive, sans-serif" font-size="12" fill="#94a3b8">Are you sure you want to proceed?</text>
  <path d="M 140 115 L 200 114 L 199 142 L 139 143 Z" fill="#334155" stroke="#94a3b8" stroke-width="1.8" />
  <text x="170" y="133" text-anchor="middle" font-family="'Comic Sans MS', cursive, sans-serif" font-size="11" fill="#f8fafc">Cancel</text>
  <path d="M 210 115 L 265 114 L 264 142 L 209 143 Z" fill="#38bdf8" stroke="#cbd5e1" stroke-width="1.8" />
  <text x="237" y="133" text-anchor="middle" font-family="'Comic Sans MS', cursive, sans-serif" font-size="11" fill="#0f172a" font-weight="bold">OK</text>
</svg>
  `.trim()}function h(i=240,e=440){return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${i} ${e}" width="${i}" height="${e}">
  <!-- Outer Shell -->
  <rect x="4" y="4" width="${i-8}" height="${e-8}" rx="28" fill="#0f172a" stroke="#64748b" stroke-width="3" />
  <!-- Screen Area -->
  <rect x="12" y="16" width="${i-24}" height="${e-32}" rx="20" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
  <!-- Dynamic Island / Speaker notch -->
  <rect x="${i/2-30}" y="24" width="60" height="12" rx="6" fill="#090d16" />
  <!-- Home Indicator bar -->
  <rect x="${i/2-36}" y="${e-26}" width="72" height="4" rx="2" fill="#475569" />
</svg>
  `.trim()}function w(i="Screen Title",e=240,t=52){return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${e} ${t}" width="${e}" height="${t}">
  <rect x="2" y="2" width="${e-4}" height="${t-4}" rx="6" fill="#1e293b" stroke="#475569" stroke-width="1.8" />
  <!-- Back Arrow icon -->
  <polyline points="22,${t/2-6} 14,${t/2} 22,${t/2+6}" fill="none" stroke="#f8fafc" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
  <!-- Title -->
  <text x="36" y="${t/2+5}" font-family="sans-serif" font-size="14" font-weight="bold" fill="#f8fafc">${i}</text>
  <!-- More menu dots -->
  <circle cx="${e-18}" cy="${t/2}" r="2" fill="#94a3b8" />
  <circle cx="${e-24}" cy="${t/2}" r="2" fill="#94a3b8" />
  <circle cx="${e-30}" cy="${t/2}" r="2" fill="#94a3b8" />
</svg>
  `.trim()}function x(i=240,e=56){let t=i/4;return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${i} ${e}" width="${i}" height="${e}">
  <rect x="2" y="2" width="${i-4}" height="${e-4}" rx="6" fill="#0f172a" stroke="#334155" stroke-width="1.8" />
  <!-- Item 1 (Active) -->
  <circle cx="${t*.5}" cy="${e/2-4}" r="8" fill="#38bdf8" />
  <text x="${t*.5}" y="${e-10}" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#38bdf8" font-weight="bold">Home</text>
  <!-- Item 2 -->
  <circle cx="${t*1.5}" cy="${e/2-4}" r="7" fill="none" stroke="#64748b" stroke-width="1.5" />
  <text x="${t*1.5}" y="${e-10}" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#64748b">Search</text>
  <!-- Item 3 -->
  <circle cx="${t*2.5}" cy="${e/2-4}" r="7" fill="none" stroke="#64748b" stroke-width="1.5" />
  <text x="${t*2.5}" y="${e-10}" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#64748b">Activity</text>
  <!-- Item 4 -->
  <circle cx="${t*3.5}" cy="${e/2-4}" r="7" fill="none" stroke="#64748b" stroke-width="1.5" />
  <text x="${t*3.5}" y="${e-10}" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#64748b">Profile</text>
</svg>
  `.trim()}function a(i,e="Step"){return i==="decision"?`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="160" height="80">
  <polygon points="${160/2},4 156,${80/2} ${160/2},76 4,${80/2}" fill="#1e293b" stroke="#f59e0b" stroke-width="2.5" />
  <text x="${160/2}" y="${80/2+4}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">${e}?</text>
</svg>
    `.trim():i==="terminal"?`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="160" height="80">
  <rect x="4" y="8" width="152" height="64" rx="32" fill="#1e293b" stroke="#10b981" stroke-width="2.5" />
  <text x="${160/2}" y="${80/2+5}" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f8fafc">${e}</text>
</svg>
    `.trim():i==="database"?`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="160" height="80">
  <path d="M 10 20 C 10 10, 150 10, 150 20 L 150 60 C 150 70, 10 70, 10 60 Z" fill="#1e293b" stroke="#818cf8" stroke-width="2.5" />
  <ellipse cx="${160/2}" cy="20" rx="${140/2}" ry="10" fill="#334155" stroke="#818cf8" stroke-width="2.5" />
  <text x="${160/2}" y="${80/2+10}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">${e}</text>
</svg>
    `.trim():i==="cloud"?`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="160" height="80">
  <path d="M 30 55 A 18 18 0 0 1 35 25 A 25 25 0 0 1 80 18 A 28 28 0 0 1 130 28 A 18 18 0 0 1 135 55 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5" stroke-linejoin="round" />
  <text x="${160/2}" y="${80/2+8}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">${e}</text>
</svg>
    `.trim():i==="io"?`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="160" height="80">
  <polygon points="24,8 152,8 136,72 8,72" fill="#1e293b" stroke="#a855f7" stroke-width="2.5" />
  <text x="${160/2}" y="${80/2+5}" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f8fafc">${e}</text>
</svg>
    `.trim():i==="actor"?`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 120" width="80" height="120">
  <circle cx="40" cy="20" r="14" fill="#1e293b" stroke="#f8fafc" stroke-width="2.5" />
  <line x1="40" y1="34" x2="40" y2="76" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round" />
  <line x1="16" y1="48" x2="64" y2="48" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round" />
  <line x1="40" y1="76" x2="20" y2="110" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round" />
  <line x1="40" y1="76" x2="60" y2="110" stroke="#f8fafc" stroke-width="2.5" stroke-linecap="round" />
  <text x="40" y="118" text-anchor="middle" font-family="sans-serif" font-size="9" fill="#94a3b8">${e}</text>
</svg>
    `.trim():`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 80" width="160" height="80">
  <rect x="4" y="8" width="152" height="64" rx="8" fill="#1e293b" stroke="#38bdf8" stroke-width="2.5" />
  <text x="${160/2}" y="${80/2+5}" text-anchor="middle" font-family="sans-serif" font-size="13" font-weight="bold" fill="#f8fafc">${e}</text>
</svg>
    `.trim()}function p(i=20,e=20,t=220,n=140,r="orthogonal"){let o=Math.min(i,t)-30,c=Math.min(e,n)-30,l=Math.max(i,t)+30,g=Math.max(e,n)+30,k=Math.max(l-o,40),b=Math.max(g-c,40),v="";if(r==="orthogonal"){let d=(i+t)/2;v=`M ${i} ${e} L ${d} ${e} L ${d} ${n} L ${t} ${n}`}else{let d=(t-i)/2;v=`M ${i} ${e} C ${i+d} ${e}, ${t-d} ${n}, ${t} ${n}`}return`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${o} ${c} ${k} ${b}" width="${k}" height="${b}">
  <defs>
    <marker id="pencil-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
    </marker>
  </defs>
  <path d="${v}" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#pencil-arrow)" />
  <circle cx="${i}" cy="${e}" r="4" fill="#38bdf8" />
</svg>
  `.trim()}var $="general",m=0,f=document.getElementById("stencils-container");document.querySelectorAll(".tab-btn").forEach(i=>{i.addEventListener("click",()=>{document.querySelectorAll(".tab-btn").forEach(e=>e.classList.remove("active")),i.classList.add("active"),$=i.dataset.category||"general",u()})});function s(i,e){parent.postMessage({type:"insert-stencil",content:{name:i,svg:e}},"*")}function z(i){parent.postMessage({type:"insert-connector",content:{connectorType:i}},"*")}function u(){if(f)if($==="general"){let i=y("Action Button"),e=S("Enter search term..."),t=B("Accept terms",!0),n=E("Default option",!0),r=M("Notifications",!0),o=L("Select country..."),c=C("Avatar",64,64),l=I(3,3,220,100),g=A("Confirm Submission");f.innerHTML=`
      <div class="stencil-item" id="item-btn">
        <div class="stencil-preview">${i}</div>
        <span class="stencil-title">Button</span>
      </div>
      <div class="stencil-item" id="item-input">
        <div class="stencil-preview">${e}</div>
        <span class="stencil-title">Text Input</span>
      </div>
      <div class="stencil-item" id="item-check">
        <div class="stencil-preview">${t}</div>
        <span class="stencil-title">Checkbox</span>
      </div>
      <div class="stencil-item" id="item-radio">
        <div class="stencil-preview">${n}</div>
        <span class="stencil-title">Radio</span>
      </div>
      <div class="stencil-item" id="item-toggle">
        <div class="stencil-preview">${r}</div>
        <span class="stencil-title">Toggle Switch</span>
      </div>
      <div class="stencil-item" id="item-drop">
        <div class="stencil-preview">${o}</div>
        <span class="stencil-title">Dropdown</span>
      </div>
      <div class="stencil-item" id="item-avatar">
        <div class="stencil-preview">${c}</div>
        <span class="stencil-title">Avatar</span>
      </div>
      <div class="stencil-item" id="item-table">
        <div class="stencil-preview">${l}</div>
        <span class="stencil-title">Data Table</span>
      </div>
      <div class="stencil-item" id="item-dialog" style="grid-column: span 2;">
        <div class="stencil-preview" style="height: 110px;">${g}</div>
        <span class="stencil-title">Modal Dialog</span>
      </div>
    `,document.getElementById("item-btn")?.addEventListener("click",()=>s("Wireframe Button",i)),document.getElementById("item-input")?.addEventListener("click",()=>s("Wireframe Input",e)),document.getElementById("item-check")?.addEventListener("click",()=>s("Wireframe Checkbox",t)),document.getElementById("item-radio")?.addEventListener("click",()=>s("Wireframe Radio",n)),document.getElementById("item-toggle")?.addEventListener("click",()=>s("Wireframe Toggle",r)),document.getElementById("item-drop")?.addEventListener("click",()=>s("Wireframe Dropdown",o)),document.getElementById("item-avatar")?.addEventListener("click",()=>s("Wireframe Avatar",c)),document.getElementById("item-table")?.addEventListener("click",()=>s("Wireframe Table",l)),document.getElementById("item-dialog")?.addEventListener("click",()=>s("Wireframe Dialog",g))}else if($==="mobile"){let i=h(140,220),e=w("Dashboard",200,48),t=x(200,48);f.innerHTML=`
      <div class="stencil-item" id="item-phone" style="grid-column: span 2;">
        <div class="stencil-preview" style="height: 180px;">${i}</div>
        <span class="stencil-title">Mobile Phone Frame</span>
      </div>
      <div class="stencil-item" id="item-appbar" style="grid-column: span 2;">
        <div class="stencil-preview" style="height: 60px;">${e}</div>
        <span class="stencil-title">Mobile App Bar</span>
      </div>
      <div class="stencil-item" id="item-bottomnav" style="grid-column: span 2;">
        <div class="stencil-preview" style="height: 60px;">${t}</div>
        <span class="stencil-title">Bottom Navigation Bar</span>
      </div>
    `,document.getElementById("item-phone")?.addEventListener("click",()=>s("Mobile Phone Frame",h(320,640))),document.getElementById("item-appbar")?.addEventListener("click",()=>s("Mobile App Bar",w("Dashboard",320,56))),document.getElementById("item-bottomnav")?.addEventListener("click",()=>s("Mobile Bottom Nav",x(320,60)))}else if($==="flowchart"){let i=a("process","Action"),e=a("decision","Evaluate"),t=a("terminal","Start/End"),n=a("database","Database"),r=a("cloud","Cloud API"),o=a("io","Input/Output"),c=a("actor","User Actor");f.innerHTML=`
      <div class="stencil-item" id="item-proc">
        <div class="stencil-preview">${i}</div>
        <span class="stencil-title">Process</span>
      </div>
      <div class="stencil-item" id="item-dec">
        <div class="stencil-preview">${e}</div>
        <span class="stencil-title">Decision</span>
      </div>
      <div class="stencil-item" id="item-term">
        <div class="stencil-preview">${t}</div>
        <span class="stencil-title">Terminal</span>
      </div>
      <div class="stencil-item" id="item-db">
        <div class="stencil-preview">${n}</div>
        <span class="stencil-title">Database</span>
      </div>
      <div class="stencil-item" id="item-cloud">
        <div class="stencil-preview">${r}</div>
        <span class="stencil-title">Cloud System</span>
      </div>
      <div class="stencil-item" id="item-io">
        <div class="stencil-preview">${o}</div>
        <span class="stencil-title">I/O Data</span>
      </div>
      <div class="stencil-item" id="item-actor">
        <div class="stencil-preview" style="height: 70px;">${c}</div>
        <span class="stencil-title">Actor / Person</span>
      </div>
    `,document.getElementById("item-proc")?.addEventListener("click",()=>s("Flowchart Process",i)),document.getElementById("item-dec")?.addEventListener("click",()=>s("Flowchart Decision",e)),document.getElementById("item-term")?.addEventListener("click",()=>s("Flowchart Terminal",t)),document.getElementById("item-db")?.addEventListener("click",()=>s("Flowchart Database",n)),document.getElementById("item-cloud")?.addEventListener("click",()=>s("Flowchart Cloud",r)),document.getElementById("item-io")?.addEventListener("click",()=>s("Flowchart I/O",o)),document.getElementById("item-actor")?.addEventListener("click",()=>s("Flowchart Actor",c))}else{let i=p(10,10,180,80,"orthogonal"),e=p(10,10,180,80,"curved"),t=m>=2?`<span style="color: #10b981; font-weight: 700;">${m} shapes selected</span>: Click below to dynamically link them!`:'<span style="color: #94a3b8;">Select 2 shapes on canvas to connect them dynamically, or insert standalone:</span>';f.innerHTML=`
      <div style="grid-column: span 2; padding: 6px 4px; font-size: 11px;">
        ${t}
      </div>
      <div class="stencil-item" id="item-ortho">
        <div class="stencil-preview">${i}</div>
        <span class="stencil-title">Orthogonal ${m>=2?"(Connect Selected)":""}</span>
      </div>
      <div class="stencil-item" id="item-curved">
        <div class="stencil-preview">${e}</div>
        <span class="stencil-title">Curved Bezier ${m>=2?"(Connect Selected)":""}</span>
      </div>
    `,document.getElementById("item-ortho")?.addEventListener("click",()=>z("orthogonal")),document.getElementById("item-curved")?.addEventListener("click",()=>z("curved"))}}window.addEventListener("message",i=>{i.data?.type==="selection-info"&&(m=i.data.content?.count||0,$==="connectors"&&u())});parent.postMessage({type:"request-selection"},"*");u();})();
