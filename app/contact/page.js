'use client';
import Style from '../styles/Contact.module.css'
import { Form, Input, Button } from 'antd';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form Values:', values);
  };

  return (
    <div className={Style.pageWrapper}>
      <div className={Style.contactPage}>
        <div className={Style.contact}>
          <h1>Hubungi Kami</h1>

          <div className={Style.textnform}>
            <div className={Style.text}>
              <h3>PT. TechnoLens</h3>

              <p>
                WhatsApp:{" "}
                <a 
                  href="https://wa.me/6281280393380" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: "#1677ff", textDecoration: "none", fontWeight: "500" }}
                >
                  0812-8039-3380
                </a>
              </p>

              <p>Jam Operasional: <br />Senin-Jumat<br/>08:00 A.M - 17:00 P.M</p>
            </div>

            <div className={Style.form}>
              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
              >
                <Form.Item
                  label="Nama"
                  name="name"
                  rules={[{ required: true, message: 'Nama wajib diisi' }]}
                >
                  <Input size="large" placeholder="Masukkan nama Anda" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Email wajib diisi' },
                    { type: 'email', message: 'Format email tidak valid' }
                  ]}
                >
                  <Input size="large" placeholder="Masukkan email Anda" />
                </Form.Item>

                <Form.Item
                  label="Nomor Kontak"
                  name="phone"
                  rules={[
                    { required: true, message: 'Nomor kontak wajib diisi' },
                    { pattern: /^[0-9 +()-]+$/, message: 'Gunakan angka atau simbol valid' },
                  ]}
                >
                  <Input size="large" placeholder="Contoh: 0812 3456 7890" />
                </Form.Item>

                <Form.Item
                  label="Pesan"
                  name="message"
                  rules={[{ required: true, message: 'Pesan wajib diisi' }]}
                >
                  <Input.TextArea
                    rows={4}
                    size="large"
                    placeholder="Tulis pesan Anda..."
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    className={Style.submitBtn}
                  >
                    Kirim
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
