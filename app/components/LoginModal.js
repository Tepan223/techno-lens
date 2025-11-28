"use client";
import React, { useState } from "react";
import { Modal, Form, Input, Button } from "antd"; // Hapus message, sudah di handle Context
import { UserOutlined, LockOutlined, SmileOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";

export default function LoginModal() {
  const { isLoginModalOpen, closeLoginModal, login, register } = useAuth();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [form] = Form.useForm();

  const handleCancel = () => {
    closeLoginModal();
    form.resetFields();
    setIsRegisterMode(false);
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    form.resetFields();
  };

  const onFinish = (values) => {
    if (isRegisterMode) {
      // REGISTER
      register(values); 
    } else {
      // LOGIN
      // Perbaikan: Kirim 2 parameter (username dan password)
      login(values.username, values.password);
    }
  };

  return (
    <Modal
      title={null}
      open={isLoginModalOpen}
      onCancel={handleCancel}
      footer={null}
      centered
      width={400}
    >
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h2 style={{ color: "#1a153f", margin: 0 }}>
          {isRegisterMode ? "Buat Akun Baru" : "Selamat Datang"}
        </h2>
        <p style={{ color: "#888" }}>
          {isRegisterMode ? "Isi data diri kamu untuk mendaftar" : "Silakan login untuk melanjutkan"}
        </p>
      </div>

      <Form onFinish={onFinish} layout="vertical" form={form} size="large">
        
        {isRegisterMode && (
          <Form.Item
            name="fullname"
            rules={[{ required: true, message: "Nama Lengkap wajib diisi!" }]}
          >
            <Input prefix={<SmileOutlined />} placeholder="Nama Lengkap" />
          </Form.Item>
        )}

        <Form.Item
          name="username"
          rules={[{ required: true, message: "Username wajib diisi!" }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Username" 
            autoComplete="username" 
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Password wajib diisi!" }]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder="Password" 
            autoComplete="current-password" 
          />
        </Form.Item>

        {isRegisterMode && (
          <Form.Item
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Konfirmasi passwordmu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Password tidak cocok!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Konfirmasi Password" 
              autoComplete="new-password"
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ backgroundColor: "#1a153f", borderColor: "#1a153f", fontWeight: "bold" }}
          >
            {isRegisterMode ? "Daftar Sekarang" : "Masuk"}
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: "center", marginTop: 10 }}>
        <span style={{ color: "#666" }}>
          {isRegisterMode ? "Sudah punya akun? " : "Belum punya akun? "}
        </span>
        <a onClick={toggleMode} style={{ color: "#1a153f", fontWeight: "bold", cursor: "pointer" }}>
          {isRegisterMode ? "Login di sini" : "Daftar di sini"}
        </a>
      </div>
    </Modal>
  );
}