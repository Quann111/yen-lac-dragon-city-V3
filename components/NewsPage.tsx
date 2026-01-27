import React, { useEffect, useRef, useLayoutEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, ArrowRight, ChevronDown, ChevronRight, Search, Clock, X } from 'lucide-react';

import img01 from '../image/anhTintuc/01.webp';
import img02 from '../image/anhTintuc/02.webp';
import img03 from '../image/anhTintuc/03.webp';
import img04 from '../image/anhTintuc/04.webp';
import img05 from '../image/anhTintuc/05.webp';
import img06 from '../image/anhTintuc/06.webp';
import img07 from '../image/anhTintuc/07.webp';

gsap.registerPlugin(ScrollTrigger);

interface NewsArticle {
  title: string;
  date: string;
  category: string;
  description: string;
  image: string;
  content: string;
}

const NewsModal = ({ article, onClose }: { article: NewsArticle, onClose: () => void }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Entry animation
      gsap.fromTo(backdropRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.4 }
      );
      gsap.fromTo(modalRef.current, 
        { y: 50, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );
      // Stagger content appearance
      if (contentRef.current) {
        gsap.fromTo(contentRef.current.children, 
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.2 }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const handleClose = () => {
    const ctx = gsap.context(() => {
      // Exit animation
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.3 });
      gsap.to(modalRef.current, { 
        y: 20, opacity: 0, scale: 0.95, duration: 0.3, 
        onComplete: onClose 
      });
    });
  };

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        ref={backdropRef} 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      
      {/* Modal Container */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col bg-white text-royal-900"
      >
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors backdrop-blur-md"
        >
          <X size={24} />
        </button>
        
        {/* Hero Image */}
        <div className="h-64 md:h-80 shrink-0 relative">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="inline-block px-3 py-1 rounded-full bg-gold-500 text-navy-900 text-xs font-bold uppercase mb-3 shadow-lg">
              {article.category}
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-plus font-semibold text-white leading-tight drop-shadow-md">
              {article.title}
            </h2>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          <div ref={contentRef} className="max-w-3xl mx-auto space-y-6">
            {/* Meta Info */}
            <div className="flex items-center gap-2 text-sm opacity-60 font-mono border-b pb-4 border-royal-900/10">
              <Calendar size={16} />
              <span>{article.date}</span>
              <span className="mx-2">|</span>
              <Clock size={16} />
              <span>5 phút đọc</span>
            </div>
            
            {/* Intro/Description */}
            <p className="text-lg font-body font-normal leading-relaxed opacity-90">
              {article.description}
            </p>
            
            {/* Main Content Body */}
            <div className="prose prose-lg max-w-none prose-stone">
               {article.content.split('\n\n').map((paragraph, idx) => (
                 <p key={idx} className="mb-4 text-justify leading-relaxed opacity-80 font-body font-normal">
                   {paragraph}
                 </p>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewsPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const featuredNews: NewsArticle = {
    title: "Lễ Khởi Công Dự Án Yên Lạc Dragon City - Biểu Tượng Mới Của Vĩnh Phúc",
    date: "20 THÁNG 6, 2024",
    category: "SỰ KIỆN",
    description: "Sự kiện đánh dấu bước ngoặt quan trọng trong sự phát triển đô thị của tỉnh Vĩnh Phúc, hứa hẹn mang lại diện mạo mới hiện đại và đẳng cấp.",
    image: img01,
    content: `Ngày 20/6/2024, tại trung tâm huyện Yên Lạc, lễ khởi công dự án Yên Lạc Dragon City đã diễn ra trong không khí trang trọng với sự tham gia của lãnh đạo tỉnh Vĩnh Phúc, các sở ban ngành và đông đảo người dân địa phương.

    Đây là dự án trọng điểm nằm trong quy hoạch phát triển đô thị của tỉnh, với mục tiêu kiến tạo một không gian sống đẳng cấp, hiện đại nhưng vẫn hài hòa với thiên nhiên. Yên Lạc Dragon City sở hữu vị trí đắc địa, được ví như "trái tim" mới của khu vực, kết nối thuận tiện với các trục giao thông huyết mạch.

    Phát biểu tại buổi lễ, đại diện chủ đầu tư nhấn mạnh cam kết về tiến độ và chất lượng công trình. "Chúng tôi không chỉ xây dựng những ngôi nhà, mà đang kiến tạo một cộng đồng văn minh, thịnh vượng. Yên Lạc Dragon City sẽ là biểu tượng mới, là niềm tự hào của người dân Vĩnh Phúc," ông chia sẻ.

    Dự án được quy hoạch bài bản với các phân khu chức năng đa dạng: khu nhà ở liền kề, biệt thự đơn lập, khu shophouse thương mại sầm uất cùng hệ thống tiện ích nội khu chuẩn 5 sao. Đặc biệt, chủ đầu tư dành phần lớn diện tích cho mảng xanh và mặt nước, tạo nên "lá phổi xanh" điều hòa không khí cho toàn khu vực.

    Sự kiện khởi công không chỉ đánh dấu bước khởi đầu của một công trình, mà còn mở ra cơ hội đầu tư hấp dẫn và nâng tầm chất lượng sống cho cư dân trong tương lai gần.`
  };

  const initialNewsList: NewsArticle[] = [
    // KIẾN TRÚC
    {
      title: "Kiến trúc Tân Cổ Điển - Dấu ấn thượng lưu tại Yên Lạc",
      date: "12 THÁNG 6, 2024",
      category: "KIẾN TRÚC",
      description: "Sự kết hợp hoàn hảo giữa nét hoài cổ phương Tây và tinh thần hiện đại, tạo nên không gian sống đẳng cấp.",
      image: img02,
      content: `Phong cách Tân Cổ Điển (Neoclassical) từ lâu đã được giới thượng lưu ưa chuộng bởi vẻ đẹp sang trọng, tinh tế và bền vững với thời gian. Tại Yên Lạc Dragon City, ngôn ngữ kiến trúc này được tái hiện một cách hoàn hảo.

      Mỗi căn biệt thự là một tác phẩm nghệ thuật, nơi các chi tiết phào chỉ, hoa văn được giản lược bớt sự rườm rà, thay vào đó là những đường nét thanh thoát. Sự cân đối về tỷ lệ, màu sắc trang nhã kết hợp với hệ mái vòm đặc trưng tạo nên vẻ uy nghi.

      Không gian nội thất cũng được chăm chút tỉ mỉ, đề cao công năng sử dụng mà vẫn giữ được sự quý phái. Các cửa sổ lớn được bố trí hợp lý để đón ánh sáng tự nhiên và gió trời.`
    },
    {
      title: "Thiết kế không gian mở: Xu hướng sống xanh hiện đại",
      date: "15 THÁNG 6, 2024",
      category: "KIẾN TRÚC",
      description: "Tận hưởng cuộc sống giao hòa với thiên nhiên nhờ thiết kế mở thông minh và tầm nhìn panorama đắt giá.",
      image: img04,
      content: `Xu hướng "Sống xanh" đang trở thành chuẩn mực mới của cư dân hiện đại. Tại Yên Lạc Dragon City, các kiến trúc sư đã khéo léo đưa thiên nhiên vào từng ngóc ngách của ngôi nhà thông qua thiết kế mở (Open Plan).

      Việc loại bỏ các vách ngăn cứng nhắc giữa phòng khách, bếp và phòng ăn không chỉ giúp tối ưu hóa diện tích mà còn tạo sự kết nối giữa các thành viên trong gia đình. Hệ thống cửa kính kịch trần (Floor-to-ceiling) được sử dụng tối đa để xóa nhòa ranh giới giữa bên trong và bên ngoài.

      Từ mọi góc nhìn trong căn nhà, gia chủ đều có thể chiêm ngưỡng vẻ đẹp của sân vườn xanh mát hay hồ điều hòa thơ mộng, mang lại cảm giác thư thái tuyệt đối mỗi khi trở về nhà.`
    },
    {
      title: "Nghệ thuật bài trí nội thất cho biệt thự Dragon City",
      date: "18 THÁNG 6, 2024",
      category: "KIẾN TRÚC",
      description: "Gợi ý những phong cách nội thất xứng tầm với vẻ đẹp kiến trúc ngoại thất của khu đô thị.",
      image: img07,
      content: `Để hoàn thiện vẻ đẹp của một căn biệt thự, thiết kế nội thất đóng vai trò như "linh hồn" của ngôi nhà. Với kiến trúc Tân Cổ Điển đặc trưng của Yên Lạc Dragon City, gia chủ có thể lựa chọn phong cách nội thất Luxury hoặc Contemporary Classic.

      Sử dụng các vật liệu cao cấp như gỗ óc chó, đá Marble, da thật... kết hợp với các chi tiết kim loại mạ vàng sẽ tôn lên vẻ sang trọng. Màu sắc chủ đạo nên là các tông màu trung tính như kem, be, xám ghi, điểm xuyết thêm các gam màu trầm ấm.

      Ngoài ra, việc bố trí ánh sáng nghệ thuật (Lighting Design) cũng rất quan trọng để tạo điểm nhấn cho không gian và khơi gợi cảm xúc.`
    },

    // TIỆN ÍCH
    {
      title: "Công viên trung tâm - Lá phổi xanh của đô thị",
      date: "08 THÁNG 6, 2024",
      category: "TIỆN ÍCH",
      description: "Nơi cư dân tìm về sự bình yên giữa thiên nhiên trong lành, tách biệt khỏi khói bụi ồn ào.",
      image: img03,
      content: `Trải rộng trên diện tích hàng héc-ta, công viên trung tâm của Yên Lạc Dragon City được ví như "lá phổi xanh" điều hòa không khí cho toàn khu vực. Đây là nơi quy tụ hàng trăm loài cây xanh, thảm cỏ và hoa tươi bốn mùa.

      Điểm nhấn của công viên là hồ điều hòa rộng lớn, không chỉ có tác dụng cảnh quan mà còn giúp giảm nhiệt độ khu đô thị vào những ngày hè oi ả. Các đường dạo bộ uốn lượn dưới tán cây là nơi lý tưởng để cư dân chạy bộ, tập dưỡng sinh hay tản bộ thư giãn.

      Khu vực quảng trường rộng lớn là nơi diễn ra các hoạt động văn hóa, lễ hội cộng đồng, gắn kết tình làng nghĩa xóm.`
    },
    {
      title: "Hệ thống giáo dục nội khu: Ươm mầm tương lai",
      date: "05 THÁNG 6, 2024",
      category: "TIỆN ÍCH",
      description: "Môi trường giáo dục tiêu chuẩn quốc tế ngay tại thềm nhà, giúp cha mẹ an tâm, con trẻ phát triển toàn diện.",
      image: img01,
      content: `Giáo dục luôn là mối quan tâm hàng đầu của các bậc phụ huynh. Thấu hiểu điều đó, Yên Lạc Dragon City đã dành quỹ đất lớn để xây dựng hệ thống trường mầm non và liên cấp chất lượng cao.

      Trường học được trang bị cơ sở vật chất hiện đại với các phòng học thông minh, phòng thí nghiệm, thư viện, sân thể thao... Chương trình học tiên tiến kết hợp giữa kiến thức chuẩn và các hoạt động ngoại khóa giúp trẻ phát triển toàn diện cả về trí tuệ, thể chất và kỹ năng sống.

      Lợi thế lớn nhất là các bé có thể tự đi bộ đến trường trong môi trường an ninh tuyệt đối, giúp rèn luyện tính tự lập và tiết kiệm thời gian đưa đón cho cha mẹ.`
    },
    {
      title: "Tổ hợp thể thao và giải trí đẳng cấp 5 sao",
      date: "02 THÁNG 6, 2024",
      category: "TIỆN ÍCH",
      description: "Thỏa sức vận động và tái tạo năng lượng tại khu Gym, Spa, bể bơi vô cực hiện đại bậc nhất.",
      image: img05,
      content: `Sức khỏe là tài sản quý giá nhất. Tại Yên Lạc Dragon City, cư dân được chăm sóc sức khỏe toàn diện với tổ hợp thể thao đa năng.

      Phòng Gym được trang bị máy móc nhập khẩu từ các thương hiệu hàng đầu thế giới (Technogym, Life Fitness...). Khu vực Yoga yên tĩnh, thoáng đãng giúp cư dân tìm lại sự cân bằng trong tâm hồn. Bể bơi vô cực sử dụng công nghệ điện phân muối an toàn cho sức khỏe.

      Ngoài ra, khu Spa & Sauna với các liệu trình chăm sóc chuyên sâu sẽ giúp cư dân thư giãn, phục hồi năng lượng sau những giờ làm việc căng thẳng.`
    },

    // THỊ TRƯỜNG
    {
      title: "Bất động sản Vĩnh Phúc: Cơ hội vàng cho nhà đầu tư 2024",
      date: "25 THÁNG 5, 2024",
      category: "THỊ TRƯỜNG",
      description: "Phân tích tiềm năng tăng trưởng vượt bậc của thị trường BĐS vùng ven thủ đô trong chu kỳ mới.",
      image: img06,
      content: `Vĩnh Phúc đang nổi lên như một điểm sáng trên bản đồ đầu tư bất động sản miền Bắc. Với vị trí cửa ngõ Thủ đô, hạ tầng giao thông đồng bộ và kinh tế tăng trưởng ổn định, Vĩnh Phúc hội tụ đầy đủ dư địa để bứt phá.

      Các chuyên gia nhận định, dòng tiền đầu tư đang dịch chuyển mạnh về các tỉnh vùng ven có khu công nghiệp phát triển (BĐS công nghiệp) và hạ tầng tốt. Yên Lạc Dragon City nằm tại vị trí chiến lược, hưởng lợi trực tiếp từ các tuyến đường vành đai và cao tốc mới.

      Mặt bằng giá tại đây vẫn còn hấp dẫn so với các khu vực lân cận Hà Nội, hứa hẹn biên độ tăng giá cao trong trung và dài hạn.`
    },
    {
      title: "Tại sao đất nền Yên Lạc đang tăng nhiệt?",
      date: "20 THÁNG 5, 2024",
      category: "THỊ TRƯỜNG",
      description: "Giải mã sức hút của phân khúc đất nền tại huyện Yên Lạc trước làn sóng quy hoạch đô thị hóa.",
      image: img05,
      content: `Đất nền luôn là "khẩu vị" ưa thích của nhà đầu tư Việt nhờ tính thanh khoản cao và khả năng giữ giá trị. Tại Yên Lạc, sức hút này càng mạnh mẽ hơn nhờ các thông tin quy hoạch tích cực.

      Huyện Yên Lạc đang được định hướng phát triển thành đô thị vệ tinh quan trọng của Vĩnh Phúc. Hàng loạt dự án hạ tầng giao thông huyết mạch đang được triển khai. Sự khan hiếm quỹ đất sạch tại trung tâm càng khiến các dự án quy hoạch bài bản như Dragon City trở nên đắt giá.

      Ngoài ra, nhu cầu thực về nhà ở của người dân địa phương và lực lượng lao động tại các KCN lân cận cũng là yếu tố đảm bảo tính thanh khoản cho dự án.`
    },
    {
      title: "Xu hướng dịch chuyển về đô thị vệ tinh Hà Nội",
      date: "15 THÁNG 5, 2024",
      category: "THỊ TRƯỜNG",
      description: "Lý do ngày càng nhiều người lựa chọn rời phố về quê để tận hưởng cuộc sống chất lượng hơn.",
      image: img04,
      content: `Ô nhiễm, kẹt xe và không gian sống chật chội tại nội đô đang thúc đẩy xu hướng "di cư" ra các đô thị vệ tinh. Với khoảng cách di chuyển chỉ khoảng 45-60 phút lái xe, các khu vực như Vĩnh Phúc đang trở thành lựa chọn lý tưởng cho "Second Home" hoặc nơi an cư lâu dài.

      Tại các đô thị vệ tinh như Yên Lạc Dragon City, cư dân được sở hữu không gian sống rộng rãi, trong lành với đầy đủ tiện ích không thua kém gì thành phố, nhưng với mức chi phí hợp lý hơn rất nhiều.

      Hạ tầng giao thông kết nối ngày càng thuận tiện (cao tốc, đường vành đai) giúp việc đi lại làm việc tại Hà Nội trở nên dễ dàng, xóa bỏ rào cản về khoảng cách.`
    },

    // SỰ KIỆN
    {
      title: "Đêm nhạc hội 'Vũ khúc Rồng thiêng' bùng nổ cảm xúc",
      date: "30 THÁNG 4, 2024",
      category: "SỰ KIỆN",
      description: "Mãn nhãn với đại tiệc âm thanh, ánh sáng hoành tráng chào mừng đại lễ tại quảng trường dự án.",
      image: img01,
      content: `Chào mừng kỷ niệm ngày Giải phóng miền Nam 30/4, đêm nhạc hội "Vũ khúc Rồng thiêng" đã diễn ra thành công rực rỡ tại quảng trường trung tâm Yên Lạc Dragon City, thu hút hơn 5.000 khán giả tham dự.

      Sân khấu được dàn dựng công phu với hệ thống âm thanh, ánh sáng đẳng cấp quốc tế. Sự xuất hiện của các ngôi sao ca nhạc hàng đầu Việt Nam đã đốt cháy bầu không khí bằng những bản hit sôi động.

      Đặc biệt, màn trình diễn pháo hoa nghệ thuật tầm thấp kết hợp với trình diễn 3D Mapping trên mặt nước đã mang đến cho khán giả những khoảnh khắc mãn nhãn, khó quên.`
    },
    {
      title: "Lễ mở bán phân khu Hoàng Lan: Cháy hàng trong 2 giờ",
      date: "15 THÁNG 4, 2024",
      category: "SỰ KIỆN",
      description: "Kỷ lục giao dịch mới được xác lập, khẳng định sức nóng chưa từng có của dự án trên thị trường.",
      image: img07,
      content: `Sáng ngày 15/4, lễ mở bán chính thức phân khu Hoàng Lan - "Trái tim" của Yên Lạc Dragon City đã diễn ra trong không khí vô cùng náo nhiệt. Ngay từ sáng sớm, hàng trăm khách hàng và nhà đầu tư đã có mặt để làm thủ tục check-in.

      Chỉ sau 2 giờ mở bán, 95% bảng hàng đã tìm thấy chủ nhân. Nhiều khách hàng thậm chí phải bốc thăm để giành quyền mua các căn vị trí đẹp (lô góc, view hồ).

      Thành công này là minh chứng rõ nét nhất cho niềm tin của khách hàng vào uy tín chủ đầu tư và tiềm năng thực tế của dự án.`
    },
    {
      title: "Cuộc thi ảnh 'Khoảnh khắc Yên Lạc' dành cho cư dân",
      date: "01 THÁNG 4, 2024",
      category: "SỰ KIỆN",
      description: "Sân chơi nghệ thuật ghi lại những góc nhìn đẹp nhất về con người và cảnh sắc nơi đây.",
      image: img02,
      content: `Nhằm lan tỏa vẻ đẹp của quê hương và dự án, Yên Lạc Dragon City phát động cuộc thi ảnh "Khoảnh khắc Yên Lạc" với tổng giải thưởng lên tới 100 triệu đồng.

      Cuộc thi dành cho tất cả công dân Việt Nam, khuyến khích các tác phẩm ghi lại vẻ đẹp kiến trúc, thiên nhiên và nhịp sống thường ngày tại Yên Lạc Dragon City.

      Sau 1 tháng phát động, Ban tổ chức đã nhận được hơn 1.000 bài dự thi chất lượng. Các tác phẩm xuất sắc nhất sẽ được triển lãm tại nhà cộng đồng và in trong sách ảnh kỷ yếu của khu đô thị.`
    }
  ];

  // Filtering Logic
  const filteredNews = initialNewsList.filter(news => {
    const matchesCategory = activeCategory === 'Tất cả' || news.category.toUpperCase() === activeCategory.toUpperCase();
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const paginatedNews = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top of grid
    if (gridRef.current) {
      gsap.to(window, { duration: 1, scrollTo: { y: gridRef.current, offsetY: 100 }, ease: "power2.out" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Reset pagination when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation - Parallax & Fade
      const tl = gsap.timeline();
      
      tl.fromTo(heroRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out' }
      )
      .fromTo(titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out' },
        "-=1"
      );

      // Featured News Animation
      gsap.fromTo(featuredRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 80%',
          }
        }
      );

      // Pagination Animation
      if (paginationRef.current && gridRef.current) {
        gsap.fromTo(paginationRef.current,
          { autoAlpha: 0, x: 50 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top center", // Starts when top of grid hits center
              end: "bottom center", // Ends when bottom of grid hits center
              toggleActions: "play reverse play reverse", // Play on enter, reverse on leave, play on enter back, reverse on leave back
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Separate Effect for Grid Items to handle pagination updates
  useEffect(() => {
    if (!gridRef.current) return;
    
    const ctx = gsap.context(() => {
      const items = gridRef.current?.querySelectorAll('.news-card');
      if (items && items.length > 0) {
        gsap.fromTo(items,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            overwrite: 'auto'
          }
        );
      }
    }, gridRef);

    return () => ctx.revert();
  }, [paginatedNews]); // Re-run when news list changes

  return (
    <div ref={containerRef} className="min-h-screen transition-colors duration-500 bg-gray-50 text-royal-900">
      
      {/* Modal Popup */}
      {selectedArticle && (
        <NewsModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)} 
        />
      )}

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center">
        <div ref={heroRef} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=2070&auto=format&fit=crop" 
            alt="News Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-royal-900/60"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <div ref={titleRef}>
            <span className="inline-block py-1 px-3 rounded-full border border-white/30 text-white text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-sm">
              Tin Tức & Sự Kiện
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-plus font-semibold text-white mb-6 drop-shadow-2xl">
              Nhịp Sống <br className="hidden md:block"/> <span className="text-gold-400">Yên Lạc Dragon City</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-body font-normal">
              Cập nhật những thông tin mới nhất về tiến độ dự án, sự kiện nổi bật và xu hướng thị trường bất động sản.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Featured News */}
        <div ref={featuredRef} className="mb-20">
          <h2 className="text-2xl font-plus font-semibold mb-8 flex items-center gap-3 text-royal-800">
            <span className="w-8 h-[2px] bg-current"></span>
            Tâm Điểm
          </h2>
          
          <div className="group relative grid md:grid-cols-2 gap-0 overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 hover:shadow-glow-gold bg-white">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <img 
                src={featuredNews.image} 
                alt={featuredNews.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 bg-gold-500 text-navy-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
                {featuredNews.category}
              </div>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-sm opacity-60 mb-4 font-mono">
                <Calendar size={16} />
                <span>{featuredNews.date}</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-plus font-semibold mb-4 transition-colors duration-300 group-hover:text-gold-500 text-royal-900">
                {featuredNews.title}
              </h3>
              <p className="mb-8 line-clamp-3 text-gray-600 font-body font-normal">
                {featuredNews.description}
              </p>
              <button 
                onClick={() => setSelectedArticle(featuredNews)}
                className="flex items-center gap-2 font-bold uppercase text-sm tracking-wider transition-all duration-300 text-royal-600 hover:text-royal-800"
              >
                Đọc Thêm <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter / Search Bar (Visual Only) */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="flex gap-4 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {['Tất cả', 'Kiến trúc', 'Tiện ích', 'Thị trường', 'Sự kiện'].map((item, index) => (
              <button 
                key={index}
                onClick={() => setActiveCategory(item)}
                className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300
                  ${item === activeCategory
                    ? 'bg-gold-500 text-navy-900 shadow-lg scale-105' 
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
                  }`}
              >
                {item}
              </button>
            ))}
          </div>
          
          <div className="flex items-center px-4 py-2 rounded-full w-full md:w-64 border transition-colors bg-white border-gray-200 focus-within:border-royal-500/50">
            <Search size={18} className="opacity-50 mr-2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tin tức..." 
              className="bg-transparent border-none outline-none w-full text-sm placeholder-opacity-50"
            />
          </div>
        </div>

        {/* News Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedNews.map((news, index) => (
            <div 
              key={index} 
              onClick={() => setSelectedArticle(news)}
              className="news-card group flex flex-col h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer bg-white"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={news.image} 
                  alt={news.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {news.category}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs opacity-60 mb-3 font-mono">
                  <Clock size={14} />
                  <span>{news.date}</span>
                </div>
                
                <h3 className="text-xl font-plus font-semibold mb-3 line-clamp-2 transition-colors duration-300 group-hover:text-gold-500 text-royal-900">
                  {news.title}
                </h3>
                
                <p className="text-sm mb-6 line-clamp-3 flex-grow text-gray-600 font-body font-normal">
                  {news.description}
                </p>
                
                <div className="pt-4 border-t border-gray-100">
                  <button className="flex items-center justify-between w-full text-sm font-bold uppercase transition-colors text-gray-600 group-hover:text-royal-600">
                    Xem Chi Tiết
                    <span className="bg-current p-1 rounded-full text-navy-900 group-hover:rotate-45 transition-transform duration-300">
                      <ChevronRight size={14} className="text-white" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Pagination (Horizontal) */}
        <div className="mt-16 flex justify-center md:hidden">
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((item) => (
              <button 
                key={item}
                onClick={() => handlePageChange(item)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300
                  ${item === currentPage 
                    ? 'bg-gold-500 text-navy-900 shadow-lg' 
                    : 'bg-white text-royal-900 hover:bg-gray-100'}`}
              >
                {item}
              </button>
            ))}
            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-white text-royal-900 hover:bg-gray-100
              ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Desktop Pagination (Vertical, Fixed) */}
        <div ref={paginationRef} className="fixed right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4 opacity-0">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((item) => (
              <button 
                key={item}
                onClick={() => handlePageChange(item)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-lg hover:scale-110
                  ${item === currentPage 
                    ? 'bg-gold-500 text-navy-900' 
                    : 'bg-white text-royal-900 hover:bg-royal-600 hover:text-white'}`}
              >
                {item}
              </button>
            ))}
            <button 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 bg-white text-royal-900 hover:bg-royal-600 hover:text-white
              ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <ChevronRight size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;
