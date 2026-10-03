import React, { useEffect } from 'react';
import SeoHead from './shared/SeoHead';

const TOUR_URL = 'https://tour.panoee.net/6ab661f182ffd7bebbcf6ecb/dji_20260923143022_0474_d';

const Tour360Page: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SeoHead
        title="360 Tổng thể dự án | Yên Lạc Dragon City"
        description="Tham quan toàn cảnh 360 độ Khu đô thị Yên Lạc Dragon City."
        path="/360"
      />
      <div className="pt-20">
        <iframe
          src={TOUR_URL}
          title="360 Tổng thể dự án Yên Lạc Dragon City"
          className="w-full h-[calc(100vh-5rem)] border-0"
          allow="accelerometer; gyroscope; magnetometer; fullscreen; xr-spatial-tracking"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default Tour360Page;
