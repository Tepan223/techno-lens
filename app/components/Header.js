"use client";
import { useState } from "react";
// GANTI DARI "next/router" KE "next/navigation"
import Link from 'next/link'; 
import { useRouter } from "next/navigation"; 
// Sisa impor lainnya
import Styles from "../styles/Header.module.css";
import {
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Modal, Avatar, Button, Badge, Dropdown, message } from "antd";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import LoginModal from "../components/LoginModal";
import "@ant-design/v5-patch-for-react-19";

export default function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  // useRouter sekarang mengambil dari next/navigation
  const router = useRouter(); 

  // ... (Sisa kode komponen Anda tidak perlu diubah lagi)
  
  const { user, isLoggedIn, logout, openLoginModal } = useAuth();
  const { cart, removeFromCart } = useCart(); 

  const handleCartClick = () => {
    if (!isLoggedIn) {
      message.warning("Silakan login untuk melihat keranjang!");
      openLoginModal();
    } else {
      setIsCartOpen(true);
    }
  };

  const handleCloseCart = () => setIsCartOpen(false);

  const handleCheckout = () => {
    if (cart.length === 0) {
        message.warning("Keranjang Anda kosong!");
        return;
    }
    // Navigasi ini bekerja sama di kedua router
    router.push("/checkout"); 
    setIsCartOpen(false); 
  };

  const handleLogout = () => {
    logout(); 
    message.info("Berhasil Logout");
  };

  const totalItems = cart.length;
  const totalHarga = cart.reduce((sum, item) => sum + item.price, 0);

  const userMenuItems = [
    {
      key: "1",
      label: <Link href="/profile">Profile</Link>,
    },
    {
      key: "2",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <div className={Styles.header}>
      <LoginModal />

      <div>
        <Link href="/" className={Styles.logo}>
          <img src="/images/Techno-Lens.png" className={Styles.techno} alt="Techno-Lens Logo" />
        </Link>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <div className={Styles.navlinks}>
          <Link href="/" className={Styles.link}>Home</Link>
          <Link href="/about" className={Styles.link}>About</Link>
          <Link href="/product" className={Styles.link}>Product</Link>
          <Link href="/contact" className={Styles.link}>Contact</Link>
        </div>

        {isLoggedIn ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <Avatar
                style={{ backgroundColor: "#1a153f" }}
                icon={<UserOutlined />}
                size={40}
              />
              <span style={{ color: "#1a153f", fontWeight: "bold" }}>
                {user.name}
              </span>
            </div>
          </Dropdown>
        ) : (
          <div onClick={openLoginModal} style={{ cursor: "pointer" }}>
            <Avatar
              style={{ backgroundColor: "#ccc" }}
              icon={<UserOutlined />}
              size={40}
            />
          </div>
        )}

        <div className={Styles.carticon} onClick={handleCartClick}>
          <Badge count={isLoggedIn ? cart.length : 0} size="small">
            <ShoppingCartOutlined
              style={{ fontSize: "35px", cursor: "pointer", color: "#1a153f" }}
            />
          </Badge>
        </div>

        <Modal
          title="Keranjang Belanja"
          open={isCartOpen}
          onOk={handleCheckout} 
          onCancel={handleCloseCart}
          okText="Checkout"
          cancelText="Tutup"
          okButtonProps={{ disabled: cart.length === 0 }} 
        >
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <p>Keranjang masih kosong nih.</p>
            </div>
          ) : (
            <>
              {cart.map((item, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "10px",
                  }}
                >
                  <div>
                    <strong>{item.name}</strong> <br />
                    <span style={{ color: "#888" }}>
                      Rp {item.price.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    type="text"
                    danger
                    onClick={() => removeFromCart(index)}
                  >
                    Hapus
                  </Button>
                </div>
              ))}

              <div style={{ marginTop: "20px", textAlign: "right" }}>
                <p style={{ fontSize: "16px" }}>
                  Total ({totalItems} item):
                  <strong style={{ fontSize: "18px", color: "#1a153f" }}>
                    {" "}
                    Rp {totalHarga.toLocaleString()}
                  </strong>
                </p>
              </div>
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}