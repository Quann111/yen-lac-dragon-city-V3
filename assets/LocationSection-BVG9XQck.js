import{j as e}from"./index-2dKKW9tp.js";import{g as h,r as o}from"./vendor-BPwQdSG7.js";import{g as c}from"./animations-CB87Sc6I.js";import{S as m}from"./ScrollTrigger-Cv03IO65.js";import{r as x}from"./maps-jBRwKcs2.js";import{B as g,G as p,j as f,k as v}from"./icons-BLzrB7lZ.js";var y=x();const a=h(y);c.registerPlugin(m);const i=({icon:r,title:n,time:s})=>e.jsxs("div",{className:`reveal-on-scroll flex items-center gap-4 p-5 rounded-2xl shadow-lg border-l-4 transition-all duration-300 hover:transform hover:translate-x-2
    bg-white text-royal-900 border-royal-500 hover:shadow-xl
    dark:bg-navy-800 dark:text-white dark:border-gold-500 dark:hover:shadow-glow-gold`,children:[e.jsx("div",{className:`p-3 rounded-full transition-colors duration-300
      bg-royal-100 text-royal-600
      dark:bg-gold-500/20 dark:text-gold-400`,children:r}),e.jsxs("div",{children:[e.jsx("h4",{className:"font-bold text-sm md:text-base leading-tight",children:n}),e.jsx("p",{className:"text-xs mt-1 transition-colors text-gray-500 dark:text-gray-400",children:s})]})]}),T=()=>{const r=o.useRef(null),n=o.useRef(null),s=o.useRef(null),u=()=>{var t;(t=document.getElementById("contact"))==null||t.scrollIntoView({behavior:"smooth"}),window.dispatchEvent(new CustomEvent("nav-change",{detail:"contact"}))};return o.useEffect(()=>{if(!n.current||s.current)return;const t=a.map(n.current,{center:[21.1695,105.5768],zoom:16,scrollWheelZoom:!0,zoomControl:!1,attributionControl:!1});a.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19}).addTo(t);const l=a.divIcon({className:"custom-pin",html:`<div style="
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
      </div>`,iconSize:[30,30],iconAnchor:[15,30],popupAnchor:[0,-30]});return a.marker([21.1695,105.5768],{icon:l}).addTo(t).bindPopup('<div class="text-center"><b class="text-royal-600">Yên Lạc Dragon City</b><br/><span class="text-xs text-gray-600">Tâm điểm thịnh vượng</span></div>').openPopup(),s.current=t,()=>{t.remove(),s.current=null}},[]),o.useEffect(()=>{const t=c.context(()=>{r.current&&c.fromTo(r.current,{opacity:0,scale:.95,filter:"blur(10px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:1.5,ease:"power3.out",scrollTrigger:{trigger:r.current,start:"top 70%"}})},r);return()=>t.revert()},[]),o.useEffect(()=>{const t=r.current;if(!t)return;const l=()=>{document.body.style.overflow="hidden"},d=()=>{document.body.style.overflow="auto"};return t.addEventListener("mouseenter",l),t.addEventListener("mouseleave",d),()=>{t.removeEventListener("mouseenter",l),t.removeEventListener("mouseleave",d),document.body.style.overflow="auto"}},[]),e.jsx("section",{className:"relative w-full overflow-hidden transition-colors duration-500 bg-white dark:bg-navy-900",children:e.jsx("div",{className:"container mx-auto",children:e.jsxs("div",{className:"flex flex-col lg:flex-row h-full",children:[e.jsxs("div",{className:"w-full lg:w-1/2 py-16 px-8 lg:pl-16 flex flex-col justify-center relative z-10",children:[e.jsxs("h2",{className:`text-4xl lg:text-5xl font-serif mb-6 leading-tight transition-colors duration-300 reveal-on-scroll
              text-royal-600 dark:text-gold-500`,children:["Vị Thế Kim Cương: ",e.jsx("br",{})," Nơi Giá Trị Hội Tụ"]}),e.jsx("p",{className:`font-light mb-10 leading-relaxed transition-colors duration-300 reveal-on-scroll
              text-gray-600 dark:text-gray-300`,children:"Tọa lạc tại tâm điểm thịnh vượng, kết nối mọi tiện ích sống, làm việc và giải trí. Một vị trí chiến lược, đảm bảo cuộc sống tiện nghi và tiềm năng đầu tư vượt trội."}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5 mb-10",children:[e.jsx(i,{icon:e.jsx(g,{size:22}),title:"Trung tâm thành phố",time:"5 phút di chuyển"}),e.jsx(i,{icon:e.jsx(p,{size:22}),title:"Trường học quốc tế",time:"10 phút di chuyển"}),e.jsx(i,{icon:e.jsx(f,{size:22}),title:"Trung tâm thương mại",time:"15 phút di chuyển"}),e.jsx(i,{icon:e.jsx(v,{size:22}),title:"Bệnh viện",time:"12 phút di chuyển"})]}),e.jsx("button",{onClick:u,className:`btn-luxury self-start flex items-center justify-center px-10 py-4 rounded-full uppercase tracking-widest font-serif text-sm font-bold shadow-lg transform hover:-translate-y-1 transition-all duration-300 reveal-on-scroll
              bg-royal-600 text-white hover:bg-royal-700 hover:shadow-royal-500/50
              dark:bg-gold-500 dark:text-navy-900 dark:hover:bg-white dark:hover:text-royal-900 dark:shadow-glow-gold`,children:"Liên Hệ Ngay"})]}),e.jsxs("div",{ref:r,className:"w-full lg:w-1/2 h-[40vh] lg:h-auto relative bg-gray-200 overflow-hidden shadow-2xl z-0",children:[e.jsx("div",{ref:n,className:"w-full h-full z-0",style:{filter:"grayscale(0.1)"}}),e.jsx("div",{className:"absolute inset-0 pointer-events-none border-[10px] border-white/50 dark:border-navy-900/50 shadow-inner z-10"})]})]})})})};export{T as default};
