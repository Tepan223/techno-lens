"use client";
import React from "react";
import { Card } from "antd";
import Link from "next/link"; // Import komponen Link
import Styles from "../styles/Category.module.css";

export default function CategoryGrid() {
  const categories = [
    { title: "Background", img: "/category/background.webp" },
    { title: "Baterai", img: "/category/baterai.webp" },
    { title: "Charger", img: "/category/charger.webp" },
    { title: "Cleaning Kit", img: "/category/cleaning-kit.webp" },
    { title: "Drone", img: "/category/drone.webp" },
    { title: "Gimbal", img: "/category/gimbal.webp" },
    { title: "Kamera", img: "/category/kamera.webp" },
    { title: "CCTV", img: "/category/cctv.webp" },
    { title: "Lensa", img: "/category/lensa.webp" },
    { title: "Memory Card", img: "/category/memory-card.webp" },
    { title: "Microphone", img: "/category/microphone.webp" },
    { title: "Tripod", img: "/category/tripod.webp" },
  ];

  return (
    <div className={Styles.container}>
      <h1 className={Styles.heading}>KATEGORI</h1>

      <div className={Styles.grid}>
        {categories.map((category, index) => {
          // 1. Buat Slug: Ubah nama kategori jadi URL friendly (huruf kecil, spasi jadi strip)
          // Contoh: "Memory Card" -> "memory-card"
          const slug = category.title.toLowerCase().replace(/\s+/g, '-');

          return (
            // 2. Gunakan <Link> dan arahkan ke path dinamis
            <Link 
              key={index} 
              href={`/product/${slug}`} 
              className={Styles.link}
            >
              <Card hoverable className={Styles.card}>
                <div className={Styles.imgBox}>
                  <img
                    src={category.img}
                    alt={category.title}
                    className={Styles.img}
                  />
                </div>
                <p className={Styles.title}>{category.title}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}