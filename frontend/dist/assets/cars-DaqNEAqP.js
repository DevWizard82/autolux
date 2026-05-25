import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import"./common-DbpXaP5I.js";import{f as U}from"./api-trhzDeCA.js";import{t as r}from"./translations-g1k9azl_.js";const f=document.getElementById("card-container"),p=document.getElementById("cities"),C=document.querySelectorAll(".category-btn"),v=document.getElementById("currencies"),m=document.getElementById("currencies1"),$=document.getElementById("search");let y=document.getElementById("languages"),b=document.getElementById("languages1");async function h(e,a="Toutes_les_villes",n="All",s="fr"){if(f.innerHTML="",s=localStorage.getItem("language")||"fr",!e||!Array.isArray(e)){console.error("Invalid 'cars' array passed to displayCars:",e),f.innerHTML="<p>Aucune voiture trouvée.</p>";return}e.filter(c=>{const t=n==="All"||c.category===n.toLowerCase();return(a==="Toutes_les_villes"||c.locations.fr.includes(a))&&t}).forEach(c=>{const t=document.createElement("div");t.className="card",t.innerHTML=`
  <div class="card_image">
    <img src="assets/images/${c.image}" alt="${c.name}">
  </div>
  <div class="card_content">
    <h3 class="${s==="ar"?"rtl":"ltr"}">${c.name}</h3>
    <p class="${s==="ar"?"rtl":"ltr"}">${c.description[s]}</p>
    <div class="locations ${s==="ar"?"rtl":"ltr"}">
      <span class="available">${r[s].disponible}</span>
      <span class="carlocations">${c.locations[s]}</span>
    </div>
    <div class="price ${s==="ar"?"rtlprice":"ltrprice"}">
      <span class="priceValue" data-original-value="${c.price}" data-currency="EUR">
        ${c.price} EUR
      </span><span class="perday">/jour</span>
    </div>
    <div class="btn_container">
      <button class="reserver_btn" data-id="${c.id}" id="${c.name.replace(/[- ]/g,"_")}">Réserver</button>
    </div>
  </div>
`,f.appendChild(t),L(t)}),v.value!=="EUR"&&u(v.value),m.value!=="EUR"&&u(m.value)}function L(e){e.addEventListener("mousemove",a=>{const n=e.getBoundingClientRect(),s=a.clientX-n.left,o=a.clientY-n.top,c=n.width/2,t=n.height/2,i=(o-t)/10,d=(s-c)/10;e.style.transform=`rotateX(${i}deg) rotateY(${d}deg)`}),e.addEventListener("mouseleave",()=>{e.style.transform="rotateX(0deg) rotateY(0deg)"})}document.querySelector('.category-btn[data-default="true"]').classList.add("active");let S={};async function T(){try{S=(await(await fetch("https://open.er-api.com/v6/latest/EUR")).json()).rates||{}}catch(e){console.error("Failed to fetch exchange rates:",e)}}async function k(e,a){return S[a]?(e*S[a]).toFixed(2):null}async function u(e){const a=document.querySelectorAll(".priceValue");for(const n of a){const s=parseFloat(n.getAttribute("data-original-value")),o=await k(s,e);o?n.textContent=`${o} ${e}`:n.textContent="Conversion failed"}}document.getElementById("currencies").addEventListener("change",async e=>{const a=e.target.value;m.value=a,await u(a)});document.getElementById("currencies1").addEventListener("change",async e=>{const a=e.target.value;v.value=a,await u(a)});async function M(e,a,n){f.innerHTML="",e.filter(o=>o.name.toUpperCase().includes(a.toUpperCase())).forEach(o=>{const c=document.createElement("div");c.className="card",c.innerHTML=`
  <div class="card_image">
    <img src="assets/images/${o.image}" alt="${o.name}">
  </div>
  <div class="card_content">
    <h3 class="${n==="ar"?"rtl":"ltr"}">${o.name}</h3>
    <p class="${n==="ar"?"rtl":"ltr"}">${o.description[n]}</p>
    <div class="locations ${n==="ar"?"rtl":"ltr"}">
      <span class="available">${r[n].disponible}</span>
      <span class="carlocations">${o.locations[n]}</span>
    </div>
    <div class="price ${n==="ar"?"rtlprice":"ltrprice"}">
      <span class="priceValue" data-original-value="${o.price}" data-currency="EUR">
        ${o.price} EUR
      </span><span class="perday">/jour</span>
    </div>
    <div class="btn_container">
      <button class="reserver_btn" data-id="${o.id}" id="${o.name.replace(/[- ]/g,"_")}">Réserver</button>
    </div>
  </div>
`,f.appendChild(c),L(c)}),v.value!=="EUR"&&u(v.value),m.value!=="EUR"&&u(m.value)}function x(e){if(!e)return;localStorage.setItem("language",e),document.querySelectorAll("nav a[href*='contact.html']").forEach(l=>l.textContent=r[e].contact);const n=document.getElementById("fleet"),s=document.querySelector(".all"),o=document.querySelector(".casa"),c=document.querySelector(".marrakech"),t=document.querySelector(".tanger"),i=document.querySelector(".rabat"),d=document.querySelector(".search"),g=document.getElementById("allCategories"),I=document.getElementById("hypercar"),q=document.getElementById("luxury"),A=document.getElementById("electric"),B=document.getElementById("sport"),_=document.querySelectorAll("a[href*='cars.html']"),R=document.querySelectorAll("a[href*='about.html']"),w=document.querySelectorAll("a[href*='login.html']");n.textContent=r[e].notreflotte,s.textContent=r[e].touteslesvilles,o.textContent=r[e].casablanca,c.textContent=r[e].marrakech,t.textContent=r[e].tanger,i.textContent=r[e].rabat,d.placeholder=r[e].placeholder,g.textContent=r[e].tout,I.textContent=r[e].hypercar,q.textContent=r[e].luxe,A.textContent=r[e].electrique,B.textContent=r[e].sport,_.forEach(l=>l.textContent=r[e].fleet),R.forEach(l=>l.textContent=r[e].about),w.forEach(l=>l.textContent=r[e].login),setTimeout(()=>{document.querySelectorAll(".available").forEach(l=>{l.textContent=r[e].disponible})},50),setTimeout(()=>{document.querySelectorAll(".perday").forEach(l=>{l.textContent=r[e].perday})},50),setTimeout(()=>{document.querySelectorAll(".reserver_btn").forEach(l=>{l.textContent=r[e].reserver})},50),setTimeout(()=>{document.querySelectorAll(".modeltext").forEach(l=>{l.textContent=r[e].vue3d})},50)}let E;document.body.addEventListener("click",e=>{const a=e.target.closest(".reserver_btn");if(a){const n=a.getAttribute("id");localStorage.setItem("id",n),E=a.getAttribute("data-id"),document.body.classList.add("fade-out"),setTimeout(()=>{window.location.href=`book.html?id=${encodeURIComponent(E)}`},500)}});async function V(){const e=await U(),a=localStorage.getItem("language")||"fr",n=localStorage.getItem("currency")||"EUR";await T(),x(a),v.value=n,m.value=n;const s=p.value,o=document.querySelector(".category-btn.active")?.dataset.originalValue||"All";await h(e,s,o,a),n!=="EUR"&&await u(n),y.value=a,b.value=a,C.forEach(t=>{t.addEventListener("click",()=>{C.forEach(g=>g.classList.remove("active")),t.classList.add("active");const i=p.value,d=t.dataset.originalValue;h(e,i,d,y.value)})}),p.addEventListener("change",t=>{const i=t.target.value,d=document.querySelector(".category-btn.active").dataset.originalValue;h(e,i,d,y.value)}),$.addEventListener("keyup",()=>{C.forEach(t=>t.classList.remove("active")),document.querySelector('.category-btn[data-default="true"]').classList.add("active"),p.value="Toutes_les_villes",M(e,$.value,y.value)});function c(t){x(t),y.value=t,b.value=t;const i=p.value,d=document.querySelector(".category-btn.active").dataset.originalValue;h(e,i,d,t)}y.addEventListener("change",t=>c(t.target.value)),b.addEventListener("change",t=>c(t.target.value)),v.addEventListener("change",t=>{m.value=t.target.value,localStorage.setItem("currency",t.target.value),u(t.target.value)}),m.addEventListener("change",t=>{v.value=t.target.value,localStorage.setItem("currency",t.target.value),u(t.target.value)}),document.body.addEventListener("click",t=>{const i=t.target.closest(".reserver_btn");if(i){const d=i.id;localStorage.setItem("id",d),E=i.getAttribute("data-id"),document.body.classList.add("fade-out"),setTimeout(()=>window.location.href=`book.html?id=${encodeURIComponent(E)}`,500)}})}function H(e){document.getElementById("carModal").classList.remove("active"),document.body.style.overflow=""}document.addEventListener("keydown",e=>{e.key==="Escape"&&H()});await V();
