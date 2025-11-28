"use client";
import { useState } from "react";
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

  const { user, isLoggedIn, logout, openLoginModal } = useAuth();
  // Kita tidak butuh clearCart di sini lagi
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

  // --- PERBAIKAN DI SINI ---
  const handleLogout = () => {
    // 1. Cukup panggil logout dari AuthContext
    logout(); 
    
    // 2. JANGAN panggil clearCart(). 
    // Biarkan data keranjang user tersimpan aman di LocalStorage.
    // Context akan otomatis mengubah keranjang tampilan menjadi kosong (Guest).

    message.info("Berhasil Logout");
  };

  const totalItems = cart.length;
  const totalHarga = cart.reduce((sum, item) => sum + item.price, 0);

  const userMenuItems = [
    {
      key: "1",
      label: <a href="/profile">Profile</a>,
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
        <a href="/" className={Styles.logo}>
          <img src="/images/Techno-Lens.png" className={Styles.techno} />
        </a>
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
          <a href="/" className={Styles.link}>Home</a>
          <a href="/about" className={Styles.link}>About</a>
          <a href="/product" className={Styles.link}>Product</a>
          <a href="/contact" className={Styles.link}>Contact</a>
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
          onOk={handleCloseCart}
          onCancel={handleCloseCart}
          okText="Checkout"
          cancelText="Tutup"
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