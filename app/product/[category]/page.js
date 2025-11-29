"use client";
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Button, Spin, Empty } from "antd";
import Styles from "../../styles/Product.module.css";
import Footer from "../../components/Footer";
import Category from "../../components/category";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import LoginModal from "../../components/LoginModal";
import { useParams } from "next/navigation"; 

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.category; 

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();
  const { isLoggedIn, openLoginModal } = useAuth();

  // --- HELPER UNTUK JUDUL ---
  const formatCategoryTitle = (slug) => {
      if (!slug) return 'Semua Produk';
      const words = slug.replace(/-/g, ' ').split(' ');
      return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };


  // --- LOGIKA LOAD DATA & FILTER FINAL ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        
        // FIX: Defensive Programming - Jika data.products hilang atau undefined, gunakan array kosong []
        const productArray = data.products || []; 
        
        // --- FILTER PRODUK BERDASARKAN SLUG URL ---
        const filtered = productArray.filter(
          (item) => {
            if (!item.category) return false; // Abaikan item tanpa kategori
            
            // Normalisasi: Konversi kategori JSON menjadi slug yang cocok dengan URL
            const itemCategorySlug = item.category.toLowerCase().replace(/\s+/g, '-');
            
            // Cocokkan slug yang sudah dinormalisasi
            return itemCategorySlug === categorySlug.toLowerCase();
          }
        );

        setProducts(filtered);
      } catch (error) {
        console.error("Error saat loading data:", error);
        setProducts([]); 
      } finally {
        setLoading(false);
      }
    };

    if (categorySlug) {
      loadData();
    }
  }, [categorySlug]); 

  const handleAddToCart = (item) => {
    if (!isLoggedIn) {
      openLoginModal();
    } else {
      addToCart(item);
    }
  };

  return (
    <div className={Styles.pageContainer}>
      <LoginModal />
      
      <Category />

      <div style={{ padding: "20px 5%", textAlign: "center" }}>
        <h2 style={{ color: "#1a153f", fontFamily: "Arial, sans-serif" }}>
          KATEGORI: {formatCategoryTitle(categorySlug)}
        </h2>
      </div>

      <div style={{ padding: "0", minHeight: "50vh" }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 50 }}><Spin size="large" /></div>
        ) : products.length === 0 ? (
          <div style={{ marginTop: 50 }}><Empty description={`Tidak ada produk di kategori ${formatCategoryTitle(categorySlug)}`} /></div>
        ) : (
          <Row gutter={[24, 24]}>
            {products.map((item) => (
              <Col xs={24} sm={12} md={8} lg={6} xl={4} key={item.id}>
                <Card
                  hoverable
                  className={Styles.productCard}
                  cover={
                    <img alt={item.name} src={item.image} style={{ height: 200, objectFit: "cover" }} />
                  }
                >
                  <div className={Styles.productInfo}>
                    <p className={Styles.productName}>{item.name}</p>
                    <div>
                      <p className={Styles.productPrice}>
                        Rp {item.price.toLocaleString()}
                      </p>
                      <Button 
                        block type="primary" 
                        style={{ backgroundColor: "#1a153f" }}
                        onClick={() => handleAddToCart(item)}
                      >
                        + Add to Cart
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
      <Footer />
    </div>
  );
}