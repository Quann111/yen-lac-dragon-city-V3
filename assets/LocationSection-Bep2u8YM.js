import{j as t}from"./index-CeF7u2-8.js";import{g as h,r as s}from"./vendor-BPwQdSG7.js";import{g as a}from"./animations-CB87Sc6I.js";import{S as x}from"./ScrollTrigger-Cv03IO65.js";import{r as u}from"./maps-jBRwKcs2.js";import{B as m,G as g,h as p,i as f}from"./icons-dLA7ovUD.js";var v=u();const l=h(v);a.registerPlugin(x);const i=({icon:r,title:o,time:n})=>t.jsxs("div",{className:`reveal-on-scroll flex items-center gap-4 p-5 rounded-2xl shadow-lg border-l-4 transition-all duration-300 hover:transform hover:translate-x-2
    bg-white text-royal-900 border-royal-500 hover:shadow-xl`,children:[t.jsx("div",{className:`p-3 rounded-full transition-colors duration-300
      bg-royal-100 text-royal-600`,children:r}),t.jsxs("div",{children:[t.jsx("h4",{className:"font-bold text-sm md:text-base leading-tight",children:o}),t.jsx("p",{className:"text-xs mt-1 transition-colors text-gray-500",children:n})]})]}),z=()=>{const r=s.useRef(null),o=s.useRef(null),n=s.useRef(null),c=()=>{var e;(e=document.getElementById("contact"))==null||e.scrollIntoView({behavior:"smooth"}),window.history.pushState(null,"","/yen-lac-dragon-city-V3/#contact"),window.dispatchEvent(new CustomEvent("nav-change",{detail:"contact"}))};return s.useEffect(()=>{if(!o.current||n.current)return;const e=l.map(o.current,{center:[21.245444,105.722583],zoom:16,scrollWheelZoom:!0,zoomControl:!1,attributionControl:!1});l.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19}).addTo(e);const d=l.divIcon({className:"custom-pin",html:`<div style="
        background-color: #D4AF37; 
        width: 30px; 
        height: 30px; 
        border-radius: 50% 50% 0 50%; 
        transform: rotate(45deg);
        border: 3px solid white; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 10px; 
          height: 10px; 
          background-color: white; 
          border-radius: 50%;
        "></div>
      </div>`,iconSize:[30,30],iconAnchor:[15,30],popupAnchor:[0,-30]});return l.marker([21.245444,105.722583],{icon:d}).addTo(e).bindPopup('<div class="text-center"><b class="text-royal-600">Yên Lạc Dragon City</b><br/><span class="text-xs text-gray-600">Tâm điểm thịnh vượng</span></div>').openPopup(),n.current=e,()=>{e.remove(),n.current=null}},[]),s.useEffect(()=>{const e=a.context(()=>{r.current&&a.fromTo(r.current,{opacity:0,scale:.95,filter:"blur(10px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:1.5,ease:"power3.out",scrollTrigger:{trigger:r.current,start:"top 70%"}})},r);return()=>e.revert()},[]),t.jsx("section",{className:"relative w-full overflow-hidden transition-colors duration-500 bg-white",children:t.jsx("div",{className:"container mx-auto",children:t.jsxs("div",{className:"flex flex-col lg:flex-row h-full items-center",children:[t.jsxs("div",{className:"w-full lg:w-1/2 py-16 px-8 lg:pl-16 flex flex-col justify-center relative z-10",children:[t.jsxs("h2",{className:`text-4xl lg:text-5xl font-serif mb-6 leading-tight transition-colors duration-300 reveal-on-scroll
              text-royal-600`,children:["Vị Thế Kim Cương: ",t.jsx("br",{})," Nơi Giá Trị Hội Tụ"]}),t.jsx("p",{className:`font-light mb-10 leading-relaxed transition-colors duration-300 reveal-on-scroll
              text-gray-600`,children:"Tọa lạc tại tâm điểm thịnh vượng, kết nối mọi tiện ích sống, làm việc và giải trí. Một vị trí chiến lược, đảm bảo cuộc sống tiện nghi và tiềm năng đầu tư vượt trội."}),t.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5 mb-10",children:[t.jsx(i,{icon:t.jsx(m,{size:22}),title:"Trung tâm thành phố",time:"5 phút di chuyển"}),t.jsx(i,{icon:t.jsx(g,{size:22}),title:"Trường học quốc tế",time:"10 phút di chuyển"}),t.jsx(i,{icon:t.jsx(p,{size:22}),title:"Trung tâm thương mại",time:"15 phút di chuyển"}),t.jsx(i,{icon:t.jsx(f,{size:22}),title:"Bệnh viện",time:"12 phút di chuyển"})]}),t.jsx("button",{onClick:c,className:`btn-luxury self-start flex items-center justify-center px-10 py-4 rounded-full uppercase tracking-widest font-serif text-sm font-bold shadow-lg transform hover:-translate-y-1 transition-all duration-300 reveal-on-scroll
              bg-royal-600 text-white hover:bg-royal-700 hover:shadow-royal-500/50`,children:"Liên Hệ Ngay"})]}),t.jsxs("div",{ref:r,className:"w-full lg:w-1/2 h-[400px] lg:h-[500px] relative bg-gray-200 overflow-hidden shadow-2xl z-0 rounded-2xl",children:[t.jsx("div",{ref:o,className:"w-full h-full z-0",style:{filter:"grayscale(0.1)"}}),t.jsx("div",{className:"absolute inset-0 pointer-events-none border-[10px] border-white/50 shadow-inner z-10"})]})]})})})};export{z as default};
