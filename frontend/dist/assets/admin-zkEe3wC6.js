import"./modulepreload-polyfill-B5Qt9EMX.js";import{a as I,b as C,c as D,d as S,e as T,f as _,h as B,i as P,j,k as N,l as H,m as R}from"./api-DVuG3n_9.js";import{t as m}from"./translations-g1k9azl_.js";import{t as d}from"./toast-Cexsccug.js";class z{constructor(){this.state=JSON.parse(localStorage.getItem("adminSettings"))||{emailNotifications:!0,compactView:!1,autoLogout:!0}}render(){const e=JSON.parse(localStorage.getItem("user"))||{},t=e.first_name||"",a=e.last_name||"",s=e.email||"",o=m[window.app?.language||"en"]?.admin||m.en.admin;return`
      <div class="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
        <div class="flex justify-between items-center border-b border-gray-700 pb-6">
          <div>
            <h2 class="text-2xl font-bold text-cyan-400">${o.settings}</h2>
            <p class="text-gray-400 text-sm mt-1">Manage your account and system preferences</p>
          </div>
          <button id="save-settings-btn" class="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium transition shadow-lg shadow-cyan-500/20 flex items-center">
            ${o.save_changes}
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <div class="lg:col-span-2 space-y-8">
            
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 shadow-lg">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                <svg class="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                Profile Information
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="text-sm text-gray-500 dark:text-gray-400">First Name</label>
                  <input type="text" id="set-firstname" value="${t}" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none transition">
                </div>
                <div class="space-y-2">
                  <label class="text-sm text-gray-500 dark:text-gray-400">Last Name</label>
                  <input type="text" id="set-lastname" value="${a}" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none transition">
                </div>
                <div class="space-y-2 md:col-span-2">
                  <label class="text-sm text-gray-500 dark:text-gray-400">Email Address</label>
                  <input type="email" id="set-email" value="${s}" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none transition">
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700/50 p-6 shadow-lg">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center">
                <svg class="w-5 h-5 mr-2 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Security
              </h3>
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="text-sm text-gray-500 dark:text-gray-400">Current Password</label>
                  <input type="password" id="current-password" placeholder="••••••••" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none transition">
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-sm text-gray-500 dark:text-gray-400">New Password</label>
                    <input type="password" id="new-password" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none transition">
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm text-gray-500 dark:text-gray-400">Confirm New Password</label>
                    <input type="password" id="confirm-password" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg p-2.5 focus:ring-2 focus:ring-cyan-500 outline-none transition">
                  </div>
                </div>
                <p id="password-msg" class="text-sm hidden"></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    `}attachEvents(){const e=document.getElementById("save-settings-btn");e?e.addEventListener("click",()=>this.save()):console.error("Save button not found in DOM")}async save(){const e=document.getElementById("save-settings-btn"),t=document.getElementById("password-msg");t.className="hidden";const a=JSON.parse(localStorage.getItem("user")),s=localStorage.getItem("token"),o=document.getElementById("set-firstname").value,n=document.getElementById("set-lastname").value,r=document.getElementById("set-email").value;if(o||n||r){const i=e.innerHTML;e.innerHTML='<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{const y=await(await fetch("/api/auth/update-profile",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({userId:a.id,firstName:o,lastName:n,email:r})})).json()}catch(g){console.error(g)}finally{e.innerHTML=i}}a.first_name=o,a.last_name=n,a.email=r,localStorage.setItem("user",JSON.stringify(a)),localStorage.setItem("adminSettings",JSON.stringify(this.state)),window.app.updateUserInfo();const l=document.getElementById("current-password").value,c=document.getElementById("new-password").value,u=document.getElementById("confirm-password").value;if(c||u||l){const i=e.innerHTML;e.innerHTML='<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>';try{const y=await(await fetch("/api/auth/update-password",{method:"PUT",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`},body:JSON.stringify({userId:a.id,currentPassword:l,newPassword:c})})).json();y.success?(document.getElementById("current-password").value="",document.getElementById("new-password").value="",document.getElementById("confirm-password").value="",t.textContent="Password updated successfully in Database!",t.className="text-sm text-green-400 block mt-2"):this.showError(t,y.error||"Failed to update password")}catch(g){console.error(g),this.showError(t,"Server connection failed")}finally{e.innerHTML=i}}e.innerHTML='<span class="text-green-300">Saved!</span>',e.classList.add("border-green-500","bg-green-900/20"),setTimeout(()=>{e.innerHTML="Save Changes",e.classList.remove("border-green-500","bg-green-900/20")},2e3)}showError(e,t){e.textContent=t,e.className="text-sm text-red-400 block mt-2"}}class A{render(){return`
      <div class="p-8 space-y-8">
        <h2 class="text-2xl font-bold text-cyan-400">${(m[window.app?.language||"en"]?.admin||m.en.admin).advanced_analytics}</h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          
          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-xl min-h-[500px] flex flex-col">
            <h3 class="text-gray-700 dark:text-gray-300 font-semibold mb-4 flex-shrink-0">Top 10 Customers</h3>
            <div class="flex-grow relative w-full h-full">
               <div id="plotCustomers" class="absolute inset-0 w-full h-full"></div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-xl min-h-[500px] flex flex-col">
            <h3 class="text-gray-700 dark:text-gray-300 font-semibold mb-4 flex-shrink-0">Top 5 Rented Models</h3>
            <div class="flex-grow relative w-full h-full">
               <div id="plotTopCars" class="absolute inset-0 w-full h-full"></div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-xl lg:col-span-2 min-h-[600px] flex flex-col w-full">
            <h3 class="text-gray-700 dark:text-gray-300 font-semibold mb-4 flex-shrink-0">Monthly Revenue Flow</h3>
            <div class="flex-grow relative w-full h-full">
               <div id="plotRevenue" class="absolute inset-0 w-full h-full"></div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-xl min-h-[500px] flex flex-col">
            <h3 class="text-gray-700 dark:text-gray-300 font-semibold mb-4 flex-shrink-0">Avg Rental Duration (Weeks)</h3>
            <div class="flex-grow relative w-full h-full">
               <div id="plotDuration" class="absolute inset-0 w-full h-full"></div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-xl min-h-[400px] flex flex-col">
            <h3 class="text-gray-700 dark:text-gray-300 font-semibold mb-4 flex-shrink-0">Fleet Availability</h3>
            <div class="flex-grow relative w-full h-full">
               <div id="plotFleetStatus" class="absolute inset-0 w-full h-full"></div>
            </div>
          </div>
        </div>
      </div>
    `}async initCharts(){const e=await this.fetchAnalyticsData();setTimeout(()=>{requestAnimationFrame(()=>{this.renderPlotlyCharts(e)})},100)}async fetchAnalyticsData(){try{const[e,t,a,s,o]=await Promise.all([fetch("/api/analytics/top-customers"),fetch("/api/analytics/revenue-monthly"),fetch("/api/analytics/fleet-status"),fetch("/api/analytics/top-models"),fetch("/api/analytics/avg-duration")]);return{customers:await e.json(),revenue:await t.json(),fleet:await a.json(),topModels:await s.json(),avgDuration:await o.json()}}catch(e){return console.error("Failed to load analytics data",e),d.error("Could not load analytics data"),{customers:[],revenue:[],fleet:[],topModels:[],avgDuration:[]}}}renderPlotlyCharts({customers:e,revenue:t,fleet:a,topModels:s,avgDuration:o}){const n={responsive:!0,displayModeBar:!1},r=document.documentElement.classList.contains("dark"),l=r?"#9ca3af":"#374151",c=r?"#374151":"#e5e7eb",u={paper_bgcolor:"rgba(0,0,0,0)",plot_bgcolor:"rgba(0,0,0,0)",font:{color:l,family:"Montserrat"},margin:{t:10,l:40,r:20,b:40},autosize:!0,showlegend:!0,legend:{font:{size:10},orientation:"h",y:-.15}};try{const i=e.map(p=>p.name),g=e.map(p=>parseInt(p.count));Plotly.newPlot("plotCustomers",[{type:"bar",orientation:"h",x:g,y:i,marker:{color:"#22d3ee"}}],{...u,margin:{t:10,l:100,r:20,b:30},yaxis:{automargin:!0}},n);const y=s.map(p=>`${p.make} ${p.name}`),v=s.map(p=>parseInt(p.count));Plotly.newPlot("plotTopCars",[{values:v,labels:y,type:"pie",marker:{colors:["#22d3ee","#f43f5e","#f59e0b","#10b981","#8b5cf6"]},textinfo:"none"}],u,n);const f=t.map(p=>p.month),k=t.map(p=>parseFloat(p.total));Plotly.newPlot("plotRevenue",[{x:f,y:k,type:"scatter",mode:"lines+markers",line:{shape:"spline",color:"#22d3ee",width:3},fill:"tozeroy",fillcolor:"rgba(34, 211, 238, 0.1)"}],{...u,xaxis:{gridcolor:c},yaxis:{gridcolor:c}},n);const w=o.map(p=>p.name),M=o.map(p=>parseFloat(p.avg_days).toFixed(1));Plotly.newPlot("plotDuration",[{x:w,y:M,type:"bar",marker:{color:"#f59e0b"}}],u,n);const L=a.map(p=>p.status.charAt(0).toUpperCase()+p.status.slice(1)),$=a.map(p=>parseInt(p.count)),E=a.map(p=>{switch(p.status){case"available":return"#10b981";case"maintenance":return"#ef4444";case"rented":return"#f59e0b";default:return"#6b7280"}});Plotly.newPlot("plotFleetStatus",[{values:$,labels:L,type:"pie",hole:.6,marker:{colors:E},textinfo:"none"}],u,n),window.dispatchEvent(new Event("resize"))}catch(i){console.error("Plotly Init Error:",i)}}}class x{static createIcon(e,t="w-5 h-5"){return`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${t}">
              <path d="${e}" />
            </svg>`}}class O{constructor(){this.kpis=[{title:m[window.app?.language||"en"]?.admin?.total_cars||"Total Cars",value:"...",description:m[window.app?.language||"en"]?.admin?.in_fleet||"In Fleet",iconPath:"M19 17h2c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-1.4M2 17h3l2.6-6.3c.4-.9 1.1-1.4 2.1-1.4h6.6c1 0 1.7.5 2.1 1.4L19 17M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z",color:"cyan"},{title:m[window.app?.language||"en"]?.admin?.total_clients||"Total Clients",value:"...",description:m[window.app?.language||"en"]?.admin?.registered_users||"Registered Users",iconPath:"M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",color:"green"},{title:m[window.app?.language||"en"]?.admin?.active_rentals||"Active Rentals",value:"...",description:m[window.app?.language||"en"]?.admin?.on_road||"Currently on the road",iconPath:"M21 2l-6.5 6.5a4 4 0 1 0 4 4L22 7.5zm-5 5-2 2M15 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",color:"amber"},{title:m[window.app?.language||"en"]?.admin?.revenue_year||"Revenue This Year",value:"...",description:m[window.app?.language||"en"]?.admin?.earnings_summary||"Real-time earnings summary",iconPath:"M12 1v22M17 5H7c-2.2 0-4 1.8-4 4s1.8 4 4 4h10c2.2 0 4 1.8 4 4s-1.8 4-4 4H7",color:"rose"},{title:m[window.app?.language||"en"]?.admin?.available_cars||"Available Cars",value:"...",description:m[window.app?.language||"en"]?.admin?.ready_booking||"Ready for booking",iconPath:"M22 11.08V12a10 10 0 1 1-5.93-8.5M22 4L12 14.01l-3-3",color:"teal"},{title:m[window.app?.language||"en"]?.admin?.total_locations||"Total Locations",value:"...",description:m[window.app?.language||"en"]?.admin?.global_presence||"Global presence",iconPath:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",color:"indigo"}]}async fetchData(){try{const[e,t,a,s,o,n]=await Promise.all([B(),P(),j(),N(),H(),R()]);this.kpis[0].value=e,this.kpis[1].value=t,this.kpis[2].value=a,this.kpis[3].value=`${Intl.NumberFormat("en-US",{notation:"compact",maximumFractionDigits:1}).format(s)} €`,this.kpis[4].value=o,this.kpis[5].value=n}catch(e){console.error("API Error:",e),this.kpis[0].value="Err"}}renderCard(e){const t=`text-${e.color}-500 dark:text-${e.color}-400`,a=`bg-${e.color}-100 dark:bg-${e.color}-900/30`;return`
            <div class="flex flex-col p-5 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-300 transform hover:scale-[1.01] border border-gray-200 dark:border-gray-700/50">
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">${e.title}</p>
                  <div class="text-3xl font-bold text-gray-800 dark:text-gray-100">${e.value}</div>
                </div>
                <div class="p-3 rounded-full ${a} ${t}">
                  ${x.createIcon(e.iconPath,"w-6 h-6")}
                </div>
              </div>
              <p class="text-xs text-gray-500 mt-2">${e.description}</p>
            </div>`}render(){const e=m[window.app?.language||"en"]?.admin;return e&&(this.kpis[0]&&(this.kpis[0].title=e.total_cars,this.kpis[0].description=e.in_fleet),this.kpis[1]&&(this.kpis[1].title=e.total_clients,this.kpis[1].description=e.registered_users),this.kpis[2]&&(this.kpis[2].title=e.active_rentals,this.kpis[2].description=e.on_road),this.kpis[3]&&(this.kpis[3].title=e.revenue_year,this.kpis[3].description=e.earnings_summary),this.kpis[4]&&(this.kpis[4].title=e.available_cars,this.kpis[4].description=e.ready_booking),this.kpis[5]&&(this.kpis[5].title=e.total_locations,this.kpis[5].description=e.global_presence)),`<section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            ${this.kpis.map(t=>this.renderCard(t)).join("")}
          </section>`}}class F{constructor(){this.tables={}}registerTable(e,t){this.tables[e]={...t,searchTerm:"",filters:{},currentPage:1,itemsPerPage:10,sortColumn:null,sortDirection:"asc"}}getProcessedData(e){let t=[...e.data];if(e.searchTerm){const a=e.searchTerm.toLowerCase();t=t.filter(s=>Object.values(s).some(o=>String(o).toLowerCase().includes(a)))}return e.filters&&Object.entries(e.filters).forEach(([a,s])=>{s&&s!=="all"&&(t=t.filter(o=>String(o[a]||"").toLowerCase().includes(s.toLowerCase())))}),e.sortColumn&&t.sort((a,s)=>{let o=a[e.sortColumn],n=s[e.sortColumn];return typeof o=="number"&&typeof n=="number"?e.sortDirection==="asc"?o-n:n-o:(o=String(o||"").toLowerCase(),n=String(n||"").toLowerCase(),o<n?e.sortDirection==="asc"?-1:1:o>n?e.sortDirection==="asc"?1:-1:0)}),t}handleFilter(e,t,a){const s=this.tables[e];s&&(s.filters[t]=a,s.currentPage=1,this.updateTableUI(e))}exportToCSV(e,t="export.csv"){const a=this.tables[e];if(!a)return;const s=this.getProcessedData(a);if(s.length===0){d.error("No data to export");return}const o=Object.keys(s[0]),n=[o.join(","),...s.map(c=>o.map(u=>{let i=c[u]||"";return i=String(i).replace(/"/g,'""'),i.search(/("|,|\n)/g)>=0&&(i=`"${i}"`),i}).join(","))].join(`
`),r=new Blob([n],{type:"text/csv;charset=utf-8;"}),l=document.createElement("a");if(l.download!==void 0){const c=URL.createObjectURL(r);l.setAttribute("href",c),l.setAttribute("download",t),l.style.visibility="hidden",document.body.appendChild(l),l.click(),document.body.removeChild(l)}}handleSort(e,t){const a=this.tables[e];a&&(a.sortColumn===t?a.sortDirection=a.sortDirection==="asc"?"desc":"asc":(a.sortColumn=t,a.sortDirection="asc"),this.updateTableUI(e))}handleSearch(e,t){this.tables[e]&&(this.tables[e].searchTerm=t,this.tables[e].currentPage=1,this.updateTableUI(e))}handlePaginationClick(e,t){const a=this.tables[e];if(!a)return;const s=this.getProcessedData(a),o=Math.ceil(s.length/a.itemsPerPage);t==="prev"&&a.currentPage>1?a.currentPage--:t==="next"&&a.currentPage<o&&a.currentPage++,this.updateTableUI(e)}handleItemsPerPageChange(e,t){const a=this.tables[e];a&&(a.itemsPerPage=parseInt(t),a.currentPage=1,this.updateTableUI(e))}updateTableUI(e){const t=this.tables[e];if(!t)return;const a=this.getProcessedData(t),s=Math.ceil(a.length/t.itemsPerPage);t.currentPage>s&&s>0&&(t.currentPage=s);const o=(t.currentPage-1)*t.itemsPerPage,n=a.slice(o,o+t.itemsPerPage);if(document.querySelectorAll(`#${e}-thead th svg`).forEach(g=>g.classList.add("text-gray-600")),t.sortColumn){const g=document.getElementById(`${e}-header-${t.sortColumn}`);if(g){const y=g.querySelector("svg");y&&(y.classList.remove("text-gray-600"),y.classList.add("text-cyan-400"),y.style.transform=t.sortDirection==="desc"?"rotate(180deg)":"rotate(0deg)")}}const l=document.getElementById(`${e}-tbody`);l&&(l.innerHTML=n.length>0?n.map(g=>`<tr class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">${t.renderRowContent(g)}</tr>`).join(""):'<tr><td colspan="10" class="text-center py-4 text-gray-500">No data found.</td></tr>');const c=document.getElementById(`${e}-prev-btn`),u=document.getElementById(`${e}-next-btn`),i=document.getElementById(`${e}-page-info`);c&&(c.disabled=t.currentPage<=1,c.className=t.currentPage<=1?"px-3 py-2 bg-gray-700 text-gray-500 rounded-lg cursor-not-allowed opacity-50":"px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition"),u&&(u.disabled=t.currentPage>=s,u.className=t.currentPage>=s?"px-3 py-2 bg-gray-700 text-gray-500 rounded-lg cursor-not-allowed opacity-50":"px-3 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition"),i&&(i.textContent=`Page ${t.currentPage} of ${s||1}`)}render(e,t,a,s,o,n=[]){const l=(JSON.parse(localStorage.getItem("adminSettings"))||{}).compactView;this.tables[e]?(this.tables[e].data=a,this.tables[e].renderRowContent=o,setTimeout(()=>this.updateTableUI(e),0)):this.registerTable(e,{data:a,renderRowContent:o});const c=n.map(i=>`
      <select onchange="window.app.tableManager.handleFilter('${e}', '${i.key}', this.value)" 
              class="px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-cyan-500 text-sm outline-none transition">
        <option value="all">${i.label}</option>
        ${i.options.map(g=>`<option value="${g}">${g}</option>`).join("")}
      </select>
    `).join("");setTimeout(()=>this.updateTableUI(e),0);const u=m[window.app?.language||"en"]?.admin||m.en.admin;return`
      <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700/50 animate-fade-in">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2 flex justify-between items-center">
            ${t}
            <button onclick="window.app.tableManager.exportToCSV('${e}', '${t}.csv')" 
                    class="text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-cyan-600 dark:text-cyan-400 px-3 py-1.5 rounded flex items-center gap-2 border border-gray-300 dark:border-gray-600 transition">
               <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
               ${u.export_csv}
            </button>
        </h3>
        
        <div class="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div class="relative w-full md:w-64">
             <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
               <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
             </div>
             <input type="text" placeholder="Search records..." 
                 oninput="window.app.tableManager.handleSearch('${e}', this.value)" 
                 class="w-full pl-10 p-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-cyan-500 placeholder-gray-500 dark:placeholder-gray-400 outline-none" />
          </div>

          <div class="flex gap-2 w-full md:w-auto">
             ${c}
          </div>
        </div>

        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 ${l?"compact-table":""}">
            <thead id="${e}-thead" class="text-xs text-gray-700 dark:text-gray-200 uppercase bg-gray-100/80 dark:bg-gray-700/80">
              <tr>
                ${s.map(i=>{const g=i.key!=="actions"&&i.key!=="image",y=g?"cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white":"",v=g?`onclick="window.app.tableManager.handleSort('${e}', '${i.key}')"`:"";return`
                    <th id="${e}-header-${i.key}" class="px-6 py-3 transition select-none ${y}" ${v}>
                      <div class="flex items-center gap-2">
                        ${i.label}
                        ${g?'<svg class="w-3 h-3 text-gray-600 transition-transform duration-200" fill="currentColor" viewBox="0 0 24 24"><path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z"/></svg>':""}
                      </div>
                    </th>`}).join("")}
              </tr>
            </thead>
            <tbody id="${e}-tbody" class="${l?"text-xs":"text-sm"}"></tbody>
          </table>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4">
          <div class="flex items-center gap-4 mb-4 sm:mb-0">
            <span class="text-sm text-gray-400" id="${e}-page-info">Page 1 of 1</span>
            <select onchange="window.app.tableManager.handleItemsPerPageChange('${e}', this.value)" class="px-3 py-1 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg text-sm outline-none transition">
              <option value="10">10 / page</option>
              <option value="25">25 / page</option>
              <option value="50">50 / page</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button id="${e}-prev-btn" onclick="window.app.tableManager.handlePaginationClick('${e}', 'prev')" class="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm">Prev</button>
            <button id="${e}-next-btn" onclick="window.app.tableManager.handlePaginationClick('${e}', 'next')" class="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm">Next</button>
          </div>
        </div>
      </div>`}}class V{constructor(e){this.router=e,this.menuItems=[{name:"Dashboard",route:"dashboard",iconPath:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 14V8M15 12h-3"},{name:"Cars (CRUD)",route:"cars",iconPath:"M19 17h2c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-1.4M2 17h3l2.6-6.3c.4-.9 1.1-1.4 2.1-1.4h6.6c1 0 1.7.5 2.1 1.4L19 17M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"},{name:"Clients (CRUD)",route:"clients",iconPath:"M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"},{name:"Rentals",route:"rentals",iconPath:"M21 2l-6.5 6.5a4 4 0 1 0 4 4L22 7.5zm-5 5-2 2M15 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"},{name:"Locations",route:"locations",iconPath:"M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0zM15 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0z"},{name:"Models (3D)",route:"models",iconPath:"M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"},{name:"Graphs / Analytics",route:"analytics",iconPath:"M12 20V10M18 20V4M6 20V16"},{name:"Settings",route:"settings",iconPath:"M12.22 2h-.44a2 2 0 0 0-2 2v2a2 2 0 0 0-2 2 2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM18 12.22h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2 2 2 0 0 0-2 2v.44a2 2 0 0 0 2 2zM6 12.22h-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 0 2-2 2 2 0 0 0 2 2v.44a2 2 0 0 0-2 2zM12.22 22h-.44a2 2 0 0 0-2-2v-2a2 2 0 0 0 2-2 2 2 0 0 0 2 2v2a2 2 0 0 0-2 2z"}],this.sidebarEl=document.getElementById("sidebar"),this.overlayEl=document.getElementById("sidebar-overlay"),this.mainContentEl=document.getElementById("main-content"),this.navEl=document.getElementById("sidebar-nav"),this.attachEventListeners()}updateMenuItems(){const e=window.app?.language||"en",t=m[e]?.admin||m.en.admin;this.menuItems=[{name:t.dashboard,route:"dashboard",iconPath:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 14V8M15 12h-3"},{name:t.fleet,route:"cars",iconPath:"M19 17h2c.6 0 1-.4 1-1v-3c0-.6-.4-1-1-1h-1.4M2 17h3l2.6-6.3c.4-.9 1.1-1.4 2.1-1.4h6.6c1 0 1.7.5 2.1 1.4L19 17M5 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0zM15 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0z"},{name:t.users,route:"clients",iconPath:"M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"},{name:t.rentals,route:"rentals",iconPath:"M21 2l-6.5 6.5a4 4 0 1 0 4 4L22 7.5zm-5 5-2 2M15 19a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"},{name:t.locations,route:"locations",iconPath:"M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0zM15 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0z"},{name:t.manage_vehicle,route:"models",iconPath:"M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"},{name:t.graphs_analytics,route:"analytics",iconPath:"M12 20V10M18 20V4M6 20V16"},{name:t.settings,route:"settings",iconPath:"M12.22 2h-.44a2 2 0 0 0-2 2v2a2 2 0 0 0-2 2 2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM18 12.22h.44a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2 2 2 0 0 0-2 2v.44a2 2 0 0 0-2 2zM6 12.22h-.44a2 2 0 0 0-2-2v-.44a2 2 0 0 0 2-2 2 2 0 0 0 2 2v.44a2 2 0 0 0-2 2zM12.22 22h-.44a2 2 0 0 0-2-2v-2a2 2 0 0 0 2-2 2 2 0 0 0 2 2v2a2 2 0 0 0-2 2z"}]}render(){this.updateMenuItems(),this.navEl.innerHTML=this.menuItems.map(e=>this.createMenuItem(e)).join("")}createMenuItem(e){return`
            <div class="flex items-center p-3 rounded-xl transition duration-200 cursor-pointer group ${e.route===this.router.currentRoute?"bg-cyan-100 dark:bg-cyan-700/50 text-cyan-700 dark:text-cyan-400 font-semibold shadow-inner":"text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"}" 
                 onclick="window.app.router.navigate('${e.route}')" title="${e.name}">
              ${x.createIcon(e.iconPath,"flex-shrink-0 w-5 h-5")}
              <span class="ml-3 whitespace-nowrap overflow-hidden sidebar-text transition-all duration-300">
                ${e.name}
              </span>
              <span class="hidden lg:group-hover:block absolute left-full ml-3 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-xs rounded-lg text-white z-50 shadow-md">
                ${e.name}
              </span>
            </div>`}toggle(e){const t=typeof e=="boolean"?e:this.sidebarEl.classList.contains("translate-x-0")&&window.innerWidth<1024;t?(this.sidebarEl.classList.remove("w-0","-translate-x-full","lg:w-20"),this.sidebarEl.classList.add("w-64","translate-x-0","lg:w-20"),this.overlayEl.classList.remove("hidden")):(this.sidebarEl.classList.add("w-0","-translate-x-full","lg:w-20"),this.sidebarEl.classList.remove("w-64","translate-x-0"),this.overlayEl.classList.add("hidden")),window.innerWidth>=1024?t?this.mainContentEl.classList.remove("lg:ml-20"):this.mainContentEl.classList.add("lg:ml-20"):this.mainContentEl.classList.remove("lg:ml-20"),document.querySelectorAll(".sidebar-text").forEach(s=>{window.innerWidth<1024&&!t?s.classList.add("opacity-0","max-w-0"):window.innerWidth<1024&&t&&s.classList.add("opacity-100","max-w-full")})}attachEventListeners(){document.getElementById("sidebar-toggle-mobile").addEventListener("click",()=>this.toggle(!0)),document.getElementById("sidebar-close-mobile").addEventListener("click",()=>this.toggle(!1)),this.overlayEl.addEventListener("click",()=>this.toggle(!1))}}class h{static renderHeader(e,t){const a=m[window.app?.language||"en"]?.admin||m.en.admin;return`
      <div class="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div class="flex items-center gap-4">
          <button onclick="${t}" class="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition text-gray-600 dark:text-gray-300">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h2 class="text-2xl font-bold text-cyan-600 dark:text-cyan-400">${e}</h2>
        </div>
        <button onclick="window.app.exportToPDF()" class="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition border border-gray-300 dark:border-gray-600">
          <svg class="w-5 h-5 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          ${a.export_pdf}
        </button>
      </div>`}static renderCarDetails(e){const t=JSON.stringify(e).replace(/"/g,"&quot;");let a="N/A",s="No description available.";try{const n=typeof e.locations=="string"?JSON.parse(e.locations):e.locations;a=n?.en||Object.values(n)[0]||"N/A";const r=typeof e.description=="string"?JSON.parse(e.description):e.description;s=r?.en||Object.values(r)[0]||s}catch{}const o=e.image?`/assets/images/${e.image}`:"/assets/images/placeholder.png";return`
      <div class="p-8 max-w-6xl mx-auto animate-fade-in" id="printable-area">
        ${this.renderHeader(`Vehicle Details: ${e.name}`,"window.app.router.navigate('cars')")}

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-200 dark:border-gray-700 shadow-lg">
              <img src="${o}" class="w-full h-64 object-cover rounded-lg" onerror="this.src='/assets/images/placeholder.png'">
            </div>
            
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
               <h3 class="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider mb-4">Status & Pricing</h3>
               <div class="flex justify-between items-center mb-4">
                  <span class="text-gray-600 dark:text-gray-300">Daily Rate</span>
                  <span class="text-2xl font-bold text-cyan-600 dark:text-cyan-400">$${e.price}</span>
               </div>
               <div class="flex justify-between items-center">
                  <span class="text-gray-600 dark:text-gray-300">Status</span>
                  <span class="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white capitalize border border-gray-200 dark:border-gray-600">
                    ${e.status}
                  </span>
               </div>
            </div>
          </div>

          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 shadow-lg">
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Technical Specifications</h3>
              
              <div class="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p class="text-gray-500 text-sm">Vehicle ID (DB)</p>
                  <p class="text-gray-800 dark:text-white font-medium">#${e.id}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">VIN / Registration</p>
                  <p class="text-gray-800 dark:text-white font-medium">${e.vin||"N/A"}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Make</p>
                  <p class="text-gray-800 dark:text-white font-medium">${e.make}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Model</p>
                  <p class="text-gray-800 dark:text-white font-medium">${e.name}</p>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">Color</p>
                  <div class="flex items-center gap-2">
                    <span class="w-4 h-4 rounded-full border border-gray-500" style="background-color: ${e.color}"></span>
                    <span class="text-gray-800 dark:text-white font-medium capitalize">${e.color}</span>
                  </div>
                </div>
                 <div>
                  <p class="text-gray-500 text-sm">Location</p>
                  <p class="text-gray-800 dark:text-white font-medium">${a}</p>
                </div>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
                <p class="text-gray-500 text-sm mb-2">Description</p>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">${s}</p>
              </div>
            </div>

            <div class="flex gap-4 justify-end pt-4" data-html2canvas-ignore="true">
              <button onclick="window.app.deleteVehicle(${e.id})" class="px-6 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-lg transition font-medium">
                Supprimer (Delete)
              </button>
              <button onclick="window.app.openCarModal(${t})" class="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 transition font-medium">
                Modifier (Edit)
              </button>
            </div>
          </div>
        </div>
      </div>
    `}static renderRentalDetails(e){JSON.stringify(e).replace(/"/g,"&quot;");const t=new Date(e.rental_start).toLocaleDateString(),a=new Date(e.rental_end).toLocaleDateString(),s=new Date(e.created_at).toLocaleDateString();let o="text-yellow-400 border-yellow-400";return e.status==="completed"&&(o="text-green-400 border-green-400"),e.status==="cancelled"&&(o="text-red-400 border-red-400"),`
      <div class="p-8 max-w-4xl mx-auto animate-fade-in" id="printable-area">
        ${this.renderHeader(`Rental #${e.id} - Details`,"window.app.router.navigate('rentals')")}

        <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden relative">
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
             <span class="text-9xl font-bold text-gray-900 dark:text-white uppercase transform -rotate-12">${e.status}</span>
          </div>

          <div class="p-8 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-start">
            <div>
               <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">INVOICE</h1>
               <p class="text-gray-500 dark:text-gray-400 text-sm">Issued Date: ${s}</p>
               <p class="text-gray-500 dark:text-gray-400 text-sm">Transaction ID: #${e.id}</p>
            </div>
            <div class="text-right">
                <div class="inline-block px-4 py-2 border-2 rounded-lg font-bold uppercase tracking-wider ${o}">
                    ${e.status}
                </div>
            </div>
          </div>

          <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
               <h4 class="text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider text-xs mb-4">Billed To</h4>
               <p class="text-xl text-gray-900 dark:text-white font-bold">${e.first_name} ${e.last_name}</p>
               <p class="text-gray-600 dark:text-gray-400">${e.email}</p>
               <p class="text-gray-500 text-sm mt-2">Client ID: #${e.id}</p>
            </div>

            <div>
               <h4 class="text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider text-xs mb-4">Rental Info</h4>
               <div class="flex justify-between mb-2">
                  <span class="text-gray-500 dark:text-gray-400">Pick-up Date:</span>
                  <span class="text-gray-900 dark:text-white">${t}</span>
               </div>
               <div class="flex justify-between mb-2">
                  <span class="text-gray-500 dark:text-gray-400">Return Date:</span>
                  <span class="text-gray-900 dark:text-white">${a}</span>
               </div>
                <div class="flex justify-between mb-2">
                  <span class="text-gray-500 dark:text-gray-400">Duration:</span>
                  <span class="text-gray-900 dark:text-white">
                    ${Math.ceil((new Date(e.rental_end)-new Date(e.rental_start))/(1e3*60*60*24))} Days
                  </span>
               </div>
            </div>
          </div>

          <div class="p-8">
             <table class="w-full text-left text-sm">
                <thead>
                   <tr class="border-b border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400">
                      <th class="pb-3">Vehicle Description</th>
                      <th class="pb-3">VIN</th>
                      <th class="pb-3 text-right">Total Amount</th>
                   </tr>
                </thead>
                <tbody class="text-gray-700 dark:text-gray-200">
                   <tr class="border-b border-gray-200 dark:border-gray-700">
                      <td class="py-4">
                         <div class="flex items-center gap-4">
                            <img src="/assets/images/${e.car_image}" class="w-16 h-10 object-cover rounded border border-gray-200 dark:border-gray-600">
                            <div>
                               <p class="font-bold">${e.car_make} ${e.car_name}</p>
                               <p class="text-xs text-gray-500">Premium Rental Service</p>
                            </div>
                         </div>
                      </td>
                      <td class="py-4">${e.vin}</td>
                      <td class="py-4 text-right font-bold text-lg text-emerald-600 dark:text-emerald-400">$${e.price}</td>
                   </tr>
                </tbody>
             </table>
          </div>

          <div class="bg-gray-100 dark:bg-gray-900/50 p-6 flex justify-end gap-4 border-t border-gray-200 dark:border-gray-700" data-html2canvas-ignore="true">
             <button onclick="window.app.deleteRental(${e.id})" class="px-6 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-lg transition font-medium">
                Delete Record
             </button>
             <button onclick="window.app.promptRentalStatus(${e.id}, '${e.status}')" class="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 transition font-medium">
                Update Status
             </button>
          </div>
        </div>
      </div>
    `}static renderClientDetails(e){const t=JSON.stringify(e).replace(/"/g,"&quot;");return`
      <div class="p-8 max-w-4xl mx-auto animate-fade-in" id="printable-area">
        ${this.renderHeader(`Client Profile: ${e.first_name} ${e.last_name}`,"window.app.router.navigate('clients')")}

        <div class="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
          <div class="p-8">
            <div class="flex items-center gap-6 mb-8">
              <div class="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                ${e.first_name[0]}${e.last_name[0]}
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">${e.first_name} ${e.last_name}</h3>
                <p class="text-cyan-400">Client ID: #${e.id}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-700 pt-8">
              <div class="space-y-4">
                <div>
                  <label class="text-sm text-gray-500 block">Email Address</label>
                  <span class="text-lg text-gray-200">${e.email}</span>
                </div>
                <div>
                  <label class="text-sm text-gray-500 block">Phone Number</label>
                  <span class="text-lg text-gray-200">${e.phone||"Not Provided"}</span>
                </div>
              </div>
              
              <div class="space-y-4">
                <div>
                  <label class="text-sm text-gray-500 block">Account Created</label>
                  <span class="text-lg text-gray-200">${new Date().toLocaleDateString()}</span> </div>
                 <div>
                  <label class="text-sm text-gray-500 block">Membership Status</label>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-900/50 p-6 flex justify-end gap-4 border-t border-gray-700" data-html2canvas-ignore="true">
            <button onclick="window.app.deleteClient(${e.id})" class="px-6 py-2 bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40 rounded-lg transition font-medium">
                Supprimer (Delete)
            </button>
            <button onclick="window.app.openClientModal(${t})" class="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 transition font-medium">
                Modifier (Edit)
            </button>
          </div>
        </div>
      </div>
    `}static renderLocationDetails(e){const t=JSON.stringify(e).replace(/"/g,"&quot;");return`
      <div class="p-8 max-w-4xl mx-auto animate-fade-in" id="printable-area">
        ${this.renderHeader(`Location Details: ${e.city_name}`,"window.app.router.navigate('locations')")}

        <div class="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
          <div class="p-8">
            <div class="flex items-center gap-6 mb-8">
              <div class="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0zM15 11a3 3 0 1 0-6 0 3 3 0 0 0 6 0z"></path></svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">${e.city_name}</h3>
                <p class="text-cyan-400">Location ID: #${e.id}</p>
              </div>
            </div>

            <div class="space-y-6">
              <div>
                <h4 class="text-sm font-medium text-gray-400 mb-2">Map Location</h4>
                <div class="w-full h-80 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                  <iframe 
                    src="${e.map_embed_url}" 
                    width="100%" 
                    height="100%" 
                    style="border:0;" 
                    allowfullscreen="" 
                    loading="lazy" 
                    referrerpolicy="no-referrer-when-downgrade">
                  </iframe>
                </div>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-400 mb-2">Embed URL</h4>
                <code class="block w-full bg-gray-900 p-3 rounded text-xs text-gray-400 font-mono break-all">
                  ${e.map_embed_url}
                </code>
              </div>
            </div>
          </div>

          <div class="bg-gray-900/50 p-6 flex justify-end gap-4 border-t border-gray-700" data-html2canvas-ignore="true">
            <button onclick="window.app.deleteLocation(${e.id})" class="px-6 py-2 bg-red-900/20 text-red-400 border border-red-900/50 hover:bg-red-900/40 rounded-lg transition font-medium">
                Supprimer (Delete)
            </button>
            <button onclick="window.app.openLocationModal(${t})" class="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 transition font-medium">
                Modifier (Edit)
            </button>
          </div>
        </div>
      </div>
    `}static renderModelDetails(e){const t=JSON.stringify(e).replace(/"/g,"&quot;");return`
      <div class="p-8 max-w-4xl mx-auto animate-fade-in" id="printable-area">
        ${this.renderHeader(`Model Details: ${e.car_make} ${e.car_name}`,"window.app.router.navigate('models')")}

<div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden">
  <div class="p-8">
    <div class="flex items-center gap-6 mb-8">
      <div class="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
      </div>
      <div>
        <h3 class="text-2xl font-bold text-gray-900 dark:text-white">${e.car_make} ${e.car_name}</h3>
        <p class="text-cyan-600 dark:text-cyan-400">Model ID: #${e.id} | Car ID: #${e.car_id}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="space-y-6">
        <div>
          <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">3D File</h4>
          <div class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span class="text-gray-600 dark:text-gray-300 font-mono text-sm truncate mr-4">${e.file_path}</span>
            <a href="/assets/models/${e.file_path}" download class="text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 text-sm font-bold">Download</a>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Scale X</label>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">${e.scale_x}</p>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <label class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rotation Y</label>
            <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">${e.rot_y}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="bg-gray-100 dark:bg-gray-900/50 p-6 flex justify-end gap-4 border-t border-gray-200 dark:border-gray-700" data-html2canvas-ignore="true">
    <button onclick="window.app.deleteModel(${e.id})" class="px-6 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-lg transition font-medium">
      Supprimer (Delete)
    </button>
    <button onclick="window.app.openModelModal(${t})" class="px-6 py-2 bg-cyan-600 text-white hover:bg-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 transition font-medium">
      Modifier (Edit)
    </button>
  </div>
</div>
      </div >
  `}}class U{constructor(){this.checkAuth(),this.language=localStorage.getItem("adminLanguage")||"en",this.fleetData=[],this.clientsData=[],this.clientsData=[],this.rentalsData=[],this.locationsData=[],this.modelsData=[],this.carsData=[],this.updateUserInfo(),this.kpiManager=new O,this.tableManager=new F,this.analyticsManager=new A,this.settingsManager=new z,this.router={currentRoute:"dashboard",navigate:e=>{this.router.currentRoute=e,this.sidebar.render(),this.renderContent(),window.innerWidth<1024&&this.sidebar.toggle(!1)}},this.sidebar=new V(this.router),window.app=this,this.initAutoLogout(),this.initLanguageSelector(),this.initTheme(),this.updateStaticTranslations()}initLanguageSelector(){const e=document.getElementById("admin-language-selector");e&&(e.value=this.language,e.addEventListener("change",t=>this.changeLanguage(t.target.value)))}changeLanguage(e){this.language=e,localStorage.setItem("adminLanguage",e),this.updateStaticTranslations(),this.sidebar.render(),this.renderContent()}initTheme(){const e=localStorage.getItem("theme");e==="dark"||!e?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark"),this.updateThemeIcon()}toggleTheme(){const e=document.documentElement.classList.toggle("dark");localStorage.setItem("theme",e?"dark":"light"),this.updateThemeIcon()}updateThemeIcon(){const e=document.documentElement.classList.contains("dark"),t=document.getElementById("theme-icon-sun"),a=document.getElementById("theme-icon-moon");t&&a&&(e?(t.classList.remove("hidden"),a.classList.add("hidden")):(t.classList.add("hidden"),a.classList.remove("hidden")))}updateStaticTranslations(){m[this.language]?.admin||m.en.admin}injectRentalModal(){if(document.getElementById("rentalModal"))return;document.body.insertAdjacentHTML("beforeend",`
      <div id="rentalModal" class="fixed inset-0 z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div id="rentalModalBackdrop" class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity opacity-0 transition-opacity duration-300"></div>
        
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div id="rentalModalPanel" class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 transition-all duration-300 border border-gray-200 dark:border-gray-700">
              
              <form id="rentalForm" onsubmit="window.app.handleRentalSubmit(event)">
                <input type="hidden" id="rentalId" name="rental_id" value="">
                <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">Create New Rental</h3>
                  
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Select Client</label>
                      <select id="rentalClientSelect" name="client_id" required class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 transition">
                         <option value="">Loading clients...</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Select Vehicle Model</label>
                      <select id="rentalCarSelect" name="car_id" required class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 transition">
                         <option value="">Loading cars...</option>
                      </select>
                      <p class="text-xs text-gray-500 mt-1">Only shows models with available units.</p>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Start Date</label>
                        <input type="date" name="rental_start" required class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 transition">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">End Date</label>
                        <input type="date" name="rental_end" required class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 transition">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-100 dark:bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200 dark:border-gray-700">
                  <button type="submit" class="inline-flex w-full justify-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 sm:ml-3 sm:w-auto">Confirm Booking</button>
                  <button type="button" onclick="window.app.closeRentalModal()" class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 sm:mt-0 sm:w-auto">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
            </div>
          </div>
        </div>
      </div>`)}async openRentalModal(e=null){const t=document.getElementById("rentalForm"),a=document.querySelector("#rentalModal h3"),s=document.getElementById("rentalId");t&&t.reset(),e?(a.innerText="Edit Rental",s.value=e.id):(a.innerText="Create New Rental",s.value="");const o=document.getElementById("rentalClientSelect"),n=document.getElementById("rentalCarSelect");(!this.clientsData.length||!this.fleetData.length)&&await this.fetchTableData(),o.innerHTML='<option value="">-- Select Client --</option>',this.clientsData.forEach(i=>{const g=e&&e.client_id===i.id?"selected":"";o.innerHTML+=`<option value="${i.id}" ${g}>${i.first_name} ${i.last_name} (${i.email})</option>`});const r=new Map;if(this.fleetData.forEach(i=>{r.has(i.car_id)||r.set(i.car_id,{name:i.name,make:i.make})}),n.innerHTML='<option value="">-- Select Vehicle --</option>',r.forEach((i,g)=>{const y=e&&e.car_model_id===parseInt(g)?"selected":"";n.innerHTML+=`<option value="${g}" ${y}>${i.make} ${i.name}</option>`}),e){const i=g=>g?new Date(g).toISOString().split("T")[0]:"";if(t.querySelector('[name="rental_start"]').value=i(e.rental_start),t.querySelector('[name="rental_end"]').value=i(e.rental_end),!document.getElementById("rentalStatusDiv")){const g=document.createElement("div");g.id="rentalStatusDiv",g.innerHTML=`
                <label class="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <select name="status" class="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white focus:ring-cyan-500 focus:border-cyan-500">
                    <option value="rented">Rented (Active)</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
             `,t.querySelector(".grid.grid-cols-2").before(g)}t.querySelector('[name="status"]').value=e.status}else{const i=document.getElementById("rentalStatusDiv");i&&i.remove()}const l=document.getElementById("rentalModal"),c=document.getElementById("rentalModalBackdrop"),u=document.getElementById("rentalModalPanel");l.classList.remove("hidden"),setTimeout(()=>{c.classList.remove("opacity-0"),u.classList.remove("opacity-0","translate-y-4","sm:translate-y-0","sm:scale-95"),u.classList.add("opacity-100","translate-y-0","sm:scale-100")},10)}closeRentalModal(){const e=document.getElementById("rentalModal"),t=document.getElementById("rentalModalBackdrop"),a=document.getElementById("rentalModalPanel");t.classList.add("opacity-0"),a.classList.remove("opacity-100","translate-y-0","sm:scale-100"),a.classList.add("opacity-0","translate-y-4","sm:translate-y-0","sm:scale-95"),setTimeout(()=>{e.classList.add("hidden")},300)}async handleRentalSubmit(e){e.preventDefault();const t=e.target.querySelector('button[type="submit"]'),a=t.innerHTML;t.innerHTML="Saving...",t.disabled=!0;const s=new FormData(e.target),o=Object.fromEntries(s.entries()),n=document.getElementById("rentalId").value,r=n?`/api/rentals/${n}`:"/api/rentals",l=n?"PUT":"POST";try{const c=await fetch(r,{method:l,headers:{"Content-Type":"application/json"},body:JSON.stringify(o)}),u=await c.json();c.ok?(d.success(n?"Rental updated successfully!":"Rental created successfully!"),this.closeRentalModal(),this.fetchTableData(),this.kpiManager.fetchData()):d.error("Error: "+(u.error||"Failed to save rental"))}catch(c){console.error(c),d.error("Network Error")}finally{t.innerHTML=a,t.disabled=!1}}renderRentalsTable(){const e=this.rentalsData.map(r=>({...r,full_name:`${r.first_name} ${r.last_name} `,formatted_start:new Date(r.rental_start).toLocaleDateString(),formatted_end:new Date(r.rental_end).toLocaleDateString(),formatted_price:`$${r.price} `})),t=[...new Set(e.map(r=>r.car_make))],a=m[this.language].admin,s=m[this.language],o=[{key:"status",label:a.status,options:["rented","completed","cancelled"]},{key:"car_make",label:a.make,options:t}],n=r=>{const l=JSON.stringify(r).replace(/"/g,"&quot;");return`
        <div class="flex gap-2">
            <button onclick="window.app.viewDetails('rental', ${l})" class="text-emerald-600 dark:text-emerald-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-emerald-600" title="Invoice">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </button>
            <button onclick="window.app.openRentalModal(${l})" class="text-cyan-600 dark:text-cyan-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-cyan-600" title="Edit Rental">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </button>
            <button onclick="window.app.deleteRental(${r.id})" class="text-red-600 dark:text-red-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-red-600" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
        </div>`};return this.tableManager.render("rentals-table",a.rentals,e,[{key:"id",label:"ID"},{key:"full_name",label:a.name},{key:"car_name",label:a.manage_vehicle},{key:"car_make",label:a.make},{key:"formatted_start",label:s.date_debut},{key:"formatted_end",label:s.date_fin},{key:"formatted_price",label:a.price},{key:"status",label:a.status},{key:"actions",label:""}],r=>{let l="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400";return(r.status==="rented"||r.status==="active")&&(l="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50"),r.status==="cancelled"&&(l="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50"),r.status==="completed"&&(l="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50"),`
          <td class="px-6 py-4 text-gray-500 dark:text-gray-400">#${r.id}</td>
          <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${r.first_name} ${r.last_name}</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">${r.car_name}</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-400">${r.car_make}</td>
          <td class="px-6 py-4 text-gray-900 dark:text-gray-300">${r.formatted_start}</td>
          <td class="px-6 py-4 text-gray-900 dark:text-gray-300">${r.formatted_end}</td>
          <td class="px-6 py-4 font-bold text-cyan-600 dark:text-cyan-400">${r.formatted_price}</td>
          <td class="px-6 py-4"><span class="px-2 py-1 rounded text-xs font-bold uppercase ${l}">${r.status}</span></td>
          <td class="px-6 py-4">${n(r)}</td>
        `},o)}async promptRentalStatus(e,t){const a=prompt("Update Rental Status (rented, completed, cancelled):",t);if(a&&a!==t){if(!["rented","completed","cancelled"].includes(a.toLowerCase())){d.error("Invalid status. Use: rented, completed, or cancelled");return}try{(await fetch(`/api/rentals/${e}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:a.toLowerCase()})})).ok?(d.success("Status updated!"),this.fetchTableData(),this.router.currentRoute==="rental-details"&&this.router.navigate("rentals")):d.error("Failed to update status")}catch(s){console.error(s),d.error("Network error")}}}async deleteRental(e){if(confirm("Are you sure? This will delete the rental record permanently."))try{(await fetch(`/api/rentals/${e}`,{method:"DELETE"})).ok?(d.success("Rental deleted!"),this.fetchTableData(),this.router.currentRoute==="rental-details"&&this.router.navigate("rentals")):d.error("Failed to delete rental")}catch(t){console.error(t),d.error("Network error")}}viewDetails(e,t){const a=document.getElementById("main-content");e==="car"?a.innerHTML=h.renderCarDetails(t):e==="client"?a.innerHTML=h.renderClientDetails(t):e==="rental"?a.innerHTML=h.renderRentalDetails(t):e==="location"?a.innerHTML=h.renderLocationDetails(t):e==="model"&&(a.innerHTML=h.renderModelDetails(t)),this.router.currentRoute=`${e}-details`}exportToPDF(){const e=document.getElementById("printable-area"),t=event.currentTarget,a=t.innerHTML;t.innerHTML="Generating...";const s={margin:[.5,.5],filename:`Autolux_Report_${new Date().getTime()}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2,useCORS:!0,backgroundColor:"#111827"},jsPDF:{unit:"in",format:"letter",orientation:"portrait"}};typeof html2pdf<"u"?html2pdf().set(s).from(e).save().then(()=>{t.innerHTML=a,d.success("PDF Downloaded!")}):(alert("PDF Library not loaded. Please ensure html2pdf.js is in index.html"),t.innerHTML=a)}openClientModal(e=null){e?(document.getElementById("clientUnitId").value=e.id,document.getElementById("clientFirstName").value=e.first_name||"",document.getElementById("clientLastName").value=e.last_name||"",document.getElementById("clientEmail").value=e.email||"",document.getElementById("clientPhone").value=e.phone||""):(document.getElementById("clientForm").reset(),document.getElementById("clientUnitId").value="");const t=document.getElementById("clientModal"),a=document.getElementById("clientModalBackdrop"),s=document.getElementById("clientModalPanel");t.classList.remove("hidden"),setTimeout(()=>{a.classList.remove("opacity-0"),s.classList.remove("opacity-0","translate-y-4","sm:translate-y-0","sm:scale-95"),s.classList.add("opacity-100","translate-y-0","sm:scale-100")},10)}closeClientModal(){const e=document.getElementById("clientModal"),t=document.getElementById("clientModalBackdrop"),a=document.getElementById("clientModalPanel");t.classList.add("opacity-0"),a.classList.remove("opacity-100","translate-y-0","sm:scale-100"),a.classList.add("opacity-0","translate-y-4","sm:translate-y-0","sm:scale-95"),setTimeout(()=>{e.classList.add("hidden")},300)}async handleClientSubmit(e){e.preventDefault();const t=e.target.querySelector('button[type="submit"]'),a=t.innerHTML;t.innerHTML="Saving...",t.disabled=!0;const s=document.getElementById("clientUnitId").value,o={first_name:document.getElementById("clientFirstName").value,last_name:document.getElementById("clientLastName").value,email:document.getElementById("clientEmail").value,phone:document.getElementById("clientPhone").value},n=s?`/api/clients/${s}`:"/api/clients",r=s?"PUT":"POST";try{const l=await fetch(n,{method:r,headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(l.ok)this.closeClientModal(),this.fetchTableData(),d.success(s?"Client updated successfully!":"Client created successfully!");else{const c=await l.json();d.error("Error: "+(c.error||"Operation failed"))}}catch(l){console.error(l),d.error("Network Error")}finally{t.innerHTML=a,t.disabled=!1}}fillModelFields(e){document.getElementById("carMake").value=e.make||"",document.getElementById("carName").value=e.name||"",document.getElementById("carPrice").value=e.price||"";try{const t=typeof e.description=="string"?JSON.parse(e.description):e.description,a=typeof e.locations=="string"?JSON.parse(e.locations):e.locations,s=t?.en||(t?Object.values(t)[0]:"")||"",o=a?.en||(a?Object.values(a)[0]:"")||"";document.getElementById("carDescription").value=s,document.getElementById("carLocation").value=o}catch(t){console.warn("JSON Parse Error (Ignore if creating new):",t),document.getElementById("carDescription").value="",document.getElementById("carLocation").value=""}}handleModelSelect(e){const t=document.getElementById("modelLockOverlay");if(e==="NEW")t.classList.add("hidden"),["carMake","carName","carPrice","carDescription","carLocation"].forEach(a=>{const s=document.getElementById(a);s&&(s.value="")});else{const a=this.modelsCache.find(s=>s.id==e);a&&(this.fillModelFields(a),t.classList.remove("hidden"))}}async loadModelsForDropdown(){try{const t=await(await fetch("/api/cars")).json();this.modelsCache=t.data||t;const a=document.getElementById("modelSelect");if(!a)return;let s='<option value="NEW" class="text-cyan-400 font-bold">+ Create New Model</option>';this.modelsCache.forEach(o=>{s+=`<option value="${o.id}">${o.make} ${o.name}</option>`}),a.innerHTML=s}catch(e){console.error("Error loading models",e)}}async openCarModal(e=null){await this.loadModelsForDropdown();const t=document.getElementById("modelSelect"),a=document.getElementById("modelLockOverlay");if(document.getElementById("carForm").reset(),document.getElementById("carUnitId").value="",e){t.innerHTML=`<option value="${e.car_id}" selected>${e.make}</option>`,t.disabled=!0,document.getElementById("carUnitId").value=e.id,document.getElementById("carVin").value=e.vin||"",document.getElementById("carColor").value=e.color||"#ffffff",document.getElementById("colorPicker").value=e.color||"#ffffff";const r=document.getElementById("carStatus");r&&(r.value=e.status||"available"),this.fillModelFields(e),a.classList.remove("hidden")}else t.disabled=!1,t.value="NEW",this.handleModelSelect("NEW");const s=document.getElementById("carModal"),o=document.getElementById("modalBackdrop"),n=document.getElementById("modalPanel");s.classList.remove("hidden"),setTimeout(()=>{o.classList.remove("opacity-0"),n.classList.remove("opacity-0","translate-y-4","sm:translate-y-0","sm:scale-95"),n.classList.add("opacity-100","translate-y-0","sm:scale-100")},10)}closeCarModal(){const e=document.getElementById("carModal"),t=document.getElementById("modalBackdrop"),a=document.getElementById("modalPanel");t.classList.add("opacity-0"),a.classList.remove("opacity-100","translate-y-0","sm:scale-100"),a.classList.add("opacity-0","translate-y-4","sm:translate-y-0","sm:scale-95"),setTimeout(()=>{e.classList.add("hidden")},300)}unlockModelFields(){document.getElementById("modelLockOverlay").classList.add("hidden"),d.error("Warning: Changing these details will update the catalog for ALL cars of this model.")}async handleCarSubmit(e){e.preventDefault();const t=e.target.querySelector('button[type="submit"]'),a=t.innerHTML;t.innerHTML="Saving...",t.disabled=!0;const s=new FormData(e.target),o=s.get("unitId"),n=o?`/api/cars/${o}`:"/api/cars",r=o?"PUT":"POST";try{const l=await fetch(n,{method:r,body:s}),c=await l.json();l.ok?(this.closeCarModal(),this.fetchTableData(),d.success("Success!")):d.error("Error: "+c.error)}catch(l){console.error(l),d.error("Network Error")}finally{t.innerHTML=a,t.disabled=!1}}async deleteVehicle(e){if(confirm("Are you sure you want to delete this vehicle?"))try{const t=await fetch(`/api/cars/${e}`,{method:"DELETE"});if(t.ok)d.success("Vehicle deleted successfully!"),this.fetchTableData();else{const a=await t.json();d.error("Error: "+(a.error||"Failed to delete vehicle"))}}catch(t){console.error(t),d.error("Network Error")}}injectLocationModal(){if(document.getElementById("locationModal"))return;document.body.insertAdjacentHTML("beforeend",`
      <div id="locationModal" class="fixed inset-0 z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div id="locationModalBackdrop" class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity opacity-0 transition-opacity duration-300"></div>
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div id="locationModalPanel" class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 transition-all duration-300 border border-gray-200 dark:border-gray-700">
              
              <form id="locationForm" onsubmit="window.app.handleLocationSubmit(event)">
                <input type="hidden" name="locationId" id="locationId">
                
                <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-4" id="locationModalTitle">Add Location</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">City Name</label>
                      <input type="text" name="city_name" id="locCityName" required class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 transition">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Map Embed URL (Google Maps)</label>
                      <textarea name="map_embed_url" id="locMapUrl" rows="3" required class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 font-mono text-xs transition"></textarea>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-100 dark:bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200 dark:border-gray-700">
                  <button type="submit" class="inline-flex w-full justify-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 sm:ml-3 sm:w-auto">Save Location</button>
                  <button type="button" onclick="window.app.closeLocationModal()" class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 sm:mt-0 sm:w-auto">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>`)}openLocationModal(e=null){const t=document.getElementById("locationForm"),a=document.getElementById("locationModalTitle");e?(document.getElementById("locationId").value=e.id,document.getElementById("locCityName").value=e.city_name,document.getElementById("locMapUrl").value=e.map_embed_url,a.textContent="Edit Location"):(t.reset(),document.getElementById("locationId").value="",a.textContent="Add New Location");const s=document.getElementById("locationModal"),o=document.getElementById("locationModalBackdrop"),n=document.getElementById("locationModalPanel");s.classList.remove("hidden"),setTimeout(()=>{o.classList.remove("opacity-0"),n.classList.remove("opacity-0","translate-y-4","sm:translate-y-0","sm:scale-95"),n.classList.add("opacity-100","translate-y-0","sm:scale-100")},10)}closeLocationModal(){const e=document.getElementById("locationModal"),t=document.getElementById("locationModalBackdrop"),a=document.getElementById("locationModalPanel");t.classList.add("opacity-0"),a.classList.remove("opacity-100","translate-y-0","sm:scale-100"),a.classList.add("opacity-0","translate-y-4","sm:translate-y-0","sm:scale-95"),setTimeout(()=>{e.classList.add("hidden")},300)}async handleLocationSubmit(e){e.preventDefault();const t=e.target.querySelector('button[type="submit"]'),a=t.innerHTML;t.innerHTML="Saving...",t.disabled=!0;const s=document.getElementById("locationId").value,o={city_name:document.getElementById("locCityName").value,map_embed_url:document.getElementById("locMapUrl").value},n=s?`/api/locations/${s}`:"/api/locations",r=s?"PUT":"POST";try{const l=await fetch(n,{method:r,headers:{"Content-Type":"application/json"},body:JSON.stringify(o)});if(l.ok)d.success(s?"Location updated!":"Location added!"),this.closeLocationModal(),this.fetchTableData();else{const c=await l.json();d.error("Error: "+(c.error||"Request failed"))}}catch(l){console.error(l),d.error("Network Error")}finally{t.innerHTML=a,t.disabled=!1}}async deleteLocation(e){if(confirm("Are you sure you want to delete this location?"))try{(await fetch(`/api/locations/${e}`,{method:"DELETE"})).ok?(d.success("Location deleted!"),this.fetchTableData()):d.error("Failed to delete location")}catch(t){console.error(t),d.error("Network error")}}injectClientModal(){if(document.getElementById("clientModal"))return;document.body.insertAdjacentHTML("beforeend",`
      <div id="clientModal" class="fixed inset-0 z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div id="clientModalBackdrop" class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity opacity-0 transition-opacity duration-300"></div>
        
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div id="clientModalPanel" class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 transition-all duration-300 border border-gray-200 dark:border-gray-700">
              
              <form id="clientForm" onsubmit="window.app.handleClientSubmit(event)">
                <input type="hidden" name="clientId" id="clientUnitId">
                
                <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-4">Edit Client</h3>
                  <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">First Name</label>
                        <input type="text" name="first_name" id="clientFirstName" required class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 transition">
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Last Name</label>
                        <input type="text" name="last_name" id="clientLastName" required class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 transition">
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Email</label>
                      <input type="email" name="email" id="clientEmail" required class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 transition">
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Phone</label>
                      <input type="text" name="phone" id="clientPhone" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 transition">
                    </div>
                  </div>
                </div>

                <div class="bg-gray-100 dark:bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200 dark:border-gray-700">
                  <button type="submit" class="inline-flex w-full justify-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 sm:ml-3 sm:w-auto">Save Changes</button>
                  <button type="button" onclick="window.app.closeClientModal()" class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 sm:mt-0 sm:w-auto">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>`)}async deleteClient(e){if(confirm("Are you sure you want to delete this client?"))try{const t=await fetch(`/api/clients/${e}`,{method:"DELETE"});if(t.ok)d.success("Client deleted successfully!"),this.fetchTableData();else{const a=await t.json();d.error("Error: "+(a.error||"Failed to delete client"))}}catch(t){console.error(t),d.error("Network Error")}}checkAuth(){const e=localStorage.getItem("token"),t=localStorage.getItem("user");if(!e||!t){window.location.href="login.html";return}try{JSON.parse(t).role!=="admin"&&(window.location.href="index.html")}catch{localStorage.clear(),window.location.href="login.html"}}logout(){localStorage.removeItem("token"),localStorage.removeItem("user"),window.location.href="login.html"}updateUserInfo(){const e=localStorage.getItem("user");if(e)try{const t=JSON.parse(e),a=t.first_name||"Admin",s=t.last_name||"",o=(a[0]+(s[0]||"")).toUpperCase(),n=`${a} ${s}`.trim(),r=document.getElementById("admin-avatar"),l=document.getElementById("admin-name");r&&(r.textContent=o),l&&(l.textContent=n)}catch(t){console.error("Error parsing user for header:",t)}}initAutoLogout(){let e;const t=()=>{(JSON.parse(localStorage.getItem("adminSettings"))||{}).autoLogout&&(clearTimeout(e),e=setTimeout(()=>{d.error("Session expired due to inactivity."),this.logout()},9e5))};window.onload=t,document.onmousemove=t,document.onkeypress=t,document.onclick=t}async init(){this.injectClientModal(),this.injectRentalModal(),this.injectLocationModal(),this.injectModelModal(),this.sidebar.render(),this.renderContent(),await Promise.all([this.kpiManager.fetchData(),this.fetchTableData()]),this.router.currentRoute==="dashboard"&&this.renderContent()}async fetchTableData(){try{const[e,t,a,s,o,n]=await Promise.all([I(),C(),D(),S(),T(),_()]);this.clientsData=e||[],this.fleetData=t||[],this.rentalsData=a||[],this.modelsData=o?.data||[],this.carsData=n||[];const r=s.data||[];this.locationsData=r.map(l=>({...l,short_url:l.map_embed_url&&l.map_embed_url.length>40?l.map_embed_url.substring(0,40)+"...":l.map_embed_url})),this.tableManager.tables["clients-table"]&&(this.tableManager.tables["clients-table"].data=this.clientsData,this.tableManager.updateTableUI("clients-table")),this.tableManager.tables["cars-table"]&&(this.tableManager.tables["cars-table"].data=this.fleetData,this.tableManager.updateTableUI("cars-table")),this.tableManager.tables["rentals-table"]&&(this.tableManager.tables["rentals-table"].data=this.rentalsData,this.tableManager.updateTableUI("rentals-table")),this.tableManager.tables["locations-table"]&&(this.tableManager.tables["locations-table"].data=this.locationsData,this.tableManager.updateTableUI("locations-table")),this.tableManager.tables["models-table"]&&(this.tableManager.tables["models-table"].data=this.modelsData,this.tableManager.updateTableUI("models-table"))}catch(e){console.error("Failed to load table data",e),d.error("Network error: Could not load data.")}}renderCarsTable(){const e=this.fleetData.map(r=>({...r,availability:r.status.charAt(0).toUpperCase()+r.status.slice(1)})),s=[{key:"make",label:"All Makes",options:[...new Set(e.map(r=>r.make))]},{key:"status",label:"All Statuses",options:["available","rented","maintenance"]}],o=r=>{const l=JSON.stringify(r).replace(/"/g,"&quot;");return`
            <div class="flex gap-2">
              <button onclick="window.app.viewDetails('car', ${l})" class="text-emerald-600 dark:text-emerald-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-emerald-600" title="View Details">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </button>
              <button onclick="window.app.openCarModal(${l})" class="text-cyan-600 dark:text-cyan-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-cyan-600" title="Edit">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              <button onclick="window.app.deleteVehicle(${r.id})" class="text-red-600 dark:text-red-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-red-600" title="Delete">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
        `},n=m[this.language].admin;return this.tableManager.render("cars-table",n.fleet,e,[{key:"id",label:"ID"},{key:"image",label:n.image},{key:"name",label:n.name},{key:"make",label:n.make},{key:"price",label:n.price},{key:"color",label:n.color},{key:"status",label:n.status},{key:"actions",label:""}],r=>{const l=r.image?`/assets/images/${r.image}`:"",c=l?`<img src="${l}" alt="${r.name}" class="w-10 h-10 object-cover rounded border border-gray-600" onerror="this.src='/assets/images/placeholder.png'">`:"-";let u="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800";return r.status==="rented"&&(u="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"),r.status==="maintenance"&&(u="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"),`
        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${r.id}</td>
        <td class="px-6 py-4">${c}</td>
        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${r.name}</td>
        <td class="px-6 py-4">${r.make}</td>
        <td class="px-6 py-4">$${r.price}</td>
        <td class="px-6 py-4"><span class="inline-block w-6 h-6 rounded-full border border-gray-300" style="background-color: ${r.color}"></span></td>
        <td class="px-6 py-4"><span class="px-2 py-1 rounded-full text-xs ${u}">${r.status}</span></td>
        <td class="px-6 py-4">${o(r)}</td>
        `},s)}renderClientsTable(){const e=this.clientsData.map(o=>{let n="Other";const r=(o.email||"").toLowerCase();r.includes("@gmail")?n="Gmail":r.includes("@hotmail")||r.includes("@outlook")||r.includes("@live")?n="Microsoft":r.includes("@yahoo")&&(n="Yahoo");const l=o.phone&&o.phone.trim().length>0?"Provided":"Missing";return{...o,fullName:`${o.first_name} ${o.last_name}`,provider:n,phoneStatus:l}}),t=[{key:"provider",label:"Email Provider",options:["Gmail","Microsoft","Yahoo","Other"]},{key:"phoneStatus",label:"Phone Availability",options:["Provided","Missing"]}],a=o=>{const n=JSON.stringify(o).replace(/"/g,"&quot;");return`
            <div class="flex gap-2">
              <button onclick="window.app.viewDetails('client', ${n})" 
                      class="text-emerald-600 dark:text-emerald-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-emerald-600"
                      title="View Details">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </button>

              <button onclick="window.app.openClientModal(${n})" 
                      class="text-cyan-600 dark:text-cyan-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-cyan-600"
                      title="Edit">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
              </button>
              
              <button onclick="window.app.deleteClient(${o.id})" 
                      class="text-red-600 dark:text-red-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-red-600"
                      title="Delete">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
        `},s=m[this.language].admin;return this.tableManager.render("clients-table",s.users,e,[{key:"id",label:"ID"},{key:"fullName",label:s.name},{key:"email",label:s.email},{key:"phone",label:s.phone},{key:"actions",label:""}],o=>`
          <td class="px-6 py-4 text-gray-500 dark:text-gray-400">#${o.id}</td>
          <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
            ${o.first_name} ${o.last_name}
          </td>
          <td class="px-6 py-4 text-cyan-600 dark:text-cyan-400">${o.email}</td>
          <td class="px-6 py-4">
            ${o.phone?`<span class="text-gray-900 dark:text-gray-300 font-mono text-xs">${o.phone}</span>`:'<span class="text-xs text-red-400 bg-red-900/20 px-2 py-1 rounded border border-red-900/30">Missing</span>'}
          </td>
          <td class="px-6 py-4">${a(o)}</td>
      `,t)}renderLocationsTable(){const e=this.locationsData.map(r=>({...r,first_letter:r.city_name.charAt(0).toUpperCase()})),t=[...new Set(e.map(r=>r.city_name))],a=[...new Set(e.map(r=>r.first_letter))].sort(),s=[{key:"city_name",label:"Select City",options:t},{key:"first_letter",label:"Alphabetical",options:a}],o=r=>{const l={id:r.id,city_name:r.city_name,map_embed_url:r.map_embed_url},c=JSON.stringify(l).replace(/"/g,"&quot;");return`
        <div class="flex gap-2">
           <button onclick="window.app.viewDetails('location', ${c})" class="text-emerald-600 dark:text-emerald-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-emerald-600" title="View Details">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
           </button>
           <button onclick="window.app.openLocationModal(${c})" class="text-cyan-600 dark:text-cyan-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-cyan-600" title="Edit">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
           </button>
           <button onclick="window.app.deleteLocation(${r.id})" class="text-red-600 dark:text-red-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-red-600" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
           </button>
        </div>
      `},n=m[this.language].admin;return this.tableManager.render("locations-table",n.locations,e,[{key:"id",label:"ID"},{key:"city_name",label:"City"},{key:"short_url",label:"Map Source"},{key:"actions",label:""}],r=>`
          <td class="px-6 py-4 text-gray-500 dark:text-gray-400">#${r.id}</td>
          <td class="px-6 py-4 font-bold text-gray-900 dark:text-white text-lg">${r.city_name}</td>
          <td class="px-6 py-4 text-cyan-400 font-mono text-xs">
            <a href="${r.map_embed_url}" target="_blank" class="hover:underline truncate block w-64">${r.short_url}</a>
          </td>
          <td class="px-6 py-4">${o(r)}</td>
      `,s)}renderModelsTable(){const e=this.modelsData,t=[...new Set(e.map(r=>r.car_make))],a=[...new Set(e.map(r=>r.car_name))],s=[{key:"car_make",label:"All Makes",options:t},{key:"car_name",label:"All Models",options:a}],o=r=>{const l=JSON.stringify(r).replace(/"/g,"&quot;");return`
        <div class="flex gap-2">
           <button onclick="window.app.viewDetails('model', ${l})" class="text-emerald-600 dark:text-emerald-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-emerald-600" title="View Details">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
           </button>
           <button onclick="window.app.openModelModal(${l})" class="text-cyan-600 dark:text-cyan-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-cyan-600" title="Edit">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
           </button>
           <button onclick="window.app.deleteModel(${r.id})" class="text-red-600 dark:text-red-400 hover:text-white transition p-2 bg-gray-100 dark:bg-gray-700 rounded hover:bg-red-600" title="Delete">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
           </button>
        </div>
      `},n=m[this.language].admin;return this.tableManager.render("models-table",n.manage_vehicle,e,[{key:"id",label:"ID"},{key:"car_name",label:n.name},{key:"file_path",label:"File Path"},{key:"scale_x",label:"Scale X"},{key:"rot_y",label:"Rot Y"},{key:"actions",label:""}],r=>`
          <td class="px-6 py-4 text-gray-500 dark:text-gray-400">#${r.id}</td>
          <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${r.car_make} ${r.car_name}</td>
          <td class="px-6 py-4 text-cyan-600 dark:text-cyan-400 font-mono text-xs truncate max-w-[200px]">${r.file_path}</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">${r.scale_x}</td>
          <td class="px-6 py-4 text-gray-700 dark:text-gray-300">${r.rot_y}</td>
          <td class="px-6 py-4">${o(r)}</td>
      `,s)}injectModelModal(){if(document.getElementById("modelModal"))return;document.body.insertAdjacentHTML("beforeend",`
      <div id="modelModal" class="fixed inset-0 z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div id="modelModalBackdrop" class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity opacity-0 transition-opacity duration-300"></div>
        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div id="modelModalPanel" class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95 transition-all duration-300 border border-gray-200 dark:border-gray-700">
              
              <form id="modelForm" onsubmit="window.app.handleModelSubmit(event)">
                <input type="hidden" name="modelId" id="modelId">
                
                <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 class="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-4" id="modelModalTitle">Add Model</h3>
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Select Car</label>
                      <select name="car_id" id="modelCarId" required class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 transition">
                         <option value="">Loading cars...</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Model File (.glb)</label>
                      <input type="file" name="file" id="modelFile" accept=".glb,.gltf" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-500 dark:text-gray-300 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-cyan-100 dark:file:bg-cyan-900 file:text-cyan-700 dark:file:text-cyan-400 hover:file:bg-cyan-200 dark:hover:file:bg-cyan-800 focus:ring-cyan-500 focus:border-cyan-500 text-sm transition">
                      <p id="currentModelFile" class="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden"></p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Scale X</label>
                        <input type="number" step="0.01" name="scale_x" id="modelScaleX" value="1.0" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 transition">
                      </div>
                      <div>
                         <label class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">Rotation Y</label>
                         <input type="number" step="0.01" name="rot_y" id="modelRotY" value="0.0" class="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white focus:ring-cyan-500 focus:border-cyan-500 transition">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-100 dark:bg-gray-700/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200 dark:border-gray-700">
                  <button type="submit" class="inline-flex w-full justify-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 sm:ml-3 sm:w-auto">Save Model</button>
                  <button type="button" onclick="window.app.closeModelModal()" class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-gray-500 ring-1 ring-inset ring-gray-300 dark:ring-gray-500 sm:mt-0 sm:w-auto">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>`)}openModelModal(e=null){const t=document.getElementById("modelForm"),a=document.getElementById("modelModalTitle"),s=document.getElementById("modelCarId");if(s.innerHTML='<option value="">-- Select Car --</option>',this.carsData.forEach(l=>{s.innerHTML+=`<option value="${l.id}">${l.make} ${l.name}</option>`}),e){document.getElementById("modelId").value=e.id,s.value=e.car_id;const l=document.getElementById("currentModelFile");l.textContent=`Current: ${e.file_path}`,l.classList.remove("hidden"),document.getElementById("modelScaleX").value=e.scale_x,document.getElementById("modelRotY").value=e.rot_y,a.textContent="Edit Model"}else{t.reset(),document.getElementById("modelId").value="",document.getElementById("modelScaleX").value="1.0",document.getElementById("modelRotY").value="0.0";const l=document.getElementById("currentModelFile");l.textContent="",l.classList.add("hidden"),a.textContent="Add New Model"}const o=document.getElementById("modelModal"),n=document.getElementById("modelModalBackdrop"),r=document.getElementById("modelModalPanel");o.classList.remove("hidden"),setTimeout(()=>{n.classList.remove("opacity-0"),r.classList.remove("opacity-0","translate-y-4","sm:translate-y-0","sm:scale-95"),r.classList.add("opacity-100","translate-y-0","sm:scale-100")},10)}closeModelModal(){const e=document.getElementById("modelModal"),t=document.getElementById("modelModalBackdrop"),a=document.getElementById("modelModalPanel");t.classList.add("opacity-0"),a.classList.remove("opacity-100","translate-y-0","sm:scale-100"),a.classList.add("opacity-0","translate-y-4","sm:translate-y-0","sm:scale-95"),setTimeout(()=>{e.classList.add("hidden")},300)}async handleModelSubmit(e){e.preventDefault();const t=e.target.querySelector('button[type="submit"]'),a=t.innerHTML;t.innerHTML="Saving...",t.disabled=!0;const s=document.getElementById("modelId").value,o=new FormData;o.append("car_id",document.getElementById("modelCarId").value),o.append("scale_x",document.getElementById("modelScaleX").value),o.append("rot_y",document.getElementById("modelRotY").value);const n=document.getElementById("modelFile");if(n.files.length>0)o.append("file",n.files[0]);else if(!s){d.error("Please upload a 3D model file"),t.innerHTML=a,t.disabled=!1;return}const r=s?`/api/models/${s}`:"/api/models",l=s?"PUT":"POST";try{const c=await fetch(r,{method:l,body:o});if(c.ok)d.success(s?"Model updated!":"Model added!"),this.closeModelModal(),this.fetchTableData();else{const u=await c.json();d.error("Error: "+(u.error||"Request failed"))}}catch(c){console.error(c),d.error("Network Error")}finally{t.innerHTML=a,t.disabled=!1}}async deleteModel(e){if(confirm("Are you sure you want to delete this model?"))try{(await fetch(`/api/models/${e}`,{method:"DELETE"})).ok?(d.success("Model deleted!"),this.fetchTableData()):d.error("Failed to delete model")}catch(t){console.error(t),d.error("Network error")}}renderContent(){const e=document.getElementById("main-content");let t="";const a=m[this.language]?.admin||m.en.admin;switch(this.router.currentRoute){case"cars":t=`
          <div class="p-8 space-y-6">
             <div class="flex justify-between items-center">
                 <h2 class="text-2xl font-bold text-cyan-400">${a.fleet}</h2>
                 <button onclick="window.app.openCarModal()" class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2 transition transform hover:scale-105">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    ${a.add_vehicle}
                 </button>
             </div>
             ${this.renderCarsTable()}
          </div>
        `;break;case"clients":t=`
          <div class="p-8 space-y-6">
              <div class="flex justify-between items-center">
                  <h2 class="text-2xl font-bold text-cyan-400">${a.clients_management}</h2>
                  <button onclick="window.app.openClientModal()" class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2 transition transform hover:scale-105">
                     <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                     ${a.add_client}
                  </button>
              </div>
              ${this.renderClientsTable()}
          </div>
        `;break;case"rentals":t=`
          <div class="p-8 space-y-6">
             <div class="flex justify-between items-center">
                 <h2 class="text-2xl font-bold text-cyan-400">${a.rentals_management}</h2>
                 <button onclick="window.app.openRentalModal()" class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2 transition transform hover:scale-105">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    ${a.add_rental}
                 </button>
             </div>
             ${this.renderRentalsTable()}
          </div>
        `;break;case"locations":t=`
          <div class="p-8 space-y-6">
             <div class="flex justify-between items-center">
                 <h2 class="text-2xl font-bold text-cyan-400">${a.locations_management}</h2>
                 <button onclick="window.app.openLocationModal()" class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2 transition transform hover:scale-105">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    ${a.add_location}
                 </button>
             </div>
             ${this.renderLocationsTable()}
          </div>
        `;break;case"models":t=`
            <div class="p-8 space-y-6">
               <div class="flex justify-between items-center">
                   <h2 class="text-2xl font-bold text-cyan-400">${a.models_management}</h2>
                   <button onclick="window.app.openModelModal()" class="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg flex items-center gap-2 transition transform hover:scale-105">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                      ${a.add_model}
                   </button>
               </div>
               ${this.renderModelsTable()}
            </div>
          `;break;case"analytics":e.innerHTML=this.analyticsManager.render(),this.analyticsManager.initCharts();return;case"settings":e.innerHTML=this.settingsManager.render(),setTimeout(()=>{this.settingsManager.attachEvents()},0);return;default:t=`
          <div class="p-8 space-y-8">
            ${this.kpiManager.render()}
            <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              ${this.renderCarsTable()}
              ${this.renderClientsTable()}
            </section>
          </div>`;break}e.innerHTML=t}}window.onload=()=>{new U().init()};
