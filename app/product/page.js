'use client';
import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";

export default function ProductPage() {
  const [products, setProducts] = useState([]);

  const load = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Produk</h1>

      <Row gutter={[16, 16]}>
        {products.map((item) => (
          <Col xs={24} sm={12} md={8} lg={6} key={item.id}>
            <Card
              hoverable
              cover={
                item.image ? (
                  <img src={item.image} style={{ height: 200, objectFit: "cover" }} />
                ) : (
                  <div
                    style={{
                      height: 200,
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    No Image
                  </div>
                )
              }
            >
              <Card.Meta
                title={item.name}
                description={`Rp ${item.price.toLocaleString()}`}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
