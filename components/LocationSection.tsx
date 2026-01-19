import React, { useEffect, useRef } from 'react';
import { Building2, GraduationCap, ShoppingBag, PlusSquare } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

gsap.registerPlugin(ScrollTrigger);

interface LocationCardProps {
  icon: React.ReactNode;
  title: string;
  time: string;
}

const LocationCard: React.FC<LocationCardProps> = ({ icon, title, time }) => (
  <div className="reveal-on-scroll flex items-center gap-4 p-5 rounded-2xl shadow-lg border-l-4 transition-all duration-300 hover:transform hover:translate-x-2
    bg-white text-royal-900 border-royal-500 hover:shadow-xl
    dark:bg-navy-800 dark:text-white dark:border-gold-500 dark:hover:shadow-glow-gold"
  >
    <div className="p-3 rounded-full transition-colors duration-300
      bg-royal-100 text-royal-600
      dark:bg-gold-500/20 dark:text-gold-400"
    >
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-sm md:text-base leading-tight">{title}</h4>
      <p className="text-xs mt-1 transition-colors text-gray-500 dark:text-gray-400">{time}</p>
    </div>
  </div>
);

const LocationSection: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapElementRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('nav-change', { detail: 'contact' }));
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapElementRef.current || mapInstanceRef.current) return;

    // Fix for default marker icon issues in some builds, though we use custom icon below
    // Initialize Map
    const map = L.map(mapElementRef.current, {
      center: [21.1695, 105.5768],
      zoom: 16,
      scrollWheelZoom: true, // Enable scroll zoom
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
    L.marker([21.1695, 105.5768], { icon: customIcon })
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

  // Handle Scroll Locking when interacting with Map
  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    const handleMouseEnter = () => {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    };

    const handleMouseLeave = () => {
      // Restore body scroll
      document.body.style.overflow = 'auto';
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      // Ensure scroll is restored if component unmounts
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden transition-colors duration-500 bg-white dark:bg-navy-900">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row h-full">
          
          {/* Text Content */}
          <div className="w-full lg:w-1/2 py-16 px-8 lg:pl-16 flex flex-col justify-center relative z-10">
            <h2 className="text-4xl lg:text-5xl font-serif mb-6 leading-tight transition-colors duration-300 reveal-on-scroll
              text-royal-600 dark:text-gold-500"
            >
              Vị Thế Kim Cương: <br /> Nơi Giá Trị Hội Tụ
            </h2>
            <p className="font-light mb-10 leading-relaxed transition-colors duration-300 reveal-on-scroll
              text-gray-600 dark:text-gray-300"
            >
              Tọa lạc tại tâm điểm thịnh vượng, kết nối mọi tiện ích sống, làm việc và giải trí. Một vị trí chiến lược, đảm bảo cuộc sống tiện nghi và tiềm năng đầu tư vượt trội.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-5 mb-10">
               <LocationCard 
                  icon={<Building2 size={22} />}
                  title="Trung tâm thành phố"
                  time="5 phút di chuyển"
               />
                <LocationCard 
                  icon={<GraduationCap size={22} />}
                  title="Trường học quốc tế"
                  time="10 phút di chuyển"
               />
                <LocationCard 
                  icon={<ShoppingBag size={22} />}
                  title="Trung tâm thương mại"
                  time="15 phút di chuyển"
               />
                <LocationCard 
                  icon={<PlusSquare size={22} />}
                  title="Bệnh viện"
                  time="12 phút di chuyển"
               />
            </div>

            <button 
              onClick={scrollToContact}
              className="btn-luxury self-start flex items-center justify-center px-10 py-4 rounded-full uppercase tracking-widest font-serif text-sm font-bold shadow-lg transform hover:-translate-y-1 transition-all duration-300 reveal-on-scroll
              bg-royal-600 text-white hover:bg-royal-700 hover:shadow-royal-500/50
              dark:bg-gold-500 dark:text-navy-900 dark:hover:bg-white dark:hover:text-royal-900 dark:shadow-glow-gold"
            >
              Liên Hệ Ngay
            </button>
          </div>

          {/* Map Visual (Interactive Leaflet Map) */}
          <div ref={mapContainerRef} className="w-full lg:w-1/2 h-[40vh] lg:h-auto relative bg-gray-200 overflow-hidden shadow-2xl z-0">
             <div ref={mapElementRef} className="w-full h-full z-0" style={{ filter: 'grayscale(0.1)' }}></div>
             
             {/* Decorative Overlay for Theme Integration */}
             <div className="absolute inset-0 pointer-events-none border-[10px] border-white/50 dark:border-navy-900/50 shadow-inner z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LocationSection;