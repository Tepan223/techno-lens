"use client";
import Styles from "../styles/Footer.module.css";
import { Divider } from "antd";
import Link from "next/link";

export default function Footer() {
  return (
    <div className={Styles.footer}>
      <Divider className={Styles.dividerTop} />
      <div className={Styles.footerContent}>
        <div className={Styles.headerFooter}>
          <h2>Perusahaan</h2>
          <h2>Produk</h2>
        </div>
        <div className={Styles.LinksSection}>
          <div className={Styles.column}>
            <Link href="/about">Tentang Kami</Link>
          </div>
          <div className={Styles.column}>
            <Link href="/produk/background-studio">Background Studio</Link>
            <Link href="/produk/baterai">Baterai</Link>
            <Link href="/produk/charger-kamera">Charger Kamera</Link>
            <Link href="/produk/drone">Drone</Link>
            <Link href="/produk/gimbal">Gimbal</Link>
            <Link href="/produk/grip-kamera">Grip Kamera</Link>
          </div>
          <div className={Styles.column}>
            <Link href="/produk/kamera">Kamera</Link>
            <Link href="/produk/cctv">CCTV</Link>
            <Link href="/produk/gopro">GoPro</Link>
            <Link href="/produk/webcam">Webcam</Link>
            <Link href="/produk/lensa">Lensa</Link>
            <Link href="/produk/light-ring">Light Ring</Link>
          </div>
          <div className={Styles.column}>
            <Link href="/produk/micro-sd">Micro SD</Link>
            <Link href="/produk/microphone">Microphone</Link>
            <Link href="/produk/stabilizer">Stabilizer</Link>
            <Link href="/produk/tas-kamera">Tas Kamera</Link>
            <Link href="/produk/tripod">Tripod</Link>
          </div>
        </div>
        <Divider className={Styles.dividerBottom} />
        <p className={Styles.copy}>
        Hak Cipta © 2025 <b>TechnoLens</b> Hak Cipta Dilindungi
        </p>
      </div>
    </div>
  );
}
