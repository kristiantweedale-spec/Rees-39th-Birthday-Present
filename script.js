const startButton=document.getElementById("startButton");
const revealButton=document.getElementById("revealButton");
const replayButton=document.getElementById("replayButton");
const story=document.getElementById("story");
const destination=document.getElementById("destination");
startButton.addEventListener("click",()=>story.scrollIntoView({behavior:"smooth"}));
revealButton.addEventListener("click",()=>{destination.scrollIntoView({behavior:"smooth"});setTimeout(()=>{launchConfetti();animateBoard();if(navigator.vibrate)navigator.vibrate([40,35,80])},650)});
replayButton.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");if(entry.target.classList.contains("flight-board"))animateBoard()}})},{threshold:.15});
document.querySelectorAll(".reveal").forEach((el,i)=>{el.style.transitionDelay=`${Math.min(i%4,3)*80}ms`;observer.observe(el)});
window.addEventListener("load",()=>{document.querySelector(".hero-content").classList.add("visible");updateClock();setInterval(updateClock,30000)});
function updateClock(){const el=document.getElementById("boardClock");if(!el)return;el.textContent=new Intl.DateTimeFormat("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date())}
let boardAnimated=false;
function animateBoard(){if(boardAnimated)return;boardAnimated=true;const chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";document.querySelectorAll(".flip-text").forEach((el,index)=>{const final=el.dataset.value;let step=0;const max=10+index*2;const timer=setInterval(()=>{el.classList.remove("flipping");void el.offsetWidth;el.classList.add("flipping");el.textContent=final.split("").map((ch,i)=>step>max-i?ch:chars[Math.floor(Math.random()*chars.length)]).join("");step++;if(step>max+final.length){clearInterval(timer);el.textContent=final;el.classList.remove("flipping")}},70)})}
function launchConfetti(){const canvas=document.getElementById("confetti"),ctx=canvas.getContext("2d"),dpr=Math.min(window.devicePixelRatio||1,2),rect=canvas.getBoundingClientRect();canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;ctx.scale(dpr,dpr);const pieces=Array.from({length:150},()=>({x:rect.width/2+(Math.random()-.5)*140,y:rect.height*.22,vx:(Math.random()-.5)*12,vy:-Math.random()*9-4,gravity:.16+Math.random()*.08,rotation:Math.random()*Math.PI,spin:(Math.random()-.5)*.25,size:5+Math.random()*8,color:["#d9b36c","#f5f0e6","#2d7b66","#ffffff","#e68484"][Math.floor(Math.random()*5)]}));let frame=0;(function animate(){ctx.clearRect(0,0,rect.width,rect.height);pieces.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.rotation+=p.spin;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rotation);ctx.fillStyle=p.color;ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2);ctx.restore()});frame++;if(frame<240)requestAnimationFrame(animate);else ctx.clearRect(0,0,rect.width,rect.height)})()}


function initRealMap(){
  if(!window.L || !document.getElementById("realMap")) return;
  const map=L.map("realMap",{scrollWheelZoom:false,zoomControl:true}).setView([53.15,-7.2],6);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{
    maxZoom:18,
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
  }).addTo(map);
  const icon=L.divIcon({className:"",html:'<div class="map-pin"></div>',iconSize:[26,34],iconAnchor:[13,32],popupAnchor:[0,-31]});
  const stops=[
    {name:"Bristol Airport",coords:[51.3827,-2.7191],copy:"The adventure begins — a direct flight to Dublin."},
    {name:"Dublin",coords:[53.3498,-6.2603],copy:"Touch down, collect the hire car and head west."},
    {name:"Galway City",coords:[53.2707,-9.0568],copy:"Colourful streets, music, cosy pubs and our base for the trip."},
    {name:"Diamond Hill",coords:[53.5489,-9.9125],copy:"A panoramic view across the coast of Connemara."},
    {name:"Kylemore Abbey",coords:[53.5618,-9.8890],copy:"A fairytale abbey beside the lake."},
    {name:"Dog’s Bay",coords:[53.3790,-9.9615],copy:"White shell sand and clear Atlantic water."}
  ];
  stops.forEach(s=>L.marker(s.coords,{icon}).addTo(map).bindPopup(`<strong>${s.name}</strong><br>${s.copy}`));
  L.polyline([stops[0].coords,stops[1].coords],{color:"#d9b36c",weight:4,dashArray:"10 12",opacity:.95}).addTo(map);
  L.polyline([stops[1].coords,stops[2].coords,stops[3].coords,stops[4].coords,stops[5].coords],{color:"#155247",weight:5,opacity:.9}).addTo(map);
  map.fitBounds(L.latLngBounds(stops.map(s=>s.coords)),{padding:[45,45]});
  setTimeout(()=>map.invalidateSize(),400);
}
window.addEventListener("load",initRealMap);
