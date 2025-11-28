'use client';
import { useState } from "react";
import Styles from '../styles/Header.module.css';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Modal, Avatar, Button, Badge } from "antd";
import { useCart } from "../context/CartContext";
import '@ant-design/v5-patch-for-react-19';


export default function Header() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { cart, removeFromCart } = useCart();
    const showModal = () => setIsModalOpen(true);
    const handleOk = () => setIsModalOpen(false);
    const handleCancel = () => setIsModalOpen(false);

    // Hitung total item & total harga
    const totalItems = cart.length;
    const totalHarga = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <div className={Styles.header}>
            <div>
                <a href="/" className={Styles.logo}>
                    <img src='/images/Techno-Lens.png' className={Styles.techno} />
                </a>
            </div>

            <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:'20px'}}>

                {/* Navbar */}
                <div className={Styles.navlinks}>
                    <a href="/" className={Styles.link}>Home</a>
                    <a href="/about" className={Styles.link}>About</a>
                    <a href="/product" className={Styles.link}>Product</a>
                    <a href="/contact" className={Styles.link}>Contact</a>
                </div>

                {/* Avatar Login */}
                <a href="/login">
                    <Avatar 
                        style={{ backgroundColor: "#1a153f", cursor: "pointer" }} 
                        icon={<UserOutlined />} 
                        size={40}
                    />
                </a>

                {/* Cart Icon + Badge */}
                <div className={Styles.carticon} onClick={showModal}>
                    <Badge count={cart.length} size="small">
                        <ShoppingCartOutlined 
                            style={{ fontSize: "35px", cursor: "pointer", color: "#1a153f" }} 
                        />
                    </Badge>
                </div>

                {/* Modal Cart */}
                <Modal
                    title="Cart Items"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Checkout"
                    cancelText="Close"
                >

                    {cart.length === 0 ? (
                        <p>Belom ada item untuk dibeli</p>
                    ) : (
                        <>
                            {cart.map((item, index) => (
                                <div 
                                    key={index} 
                                    style={{
                                        marginBottom: "15px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <div>
                                        <strong>{item.name}</strong> <br />
                                        Rp {item.price.toLocaleString()}
                                    </div>

                                    <Button 
                                        danger 
                                        onClick={() => removeFromCart(index)}
                                    >
                                        Hapus
                                    </Button>
                                </div>
                            ))}

                            {/* TOTAL ITEM + TOTAL HARGA */}
                            <hr />

                            <div style={{ marginTop: "10px" }}>
                                <p><strong>Total Item:</strong> {totalItems}</p>
                                <p>
                                    <strong>Total Harga:</strong> 
                                    &nbsp; Rp {totalHarga.toLocaleString()}
                                </p>
                            </div>
                        </>
                    )}

                </Modal>
            </div>
        </div>
    );
}
