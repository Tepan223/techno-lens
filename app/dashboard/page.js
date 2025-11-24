"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  Table,
  Card,
  Row,
  Col,
  Modal,
  message
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

// Convert file ke base64
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function ProductDashboard() {
  const [products, setProducts] = useState([]);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // LOGIN STATE
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginForm] = Form.useForm();

  // USER STATE
  const [activeUser, setActiveUser] = useState(null);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [editUserForm] = Form.useForm();

  // --- LOAD PRODUCTS ---
  const loadData = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Gagal load products:", err);
    }
  };

  // --- LOAD USER ---
  const loadUser = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();

      if (data?.user) {
        setActiveUser(data.user);
      }
    } catch (err) {
      console.error("Gagal load user:", err);
    }
  };

  useEffect(() => {
    loadData();
    loadUser();
  }, []);

  // --- SAVE PRODUCTS JSON ---
  const saveJSON = async (data) => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: data })
    });

    message.success("Produk berhasil disimpan!");
  };

  // --- SAVE USER JSON ---
  const saveUserJSON = async (data) => {
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: data })
    });

    message.success("User berhasil diperbarui!");
  };

  // --- TAMBAH PRODUK (SUDAH ADA KATEGORI) ---
  const onFinish = async (values) => {
    let base64 = "";

    if (values.image?.[0]) {
      base64 = await toBase64(values.image[0].originFileObj);
    }

    const newItem = {
      id: products.length ? products[products.length - 1].id + 1 : 1,
      name: values.name,
      price: values.price,
      category: values.category,   // <--- TAMBAHAN
      image: base64
    };

    const updated = [...products, newItem];

    setProducts(updated);
    saveJSON(updated);
    form.resetFields();
  };

  // --- DELETE PRODUK ---
  const deleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveJSON(updated);
  };

  // --- EDIT PRODUK ---
  const openEditModal = (record) => {
    setSelectedProduct(record);
    editForm.setFieldsValue({
      name: record.name,
      price: record.price,
      category: record.category,  // <--- TAMBAHAN
      image: []
    });
    setIsEditOpen(true);
  };

  const submitEdit = async () => {
    editForm.validateFields().then(async (values) => {
      let base64 = null;

      if (values.image?.[0]) {
        base64 = await toBase64(values.image[0].originFileObj);
      }

      const updated = products.map((item) =>
        item.id === selectedProduct.id
          ? {
              ...item,
              name: values.name,
              price: values.price,
              category: values.category,   // <--- TAMBAHAN
              image: base64 || item.image
            }
          : item
      );

      setProducts(updated);
      saveJSON(updated);

      setIsEditOpen(false);
      editForm.resetFields();
    });
  };

  // --- LOGIN ---
  const handleLogin = async () => {
    loginForm.validateFields().then(async (values) => {
      const res = await fetch("/api/users");
      const data = await res.json();

      if (!data?.user) {
        message.error("User tidak ditemukan!");
        return;
      }

      if (
        values.username === data.user.username &&
        values.password === data.user.password
      ) {
        setIsLoggedIn(true);
        setActiveUser(data.user);
        setLoginOpen(false);
        message.success("Login berhasil!");
      } else {
        message.error("Username atau password salah!");
      }
    });
  };

  // --- EDIT USER ---
  const openEditUser = () => {
    editUserForm.setFieldsValue({
      username: activeUser?.username,
      password: activeUser?.password
    });
    setEditUserOpen(true);
  };

  const submitEditUser = () => {
    editUserForm.validateFields().then((values) => {
      saveUserJSON(values);
      setActiveUser(values);
      setEditUserOpen(false);
    });
  };

  // --- TABEL PRODUK (TAMBAH KATEGORI) ---
  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "Nama", dataIndex: "name" },
    { title: "Kategori", dataIndex: "category" }, // <--- TAMBAHAN
    {
      title: "Harga",
      dataIndex: "price",
      render: (h) => "Rp " + h.toLocaleString()
    },
    {
      title: "Gambar",
      dataIndex: "image",
      render: (img) =>
        img ? (
          <img src={img} style={{ width: 50, height: 50, objectFit: "cover" }} />
        ) : (
          "Tidak ada"
        )
    },
    {
      title: "Aksi",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="primary" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Button danger onClick={() => deleteProduct(record.id)}>
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* LOGIN BUTTON */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
        {!isLoggedIn ? (
          <Button
            type="primary"
            onClick={() => setLoginOpen(true)}
            style={{ marginBottom: "10px" }}
          >
            Login Admin
          </Button>
        ) : (
          <>
            <Button onClick={openEditUser}>Edit Akun</Button>
            <Button danger onClick={() => setIsLoggedIn(false)}>
              Logout
            </Button>
          </>
        )}
      </div>

      {/* DASHBOARD */}
      {isLoggedIn ? (
        <Row gutter={[16, 16]}>
          {/* FORM TAMBAH PRODUK */}
          <Col xs={24} md={10}>
            <Card title="Tambah Produk">
              <Form layout="vertical" form={form} onFinish={onFinish}>
                <Form.Item
                  name="name"
                  label="Nama Produk"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="price"
                  label="Harga"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                {/* KATEGORI */}
                <Form.Item
                  name="category"
                  label="Kategori"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Contoh: Makanan, Minuman" />
                </Form.Item>

                <Form.Item
                  name="image"
                  label="Gambar"
                  valuePropName="fileList"
                  getValueFromEvent={(e) =>
                    Array.isArray(e) ? e : e?.fileList
                  }
                >
                  <Upload beforeUpload={() => false} listType="picture">
                    <Button icon={<UploadOutlined />}>Upload</Button>
                  </Upload>
                </Form.Item>

                <Button type="primary" htmlType="submit" block>
                  Tambah Produk
                </Button>
              </Form>
            </Card>
          </Col>

          {/* TABEL PRODUK */}
          <Col xs={24} md={14}>
            <Card title="Daftar Produk">
              <Table
                dataSource={products}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </Col>
        </Row>
      ) : (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <h2>Silakan Login Untuk Mengakses Dashboard</h2>
        </Card>
      )}

      {/* MODAL EDIT PRODUK */}
      <Modal
        title="Edit Produk"
        open={isEditOpen}
        onCancel={() => setIsEditOpen(false)}
        onOk={submitEdit}
      >
        <Form layout="vertical" form={editForm}>
          <Form.Item name="name" label="Nama Produk" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Harga" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          {/* KATEGORI EDIT */}
          <Form.Item name="category" label="Kategori" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="image"
            label="Gambar Baru (Opsional)"
            valuePropName="fileList"
            getValueFromEvent={(e) =>
              Array.isArray(e) ? e : e?.fileList
            }
          >
            <Upload beforeUpload={() => false} listType="picture">
              <Button icon={<UploadOutlined />}>Upload Baru</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL LOGIN */}
      <Modal
        open={loginOpen}
        title="Login Admin"
        onCancel={() => setLoginOpen(false)}
        onOk={handleLogin}
      >
        <Form form={loginForm} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>

      {/* MODAL EDIT USER */}
      <Modal
        open={editUserOpen}
        title="Edit Akun"
        onCancel={() => setEditUserOpen(false)}
        onOk={submitEditUser}
      >
        <Form form={editUserForm} layout="vertical">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
