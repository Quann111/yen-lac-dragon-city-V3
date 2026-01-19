import React, { useState } from 'react';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="relative py-24 md:py-32 flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" 
            alt="Interior" 
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 transition-colors duration-500
           bg-white/80 backdrop-blur-sm
           dark:bg-navy-900/80"
         ></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 reveal-on-scroll">
        <div className="p-8 md:p-12 rounded-3xl shadow-2xl transition-all duration-500 border
          bg-white/60 border-white/50
          dark:bg-navy-800/60 dark:border-white/10"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 transition-colors duration-300 text-royal-600 dark:text-gold-200">
              Lời Mời Tư Vấn Riêng Biệt
            </h2>
            <p className="font-light text-sm md:text-base leading-relaxed transition-colors duration-300 text-gray-700 dark:text-gray-300">
              Chúng tôi trân trọng mời quý vị trải nghiệm một buổi tư vấn riêng tư, nơi mọi mong muốn và khát vọng về không gian sống đẳng cấp sẽ được lắng nghe và hiện thực hóa.
            </p>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input 
                type="text" 
                name="name"
                placeholder="Họ và tên quý vị" 
                className="w-full rounded-xl px-5 py-4 focus:outline-none transition-all duration-300 shadow-inner
                  bg-white border border-gray-200 text-gray-800 focus:border-royal-500 focus:shadow-lg
                  dark:bg-white/5 dark:border-white/20 dark:text-white dark:placeholder-gray-400 dark:focus:border-gold-500"
                value={formData.name}
                onChange={handleChange}
              />
              <input 
                type="tel" 
                name="phone"
                placeholder="Số điện thoại" 
                className="w-full rounded-xl px-5 py-4 focus:outline-none transition-all duration-300 shadow-inner
                  bg-white border border-gray-200 text-gray-800 focus:border-royal-500 focus:shadow-lg
                  dark:bg-white/5 dark:border-white/20 dark:text-white dark:placeholder-gray-400 dark:focus:border-gold-500"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <input 
              type="email" 
              name="email"
              placeholder="Email của quý vị" 
              className="w-full rounded-xl px-5 py-4 focus:outline-none transition-all duration-300 shadow-inner
                  bg-white border border-gray-200 text-gray-800 focus:border-royal-500 focus:shadow-lg
                  dark:bg-white/5 dark:border-white/20 dark:text-white dark:placeholder-gray-400 dark:focus:border-gold-500"
              value={formData.email}
              onChange={handleChange}
            />

            <textarea 
              name="message"
              rows={3}
              placeholder="Nội dung tư vấn (yêu cầu đặc biệt, thời gian phù hợp...)" 
              className="w-full rounded-xl px-5 py-4 focus:outline-none transition-all duration-300 shadow-inner resize-none
                  bg-white border border-gray-200 text-gray-800 focus:border-royal-500 focus:shadow-lg
                  dark:bg-white/5 dark:border-white/20 dark:text-white dark:placeholder-gray-400 dark:focus:border-gold-500"
              value={formData.message}
              onChange={handleChange}
            />

            <button 
              type="button" 
              className="w-full font-bold py-4 rounded-full shadow-lg mt-4 transform hover:-translate-y-1 transition-all duration-300
                bg-gradient-royal text-white hover:shadow-royal-500/50
                dark:bg-gradient-to-r dark:from-gold-600 dark:via-gold-400 dark:to-gold-600 dark:text-navy-900 dark:hover:shadow-glow-gold"
            >
              Gửi Lời Mời & Nhận Tư Vấn
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;