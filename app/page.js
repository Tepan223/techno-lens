"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Footer from "./components/Footer";

import "swiper/css";
import "swiper/css/pagination";

import Style from "./page.module.css";

export default function Home() {
  return (
    <div className={Style.main}>
      <Swiper
        modules={[Pagination, Autoplay]}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src="/images/main1.jpg" alt="Slide 1" className={Style.swiperSlide} />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/main2.jpg" alt="Slide 2" className={Style.swiperSlide} />
        </SwiperSlide>
        <SwiperSlide>
          <img src="/images/main3.jpg" alt="Slide 3" className={Style.swiperSlide} />
        </SwiperSlide>
      </Swiper>

      <div className={Style.productSection}>
        <div className={Style.product}>
          <img src="/images/BackgroundM.webp" className={Style.productIMG} alt="Background Studio" />
          <p className={Style.productName}>Background Studio Hitam</p>
        </div>
        <div className={Style.product}>
          <img src="/images/BateraiM.webp" className={Style.productIMG} alt="Baterai Canon" />
          <p className={Style.productName}>Baterai Canon LP-E17</p>
        </div>
        <div className={Style.product}>
          <img src="/images/ChargerM.webp" className={Style.productIMG} alt="Charger Sony" />
          <p className={Style.productName}>Charger Kamera Sony BC-TRW</p>
        </div>
      </div>

      <div className={Style.newSection}>
        <div style={{ display: "flex" }}>
          <div className={Style.newArrival}>
            <img src="/images/DroneM.webp" alt="Drone" />
          </div>
          <div className={Style.newText}>New</div>
        </div>

        <div className={Style.newDescription}>
          <h1>DRONE DJI MAVIC AIR 2</h1>
          <p>
            Abadikan setiap momen dari ketinggian dengan teknologi Drone DJI Mavic Air 2. Dengan kamera ultra
            tajam dan sistem penghindar rintangan otomatis, drone ini siap membantu Anda menghasilkan visual
            profesional dan data akurat untuk berbagai kebutuhan industri.
          </p>
          <button className={Style.buttonProduct}>Lihat Produk</button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
