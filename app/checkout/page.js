"use client";
import React, { useState, useEffect } from "react";
import { 
  Row, 
  Col, 
  Card, 
  Form, 
  Input, 
  Button, 
  Select, 
  message, 
  List, 
  Divider,
  Empty
} from "antd";
import { useCart } from "../context/CartContext";
import { ShoppingCartOutlined, DollarCircleOutlined, UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

// Fungsi untuk menghitung total harga (dengan fallback kuantitas 1)
const calculateTotal = (items) => { 
  return items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
};

export default function CheckoutPage() {
  // FIX: Menggunakan variabel 'cart' sesuai dengan Context
  const { cart, clearCart } = useCart(); 
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Update total harga
  useEffect(() => {
    setTotalPrice(calculateTotal(cart));
  }, [cart]);

  // Mengatasi jika keranjang kosong
  if (cart.length === 0) { 
    return (
      <div style={{ padding: '50px', minHeight: '80vh', textAlign: 'center' }}>
        <Empty 
          description="Keranjang belanja Anda kosong. Silakan tambahkan produk terlebih dahulu."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button type="primary" href="/" style={{ marginTop: 20, backgroundColor: "#1a153f" }}>
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  const onFinish = (values) => {
    setSubmitting(true);
    
    console.log("Data Pengiriman dan Pembayaran:", values);
    console.log("Barang yang di-Checkout:", cart); 

    setTimeout(() => {
      setSubmitting(false);
      message.success('Pesanan berhasil dibuat! Terima kasih.');
      clearCart(); 
      // Redirect ke halaman Home (atau Konfirmasi)
      // router.push('/'); 
    }, 2000);
  };

  return (
    <div style={{ padding: '30px 5%', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#1a153f', textAlign: 'center', marginBottom: 30, fontFamily: 'sans-serif' }}>Checkout Pesanan</h1>
      
      <Row gutter={[32, 32]}>
        
        {/* KOLOM KIRI: ALAMAT & PEMBAYARAN */}
        <Col xs={24} lg={14}>
          <Card 
            title={<><HomeOutlined /> Alamat Pengiriman</>}
            // FIX: Menggunakan variant="default"
            variant="default"
            style={{ marginBottom: 20, borderRadius: 10, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{ paymentMethod: 'Transfer Bank' }}
            >
              {/* Nama Penerima */}
              <Form.Item
                name="receiverName"
                label={<><UserOutlined /> Nama Penerima</>}
                rules={[{ required: true, message: 'Mohon masukkan nama penerima!' }]}
              >
                <Input placeholder="Contoh: Budi Santoso" />
              </Form.Item>

              {/* Nomor Telepon */}
              <Form.Item
                name="phoneNumber"
                label={<><PhoneOutlined /> Nomor Telepon</>}
                rules={[{ required: true, message: 'Mohon masukkan nomor telepon!' }]}
              >
                <Input placeholder="Contoh: 081234567890" />
              </Form.Item>

              {/* Alamat Pengiriman */}
              <Form.Item
                name="shippingAddress"
                label={<><MailOutlined /> Alamat Lengkap</>}
                rules={[{ required: true, message: 'Mohon masukkan alamat pengiriman lengkap!' }]}
              >
                <TextArea rows={3} placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Provinsi" />
              </Form.Item>

              <Divider orientation="left"><DollarCircleOutlined /> Metode Pembayaran</Divider>

              {/* Metode Pembayaran */}
              <Form.Item
                name="paymentMethod"
                label="Pilih Metode Pembayaran"
                rules={[{ required: true, message: 'Mohon pilih metode pembayaran!' }]}
              >
                <Select placeholder="Pilih Metode Pembayaran">
                  <Option value="Transfer Bank">Transfer Bank (BCA/Mandiri)</Option>
                  <Option value="E-Wallet">E-Wallet (GoPay/OVO)</Option>
                  <Option value="COD" disabled>Cash On Delivery (COD) - Tidak Tersedia</Option>
                </Select>
              </Form.Item>

              <Divider orientation="left">Pesan untuk Penjual</Divider>

              {/* Pesan untuk Penjual */}
              <Form.Item
                name="notes"
                label="Pesan Tambahan (Opsional)"
              >
                <TextArea rows={2} placeholder="Contoh: Tolong bungkus dengan bubble wrap tebal." />
              </Form.Item>
              
            </Form>
          </Card>
        </Col>

        {/* KOLOM KANAN: RINGKASAN PESANAN */}
        <Col xs={24} lg={10}>
          <Card
            title={<><ShoppingCartOutlined /> Ringkasan Pesanan</>}
            // FIX: Menggunakan variant="default"
            variant="default"
            style={{ position: 'sticky', top: 30, borderRadius: 10, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}
          >
            <List
              itemLayout="horizontal"
              dataSource={cart} // FIX: Menggunakan 'cart'
              renderItem={item => (
                <List.Item
                  style={{ padding: '12px 0' }}
                >
                  <List.Item.Meta
                      // FIX: Menampilkan gambar produk
                      avatar={
                          <img
                              src={item.image || '/images/placeholder.png'} 
                              alt={item.name}
                              style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #eee' }}
                          />
                      }
                    title={<span style={{ fontWeight: 600 }}>{item.name}</span>}
                    description={`Kuantitas: ${item.quantity || 1} x Rp ${item.price.toLocaleString()}`}
                  />
                  <div>
                    <span style={{ fontWeight: 700, color: '#1a153f' }}>
                      Rp {(item.price * (item.quantity || 1)).toLocaleString()}
                    </span>
                  </div>
                </List.Item>
              )}
            />

            <Divider style={{ margin: '16px 0' }} />

            {/* Subtotal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '1rem' }}>
              <span>Subtotal Produk:</span>
              <span>Rp {totalPrice.toLocaleString()}</span>
            </div>
            
            {/* Biaya Pengiriman (Simulasi) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, fontSize: '1rem' }}>
              <span>Biaya Pengiriman:</span>
              <span style={{ color: '#52c41a' }}>GRATIS</span>
            </div>

            <Divider style={{ margin: '0 0 20px 0' }} />

            {/* Total Pembayaran */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, fontSize: '1.2rem', fontWeight: 'bold', color: '#1a153f' }}>
              <span>TOTAL PEMBAYARAN:</span>
              <span>Rp {totalPrice.toLocaleString()}</span>
            </div>

            <Button
              type="primary"
              size="large"
              block
              loading={submitting}
              style={{ backgroundColor: "#1a153f" }}
              onClick={() => form.submit()}
            >
              Bayar Sekarang
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}