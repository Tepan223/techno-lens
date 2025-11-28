import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

const FILE_NAME = "users-akun.json";
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

// --- 0. CEK TOKEN ---
if (!TOKEN) {
  console.error("❌ ERROR: Token BLOB tidak ada di .env");
}

async function readUsersFromBlob() {
  try {
    const { blobs } = await list({ token: TOKEN });
    const existingBlob = blobs.find((b) => b.pathname === FILE_NAME);

    if (!existingBlob) {
      console.log(
        "⚠️ File JSON tidak ditemukan di Blob (Belum ada yang register)."
      );
      return [];
    }

    const res = await fetch(existingBlob.url, { cache: "no-store" });
    if (!res.ok) return [];

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("❌ Gagal membaca blob:", err);
    return [];
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, password } = body;

    console.log("================ LOGIN DEBUG ================");
    console.log("1. Input dari Frontend:", { username, password });

    // 1. Ambil semua data user dari Cloud
    const users = await readUsersFromBlob();
    console.log("2. Total User di Database:", users.length);
    console.log("3. Data User (Preview):", JSON.stringify(users, null, 2));

    // 2. Cari User
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!foundUser) {
      console.log("❌ GAGAL: Tidak ada user yang cocok.");
      console.log("=============================================");

      return NextResponse.json(
        { message: "Username atau Password salah!" },
        { status: 401 }
      );
    }

    console.log("✅ SUKSES: User ditemukan ->", foundUser.username);
    console.log("=============================================");

    // 3. Login Sukses
    return NextResponse.json(
      { message: "Login Berhasil", user: foundUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}
