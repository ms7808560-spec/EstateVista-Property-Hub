const grid = document.getElementById("propertyGrid");
const count = document.getElementById("resultsCount");
let activeType = "all";
let searchLocation = "";
let maxPrice = Infinity;

const formatPrice = (value) => "PKR " + (value / 10000000).toFixed(2).replace(/\.?0+$/,"") + " Cr";

function renderProperties(){
  const filtered = properties.filter(p =>
    (activeType === "all" || p.type === activeType) &&
    (p.location.toLowerCase().includes(searchLocation) || p.title.toLowerCase().includes(searchLocation)) &&
    p.price <= maxPrice
  );
  count.textContent = `${filtered.length} properties found`;
  if(!filtered.length){grid.innerHTML='<div class="empty-state">No properties match your search. Try changing the filters.</div>';return;}
  grid.innerHTML = filtered.map(p=>`
    <article class="property-card">
      <div class="property-image"><img src="${p.image}" alt="${p.title}" loading="lazy"><span class="badge">${p.tag}</span>
        <button class="favorite" data-favorite="${p.id}" aria-label="Save ${p.title}" title="Save property">♡</button></div>
      <div class="property-info"><span class="property-location">⌖ &nbsp;${p.location}</span><h3>${p.title}</h3>
        <div class="property-meta"><span>⌂ ${p.beds} Beds</span><span>♧ ${p.baths} Baths</span><span>▱ ${p.area}</span></div>
        <div class="property-bottom"><span class="price">${p.priceLabel}</span><button class="details-link" data-details="${p.id}">View details ↗</button></div>
      </div>
    </article>`).join("");
}

document.getElementById("filterTabs").addEventListener("click",e=>{
  const btn=e.target.closest("[data-filter]"); if(!btn)return;
  activeType=btn.dataset.filter;
  document.querySelectorAll(".filter-tab").forEach(b=>b.classList.toggle("active",b===btn));
  renderProperties();
});
document.getElementById("searchForm").addEventListener("submit",e=>{
  e.preventDefault();
  searchLocation=document.getElementById("locationSearch").value.trim().toLowerCase();
  const value=document.getElementById("priceSearch").value;
  maxPrice=value==="all"?Infinity:Number(value);
  activeType=document.getElementById("typeSearch").value;
  document.querySelectorAll(".filter-tab").forEach(b=>b.classList.toggle("active",b.dataset.filter===activeType));
  renderProperties();
  document.getElementById("properties").scrollIntoView({behavior:"smooth"});
});
document.getElementById("resetFilters").addEventListener("click",()=>{
  activeType="all";searchLocation="";maxPrice=Infinity;
  document.getElementById("searchForm").reset();
  document.querySelectorAll(".filter-tab").forEach(b=>b.classList.toggle("active",b.dataset.filter==="all"));
  renderProperties();
});
grid.addEventListener("click",e=>{
  const fav=e.target.closest("[data-favorite]");
  if(fav){fav.classList.toggle("saved");fav.textContent=fav.classList.contains("saved")?"♥":"♡";return;}
  const detail=e.target.closest("[data-details]");if(!detail)return;
  const p=properties.find(item=>item.id===Number(detail.dataset.details));
  document.getElementById("modalContent").innerHTML=`<img class="modal-image" src="${p.image}" alt="${p.title}"><div class="modal-body"><span class="property-location">${p.type} · ${p.location}</span><h2>${p.title}</h2><div class="price">${p.priceLabel}</div><p>${p.description}</p><div class="property-meta"><span>⌂ ${p.beds} Beds</span><span>♧ ${p.baths} Baths</span><span>▱ ${p.area}</span></div><p><a class="btn btn-dark" href="#contact" id="modalEnquire">Enquire about this property ↗</a></p></div>`;
  const modal=document.getElementById("propertyModal");modal.showModal();
  document.getElementById("modalEnquire").addEventListener("click",()=>modal.close());
});
document.getElementById("modalClose").addEventListener("click",()=>document.getElementById("propertyModal").close());

const menuToggle=document.getElementById("menuToggle"), mainNav=document.getElementById("mainNav");
menuToggle.addEventListener("click",()=>{const open=mainNav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",open);});
mainNav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{mainNav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");}));

document.getElementById("contactForm").addEventListener("submit",e=>{
  e.preventDefault();
  const data=new FormData(e.currentTarget);
  const message=`Hi EstateVista, my name is ${data.get("name")}. Email: ${data.get("email")}. Interest: ${data.get("interest")}. Message: ${data.get("message")}`;
  document.getElementById("formMessage").textContent="Thanks! Your email app will open so you can send this enquiry.";
  window.location.href=`mailto:hello@estatevista.example?subject=${encodeURIComponent("Website property enquiry")}&body=${encodeURIComponent(message)}`;
});
document.getElementById("year").textContent=new Date().getFullYear();
renderProperties();