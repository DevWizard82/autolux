import"./modulepreload-polyfill-B5Qt9EMX.js";import"./common-DbpXaP5I.js";import{t}from"./translations-g1k9azl_.js";import{g as T}from"./api-trhzDeCA.js";let L=document.getElementById("languages"),g=document.getElementById("languages1");window.addEventListener("DOMContentLoaded",()=>{const e=localStorage.getItem("language")||"fr";x(e),L.value=e,g.value=e,A(e)});document.getElementById("languages1").addEventListener("change",e=>{const r=e.target.value;L.value=r,x(r)});document.getElementById("languages").addEventListener("change",e=>{const r=e.target.value;x(r),g.value=r});function x(e){if(!e)return;localStorage.setItem("language",e);const r=document.querySelectorAll("nav a[href*='cars.html']"),s=document.querySelectorAll("a[href*='about.html']"),o=document.querySelectorAll("a[href*='login.html']");r.forEach(n=>n.textContent=t[e].fleet),s.forEach(n=>n.textContent=t[e].about),o.forEach(n=>n.textContent=t[e].login);const c=document.querySelector("header p"),f=document.querySelector("header h1"),v=document.querySelector("header p.text-gray-300");c&&(c.textContent=t[e].hero_tagline),f&&(f.innerHTML=`
      ${t[e].hero_title_1} <br />
      <span class="text-gradient">${t[e].hero_title_2}</span>
    `),v&&(v.textContent=t[e].hero_text),document.querySelectorAll("a[href='#featured']").forEach(n=>{n.textContent=t[e].discover_more});const m=document.querySelector("#about span.text-luxury-gold"),y=document.querySelector("#about h2"),d=document.querySelectorAll("#about p"),h=document.querySelector("#about a span");document.getElementById("book_now").textContent=t[e].booknow,m&&(m.textContent=t[e].about_badge),y&&(y.innerHTML=`
      ${t[e].about_title.split(" ").slice(0,2).join(" ")} <br />
      <span class="text-gradient">${t[e].about_title.split(" ").slice(2).join(" ")}</span>
    `),d[0]&&(d[0].textContent=t[e].about_p1),d[1]&&(d[1].textContent=t[e].about_p2),h&&(h.textContent=t[e].our_story);const p=document.querySelector("#featured span"),b=document.querySelector("#featured h2");p&&(p.textContent=t[e].exclusive_selection),b&&(b.textContent=t[e].royal_fleet);const _=document.querySelector(".cta-full-collection");_&&(_.textContent=t[e].view_full_collection);const w=document.querySelector("#services span"),S=document.querySelector("#services h2");w&&(w.textContent=t[e].why_autolux),S&&(S.innerHTML=`
      ${t[e].concierge_service.split(" ").slice(0,2).join(" ")} <br />
      ${t[e].concierge_service.split(" ").slice(2).join(" ")}
    `);const l=document.querySelectorAll("#services h4"),i=document.querySelectorAll("#services p");l[0]&&(l[0].textContent=t[e].pristine_title),i[0]&&(i[0].textContent=t[e].pristine_desc),l[1]&&(l[1].textContent=t[e].airport_title),i[1]&&(i[1].textContent=t[e].airport_desc),l[2]&&(l[2].textContent=t[e].flexible_title),i[2]&&(i[2].textContent=t[e].flexible_desc);const C=document.querySelector("section h2.text-5xl"),E=document.querySelector("section p.text-xl"),I=document.querySelectorAll("a[href='contact.html']");C&&(C.textContent=t[e].begin_journey),E&&(E.textContent=t[e].begin_text),I.forEach((n,u)=>{n.textContent=u===0?t[e].book_now:t[e].contact_concierge});const q=document.querySelector("footer p.text-gray-500");q&&(q.textContent=t[e].footer_desc),document.querySelectorAll("footer h4").forEach((n,u)=>{u===0&&(n.childNodes[0].textContent=t[e].explore),u===1&&(n.childNodes[0].textContent=t[e].visit_us)}),document.getElementById("view_fleet").textContent=t[e].view_fleet,document.getElementById("fleet_footer").innerHTML=`
  <i class="fas fa-chevron-right text-[10px] text-luxury-orange"></i> ${t[e].fleet}
  `,document.getElementById("services_footer").innerHTML=`
  <i class="fas fa-chevron-right text-[10px] text-luxury-orange"></i> ${t[e].services}
  `,document.getElementById("about_footer").innerHTML=`
  <i class="fas fa-chevron-right text-[10px] text-luxury-orange"></i> ${t[e].about}
  `,document.getElementById("contact_footer").innerHTML=`
  <i class="fas fa-chevron-right text-[10px] text-luxury-orange"></i> ${t[e].contact}
  `,A(e)}const a=document.getElementById("navbar");window.addEventListener("scroll",()=>{window.scrollY>50?(a.classList.add("glass-nav"),a.classList.remove("py-6"),a.classList.add("py-4")):(a.classList.remove("glass-nav"),a.classList.remove("py-4"),a.classList.add("py-6"))});const $=new IntersectionObserver(e=>{e.forEach(r=>{r.isIntersecting?r.target.classList.add("active"):r.target.classList.remove("active")})},{threshold:.1});document.querySelectorAll(".reveal").forEach(e=>$.observe(e));async function A(e){const r=document.getElementById("arrivals-container");try{const s=await T();if(!s||!Array.isArray(s))throw new Error("Invalid format received");r.innerHTML=s.map((o,c)=>`
          <div class="card-hover group relative bg-luxury-navy/30 rounded-xl overflow-hidden border border-white/5 hover:border-luxury-gold/30 reveal" 
               style="transition-delay: ${c*100}ms">
            <div class="relative h-64 overflow-hidden">
              <img src="/assets/images/${o.image}" alt="${o.name}" class="card-img w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
              <div class="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full text-luxury-gold text-xs font-bold border border-luxury-gold/20">
                $${o.price} <span class="day"> / Day</span>
              </div>
            </div>
            <div class="p-8">
              <h3 class="text-2xl font-serif text-white mb-2"> ${o.name}</h3>
              <p class="text-gray-500 text-sm mb-6 line-clamp-2">${o.description[e]}</p>

              <div class="grid grid-cols-3 gap-2 border-t border-white/5 pt-4 mb-8">
                <div class="text-center">
                  <i class="fas fa-tachometer-alt mb-2 text-luxury-orange block"></i>
                  <span class="text-xs text-gray-400 block">${o.top_speed} MPH</span>
                </div>
                <div class="text-center border-l border-white/5">
                  <i class="fas fa-stopwatch mb-2 text-luxury-orange block"></i>
                  <span class="text-xs text-gray-400 block">${o.zero_to_hundred}s</span>
                </div>
                <div class="text-center border-l border-white/5">
                  <i class="fas fa-gas-pump mb-2 text-luxury-orange block"></i>
                  <span class="text-xs text-gray-400 block">${o.engine_code}</span>
                </div>
              </div>

              <a href="cars.html?id=${o.id}" class="block w-full text-center py-3.5 rounded-lg bg-white/5 text-white hover:bg-gradient-luxury hover:text-black transition-all duration-300 uppercase text-xs tracking-widest font-bold reserve_now">
                Reserve Now
              </a>
            </div>
          </div>
        `).join(""),r.querySelectorAll(".reveal").forEach(o=>$.observe(o)),document.querySelectorAll(".reserve_now").forEach(o=>{o.textContent=t[e].reserve_now}),document.querySelectorAll(".day").forEach(o=>{const c=t[e].perday;o.textContent=c.replace("/","/ ")})}catch(s){console.error("Error loading arrivals:",s),r.innerHTML='<p class="text-white text-center col-span-full">Failed to load the fleet. Please try again later.</p>'}}
