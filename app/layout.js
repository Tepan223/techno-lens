import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext"; // Import baru
import LoginModal from "./components/LoginModal"; // Import Login Modal global

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "TECHNO LENS",
  description: "Market Place for Techno Lens",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
        <CartProvider>
          <Header />
          <LoginModal /> {/* Pasang Login Modal di sini agar bisa dipanggil global */}
          {children}
        </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
