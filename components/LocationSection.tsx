import React, { useEffect, useRef, useState } from 'react';
import { Building2, GraduationCap, ShoppingBag, PlusSquare, Map as MapIcon, ShieldCheck, Landmark, Trophy, X } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

gsap.registerPlugin(ScrollTrigger);

interface LocationCardProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  time: string;
  isActive?: boolean;
  onClick?: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ icon, title, time, isActive, onClick }) => (
  <div 
    onClick={onClick}
    className={`location-card flex items-center gap-4 p-5 rounded-2xl shadow-lg border-l-4 transition-all duration-300 hover:transform hover:translate-x-2 cursor-pointer
    ${isActive ? 'bg-royal-50 border-royal-600 shadow-xl scale-105' : 'bg-white border-royal-500 hover:shadow-xl'} text-royal-900 font-body`}
  >
    <div className={`p-3 rounded-full transition-colors duration-300
      ${isActive ? 'bg-royal-600 text-white' : 'bg-royal-100 text-royal-600'}`}
    >
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-sm md:text-base leading-tight">{title}</h4>
      <p className="text-xs mt-1 transition-colors text-gray-500">{time}</p>
    </div>
  </div>
);

const PROJECT_COORDS: [number, number] = [21.245444, 105.722583];

const LOCATIONS_DATA = [
  { id: 1, title: "UBND Huyện Yên Lạc", displayTitle: <>UBND Huyện<br/>Yên Lạc</>, time: "1 phút di chuyển", coords: [21.248444, 105.724583] as [number, number], icon: <Building2 size={22} /> },
  { id: 2, title: "Trường THCS CLC", displayTitle: <>Trường THCS<br/>Chất Lượng Cao</>, time: "2 phút di chuyển", coords: [21.239444, 105.726583] as [number, number], icon: <GraduationCap size={22} /> },
  { id: 3, title: "Công An Huyện", time: "2 phút di chuyển", coords: [21.250444, 105.717583] as [number, number], icon: <ShieldCheck size={22} /> },
  { id: 4, title: "Quảng Trường", time: "3 phút di chuyển", coords: [21.255444, 105.722583] as [number, number], icon: <Landmark size={22} /> },
  { id: 5, title: "Bệnh viện đa khoa", time: "3 phút di chuyển", coords: [21.237444, 105.714583] as [number, number], icon: <PlusSquare size={22} /> },
  { id: 6, title: "Sân Vận Động", time: "4 phút di chuyển", coords: [21.257444, 105.727583] as [number, number], icon: <Trophy size={22} /> },
  { id: 7, title: "Chợ TT. Yên Lạc", time: "4 phút di chuyển", coords: [21.233444, 105.724583] as [number, number], icon: <ShoppingBag size={22} /> },
  { id: 8, title: "Trường THPT Yên Lạc", displayTitle: <>Trường THPT<br/>Yên Lạc</>, time: "5 phút di chuyển", coords: [21.260444, 105.712583] as [number, number], icon: <GraduationCap size={22} /> },
  { id: 9, title: "Đảng Ủy Yên Lạc", time: "5 phút di chuyển", coords: [21.230444, 105.732583] as [number, number], icon: <Building2 size={22} /> },
];

const LocationSection: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [activeLocationId, setActiveLocationId] = useState<number | null>(null);
  const [isMobilePopupOpen, setIsMobilePopupOpen] = useState(false);

  const updateMapRoute = (location: typeof LOCATIONS_DATA[0]) => {
    if (mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      
      // Initialize route layer if not exists
      if (!routeLayerRef.current) {
        routeLayerRef.current = L.layerGroup().addTo(map);
      }
      
      const routeLayer = routeLayerRef.current;
      routeLayer.clearLayers();

      // Destination Marker
      const destIcon = L.divIcon({
        className: 'dest-pin',
        html: `<div style="
          background-color: #ef4444; 
          width: 20px; 
          height: 20px; 
          border-radius: 50%; 
          border: 3px solid white; 
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      L.marker(location.coords, { icon: destIcon })
        .addTo(routeLayer)
        .bindPopup(`<div class="text-center font-bold text-sm">${location.title}<br/><span class="text-gray-500 font-normal">${location.time}</span></div>`)
        .openPopup();

      // Route Line
      const latlngs = [PROJECT_COORDS, location.coords];
      L.polyline(latlngs, { 
        color: '#D4AF37', 
        weight: 4, 
        opacity: 0.8, 
        dashArray: '10, 10',
        lineCap: 'round'
      }).addTo(routeLayer);

      // Fit bounds with padding
      map.fitBounds(L.latLngBounds(latlngs), { padding: [50, 50], maxZoom: 16, animate: true, duration: 1 });
    }
  };

  const handleLocationClick = (location: typeof LOCATIONS_DATA[0]) => {
    setActiveLocationId(location.id);
    
    if (window.innerWidth < 1024) {
      setIsMobilePopupOpen(true);
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
        updateMapRoute(location);
      }, 300);
    } else {
      updateMapRoute(location);
    }
  };


  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '/yen-lac-dragon-city-V3/#collection');
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'collection' }));
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    window.history.pushState(null, '', '/yen-lac-dragon-city-V3/#contact');
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'contact' }));
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) return;

    // Fix for default marker icon issues in some builds, though we use custom icon below
    // Initialize Map
    const map = L.map(mapElementRef.current, {
      center: [21.245444, 105.722583],
      zoom: 16,
      scrollWheelZoom: true, // Enable scroll zoom as requested
      zoomControl: false,
      attributionControl: false
    });

    // Add Tile Layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    // Custom Marker Icon
    const customIcon = L.divIcon({
      className: 'custom-pin',
      html: `<div style="
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
      </div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30]
    });

    // Add Marker
    L.marker([21.245444, 105.722583], { icon: customIcon })
      .addTo(map)
      .bindPopup('<div class="text-center"><b class="text-royal-600">Yên Lạc Dragon City</b><br/><span class="text-xs text-gray-600">Tâm điểm thịnh vượng</span></div>')
      .openPopup();

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (mapContainerRef.current) {
        gsap.fromTo(mapContainerRef.current,
          { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
          {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: mapContainerRef.current,
              start: 'top 70%',
            }
          }
        );
      }
    }, mapContainerRef);

    return () => ctx.revert();
  }, []);

  // Initialize Intersection Observer for lazy-loaded content
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      const elements = sectionRef.current.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden transition-colors duration-500 bg-white">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row h-full items-center">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2 py-16 px-8 lg:pl-16 flex flex-col justify-center relative z-10">
            <h2 className="text-lg md:text-2xl lg:text-3xl font-body font-bold mb-6 leading-tight transition-colors duration-300 reveal-on-scroll
      text-royal-600 uppercase"
    >
              Vị Thế Kim Cương: <br /> Nơi Giá Trị Hội Tụ
            </h2>
            <p className="font-body mb-10 leading-relaxed transition-colors duration-300 reveal-on-scroll
              text-gray-600 [text-wrap:pretty]"
            >
              Tọa lạc tại tâm điểm thịnh vượng, kết nối mọi tiện ích sống, làm việc và giải trí. Một vị trí chiến lược, đảm bảo cuộc sống tiện nghi và tiềm năng đầu tư vượt trội.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-10">
               {LOCATIONS_DATA.map((loc) => (
                 <LocationCard 
                   key={loc.id}
                   icon={loc.icon}
                   title={loc.displayTitle || loc.title}
                   time={loc.time}
                   isActive={activeLocationId === loc.id}
                   onClick={() => handleLocationClick(loc)}
                 />
               ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 reveal-on-scroll">
              <button 
                onClick={scrollToCollection}
                className="btn-luxury flex items-center justify-center px-10 py-4 rounded-full uppercase tracking-widest font-body font-bold text-sm shadow-lg transform hover:-translate-y-1 transition-all duration-300
                bg-royal-600 text-white hover:bg-royal-700 hover:shadow-royal-500/50"
              >
                <ShoppingBag size={18} className="mr-2" />
                Sản Phẩm
              </button>
              
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=21.245444,105.722583"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-luxury flex items-center justify-center gap-2 px-10 py-4 rounded-full uppercase tracking-widest font-body font-bold text-sm shadow-lg transform hover:-translate-y-1 transition-all duration-300
                bg-white text-royal-600 border border-royal-600 hover:bg-royal-50 hover:shadow-md"
              >
                <MapIcon size={18} />
                Chỉ đường
              </a>
            </div>
          </div>

          {/* Backdrop */}
          {isMobilePopupOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobilePopupOpen(false)}
            ></div>
          )}

          {/* Map Visual (Interactive Leaflet Map) */}
          <div 
            ref={mapContainerRef} 
            className={`transition-all duration-500 shadow-2xl overflow-hidden bg-gray-200
              ${isMobilePopupOpen 
                ? 'fixed top-1/2 left-1/2 w-[90vw] h-[60vh] rounded-2xl border-4 border-white' 
                : 'w-full lg:w-1/2 h-[400px] lg:h-[500px] relative rounded-2xl z-0'
              }
            `}
            style={{ 
              transform: isMobilePopupOpen ? 'translate(-50%, -50%)' : undefined,
              zIndex: isMobilePopupOpen ? 50 : undefined,
              opacity: isMobilePopupOpen ? 1 : undefined,
              filter: isMobilePopupOpen ? 'none' : undefined
            }}
          >
             {/* Close Button */}
             {isMobilePopupOpen && (
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   setIsMobilePopupOpen(false);
                 }}
                 className="absolute top-2 right-2 z-[1000] p-2 bg-white rounded-full shadow-lg text-gray-800 hover:bg-gray-100 transition-colors"
               >
                 <X size={20} />
               </button>
             )}

             <div ref={mapElementRef} className="w-full h-full z-0" style={{ filter: 'grayscale(0.1)' }}></div>
             
             {/* Decorative Overlay for Theme Integration */}
             <div className="absolute inset-0 pointer-events-none border-[10px] border-white/50 shadow-inner z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LocationSection;
