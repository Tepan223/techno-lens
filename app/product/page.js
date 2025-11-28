"use client";
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Input, message } from "antd"; // Tambah message
import { SearchOutlined } from "@ant-design/icons";
import Category from "../components/category";
import Styles from "../styles/Product.module.css";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Import Auth

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  
  const { addToCart } = useCart();
  const { isLoggedIn, openLoginModal } = useAuth(); // Ambil status auth

  // --- Load Data (Sama seperti kodemu) ---
  const load = async () => {
    
    // Kodemu yang asli:
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products);
  };

  useEffect(() => {
    load();
  }, []);

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // --- Logic Baru: Handle Click ---
  const handleAddToCart = (item) => {
    if (!isLoggedIn) {
      message.warning("Silakan login terlebih dahulu!");
      openLoginModal(); // Buka modal jika belum login
    } else {
      addToCart(item); // Lanjut add to cart jika sudah login
      message.success("Item masuk keranjang!");
    }
  };

  return (
    <div className={Styles.pageContainer}>
      {/* Pasang Komponen Modal di sini agar bisa muncul popup */}

      <Category />

      {/* === Search Bar === */}
      <div className={Styles.searchBarWrapper}>
        <Input
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          prefix={<SearchOutlined style={{ color: "#999", fontSize: 18 }} />}
          className={Styles.searchBar}
        />
      </div>

      <div className={Styles.Rekomendasi}>
        <p className={Styles.RekomendasiText}>REKOMENDASI</p>
      </div>

      <Row gutter={[16, 16]}>
        {filteredProducts.map((item) => (
          <Col xs={24} sm={12} md={8} lg={5} xl={4} key={item.id}>
            <Card
              hoverable
              className={Styles.productCard}
              cover={
                item.image ? (
                  <img src={item.image} className={Styles.cardImage} />
                ) : (
                  <div className={Styles.noImage}>No Image</div>
                )
              }
            >
              <div className={Styles.cardBody}>
                <p className={Styles.productName}>{item.name}</p>
                <p className={Styles.productPrice}>
                  Rp {item.price.toLocaleString()}
                </p>

                {/* Tombol Add to Cart Update */}
                <div
                  className={Styles.addToCartBtn}
                  onClick={() => handleAddToCart(item)} // Panggil fungsi baru
                >
                  + Add to Cart
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      <Footer />
    </div>
  );
}