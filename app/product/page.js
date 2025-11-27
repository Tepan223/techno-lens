"use client";
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Category from "../components/category";
import Styles from "../styles/Product.module.css";
import Footer from "../components/Footer";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const load = async () => {
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

  return (
    <div className={Styles.pageContainer}>
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

      {/* Rekomendasi Section */}
      <div className={Styles.Rekomendasi}>
        <p className={Styles.RekomendasiText}>REKOMENDASI</p>
      </div>

      {/* Product Grid */}
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

                {/* Add to Cart */}
                <div
                  className={Styles.addToCartBtn}
                  onClick={() => alert(`Ditambahkan ke cart: ${item.name}`)}
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
