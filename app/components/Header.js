'use client';
import { useState } from "react";
import Styles from '../styles/Header.module.css'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Modal, Avatar } from "antd";

export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => setIsModalOpen(true);
    const handleOk = () => setIsModalOpen(false);
    const handleCancel = () => setIsModalOpen(false);

  return (
    <div className={Styles.header}>
        <div>
            <a href="/" className={Styles.logo}>
                <img src='Techno-Lens.png' className={Styles.techno}></img>
            </a>
        </div>

        <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'20px'}}>
            <div className={Styles.navlinks}>
                <a href="/" className={Styles.link}>Home</a>
                <a href="/about" className={Styles.link}>About</a>
                <a href="/product" className={Styles.link}>Product</a>
                <a href="/contact" className={Styles.link}>Contact</a>
            </div>

            {/* Avatar Login */}
            <a href="/login">
                <Avatar 
                    style={{ 
                        backgroundColor: "#1a153f", 
                        cursor: "pointer" 
                    }} 
                    icon={<UserOutlined />} 
                    size={40}
                />
            </a>

            {/* Cart Icon */}
            <div className={Styles.carticon} onClick={showModal}>
                <ShoppingCartOutlined 
                    style={{ fontSize: "35px", cursor: "pointer", color: "#1a153f" }} 
                />
            </div>

            <Modal
                title="Cart Items"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Checkout"
                cancelText="Close"
            >
                <p>Your cart is empty.</p>
            </Modal>
        </div>
    </div>
  );
}
