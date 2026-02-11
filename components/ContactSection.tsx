import React, { useState } from 'react';
import NotificationModal from './NotificationModal';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phone, email, message } = formData;
    
    // Simple validation
    if (!name || !phone) {
      setModalState({
        isOpen: true,
        type: 'error',
        message: 'Vui lòng nhập họ tên và số điện thoại để chúng tôi có thể liên hệ lại.'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://formsubmit.co/ajax/sale@dragoncity.com.vn", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "Họ và tên": name,
            "Số điện thoại": phone,
            "Email": email || "Không cung cấp",
            "Nội dung tư vấn": message || "Không có nội dung",
            "_subject": `Liên hệ mới từ ${name} - Yên Lạc Dragon City`,
            "_template": "table",
            "_captcha": "false"
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setModalState({
          isOpen: true,
          type: 'success',
          message: 'Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại với quý khách trong thời gian sớm nhất.'
        });
        setFormData({ name: '', phone: '', email: '', message: '' }); // Reset form
      } else {
        throw new Error('Gửi thất bại');
      }
    } catch (error) {
      console.error('Lỗi gửi form:', error);
      setModalState({
        isOpen: true,
        type: 'error',
        message: 'Có lỗi xảy ra khi gửi thông tin. Quý khách vui lòng gọi trực tiếp hotline hoặc thử lại sau.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative overflow-hidden bg-gray-50">
      <NotificationModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        type={modalState.type}
        message={modalState.message}
      />
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
         <img 
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" 
            alt="Interior" 
            className="w-full h-full object-cover"
         />
         <div className="absolute inset-0 transition-colors duration-500
           bg-white/80 backdrop-blur-sm"
         ></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 reveal-on-scroll mx-auto">
        <div className="p-8 md:p-12 rounded-3xl shadow-2xl transition-all duration-500 border
          bg-white/60 border-white/50"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-3xl font-body font-bold mb-4 transition-colors duration-300 text-royal-600 uppercase whitespace-nowrap">
              Liên Hệ
            </h2>
            <p className="font-body text-sm md:text-base leading-relaxed transition-colors duration-300 text-gray-700 [text-wrap:pretty]">
              Chúng tôi trân trọng mời quý vị trải nghiệm một buổi tư vấn riêng tư, nơi mọi mong muốn và khát vọng về không gian sống đẳng cấp sẽ được lắng nghe và hiện thực hóa.
            </p>
          </div>

          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input 
                type="text" 
                name="name"
                placeholder="Họ và tên quý vị" 
                className="w-full font-body rounded-xl px-5 py-4 focus:outline-none transition-all duration-300 shadow-inner
                  bg-white border border-gray-200 text-gray-800 focus:border-royal-500 focus:shadow-lg"
                value={formData.name}
                onChange={handleChange}
              />
              <input 
                type="tel" 
                name="phone"
                placeholder="Số điện thoại" 
                className="w-full font-body rounded-xl px-5 py-4 focus:outline-none transition-all duration-300 shadow-inner
                  bg-white border border-gray-200 text-gray-800 focus:border-royal-500 focus:shadow-lg"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <input 
              type="email" 
              name="email"
              placeholder="Email của quý vị" 
              className="w-full font-body rounded-xl px-5 py-4 focus:outline-none transition-all duration-300 shadow-inner
                  bg-white border border-gray-200 text-gray-800 focus:border-royal-500 focus:shadow-lg"
              value={formData.email}
              onChange={handleChange}
            />

            <textarea 
              name="message"
              rows={3}
              placeholder="Nội dung tư vấn (yêu cầu đặc biệt, thời gian phù hợp...)" 
              className="w-full font-body rounded-xl px-5 py-4 focus:outline-none transition-all duration-300 shadow-inner resize-none
                  bg-white border border-gray-200 text-gray-800 focus:border-royal-500 focus:shadow-lg"
              value={formData.message}
              onChange={handleChange}
            />

            <button 
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full font-body font-bold py-4 rounded-full shadow-lg mt-4 transform transition-all duration-300
                bg-gradient-to-r from-royal-600 to-royal-800 text-white
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-royal-500/50'}`}
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi Lời Mời & Nhận Tư Vấn'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;