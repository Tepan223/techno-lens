"use client";
import React from "react";
import { Card, Form, Input, Button, Row, Col, Typography, Divider, Alert } from "antd";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const { user, isLoggedIn, updateUserPassword } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();

  // --- Redirect/Guard Jika Belum Login ---
  if (!isLoggedIn) {
    return (
      <div style={{ padding: 50, textAlign: 'center' }}>
        <Alert
            message="Akses Ditolak"
            description="Anda harus login untuk mengakses halaman profile."
            type="error"
            showIcon
        />
        <Button 
            type="primary" 
            style={{ marginTop: 20, backgroundColor: '#1a153f' }}
            onClick={() => router.push('/')}
        >
            Kembali ke Home
        </Button>
      </div>
    );
  }

  // --- LOGIKA GANTI PASSWORD ---
  const onFinishChangePassword = async (values) => {
    // Panggil fungsi update dari AuthContext
    const success = await updateUserPassword(values.oldPassword, values.newPassword);
    
    if (success) {
      // Bersihkan field jika berhasil
      form.resetFields(); 
    }
  };

  return (
    <div style={{ padding: '50px 5%', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Title level={2} style={{ color: '#1a153f', textAlign: 'center', marginBottom: 30 }}>
        <UserOutlined /> Profil Akun
      </Title>
      
      <Row gutter={[32, 32]} justify="center">
        
        {/* --- KOLOM 1: INFO USER --- */}
        <Col xs={24} md={10}>
          <Card 
            title={<Title level={4} style={{ margin: 0 }}>Data Pengguna</Title>} 
            // FIX: Ganti bordered={false}
            variant="default" 
            style={{ borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <Divider orientation="left" style={{ borderTopColor: '#ccc' }}>Informasi Dasar</Divider>
            
            <p>
              <Text strong>Nama Lengkap:</Text> <br/>
              <Text>{user.name}</Text>
            </p>
            
            <p style={{ marginTop: 15 }}>
              <Text strong>Username (ID):</Text> <br/>
              <Text>{user.username}</Text>
            </p>

            <p style={{ marginTop: 15 }}>
              <Text strong>Role Akun:</Text> <br/>
              <Text type="secondary">{user.role}</Text>
            </p>
            
          </Card>
        </Col>

        {/* --- KOLOM 2: GANTI PASSWORD --- */}
        <Col xs={24} md={10}>
          <Card 
            title={<Title level={4} style={{ margin: 0, color: '#1a153f' }}><KeyOutlined /> Ubah Password</Title>} 
            // FIX: Ganti bordered={false}
            variant="default"
            style={{ borderRadius: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinishChangePassword}
              requiredMark={false}
            >
              
              {/* Password Lama */}
              <Form.Item
                name="oldPassword"
                label="Password Lama"
                rules={[{ required: true, message: 'Masukkan password lama Anda!' }]}
              >
                <Input.Password prefix={<KeyOutlined />} placeholder="Password lama" />
              </Form.Item>
              
              <Divider style={{ margin: '10px 0' }} />

              {/* Password Baru */}
              <Form.Item
                name="newPassword"
                label="Password Baru"
                rules={[{ required: true, message: 'Masukkan password baru!' }, { min: 6, message: 'Minimal 6 karakter' }]}
              >
                <Input.Password prefix={<KeyOutlined />} placeholder="Password baru" />
              </Form.Item>

              {/* Konfirmasi Password Baru */}
              <Form.Item
                name="confirmNewPassword"
                label="Konfirmasi Password Baru"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Konfirmasi password baru Anda!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Password baru tidak cocok!'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<KeyOutlined />} placeholder="Ulangi password baru" />
              </Form.Item>

              <Form.Item style={{ marginTop: 20 }}>
                <Button 
                    type="primary" 
                    htmlType="submit" 
                    block
                    style={{ backgroundColor: '#1a153f' }}
                >
                  Ubah Password
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}