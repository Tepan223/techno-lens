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
          <img src="Main 1 (1).jpg" alt="Slide 1" className={Style.swiperSlide}/>
        </SwiperSlide>
        <SwiperSlide>
          <img src="Main 2 (1).jpg" alt="Slide 2" className={Style.swiperSlide}/>
        </SwiperSlide>
        <SwiperSlide>
          <img src="Main 3 (1).jpg" alt="Slide 3" className={Style.swiperSlide}/>
        </SwiperSlide>
      </Swiper>
      <div className={Style.productSection}>
        <div className={Style.product}>
          <img src="Background (Main).webp" className={Style.productIMG}></img>
          <p className={Style.productName}>Background Studio Hitam</p>
        </div>
        <div className={Style.product}>
          <img src="Baterai (Main).webp" className={Style.productIMG}></img>
          <p className={Style.productName}>Baterai Canon LP-E17</p>
        </div>
        <div className={Style.product}>
          <img src="Charger (Main).webp" className={Style.productIMG}></img>
          <p  className={Style.productName}>Charger Kamera Sony BC-TRW</p>
        </div>
      </div>
      <div className={Style.newSection}>
        <div style={{display:'flex'}}>
          <div className={Style.newArrival}>
            <img src="Drone (Main).webp"></img>
          </div>
        <div className={Style.newText}>New</div>
        </div>
        
        <div className={Style.newDescription}>
          <h1>DRONE DJI MAVIC AIR 2</h1>
          <p>Abadikan setiap momen dari ketinggian dengan teknologi Drone DJI Mavic Air 2. Dengan kamera ultra tajam dan sistem penghindar rintangan otomatis, drone ini siap membantu Anda menghasilkan visual profesional dan data akurat untuk berbagai kebutuhan industri. Drone DJI Mavic Air 2 adalah solusi udara masa depan yang Anda butuhkan hari ini.</p>
          <button className={Style.buttonProduct}>Lihat Produk</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
