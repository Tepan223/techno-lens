import { list, put } from "@vercel/blob";
import { NextResponse } from "next/server";

const FILE_NAME = "users-akun.json";
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

// Helper readUsersFromBlob (diasumsikan sudah ada di file register/login, tapi diulang di sini)
async function readUsersFromBlob(token) {
    // ... (Logika readUsersFromBlob sama persis seperti di file login/register)
    try {
        const { blobs } = await list({ token });
        const existingBlob = blobs.find((b) => b.pathname === FILE_NAME);
        if (!existingBlob) return []; 

        const res = await fetch(existingBlob.url, { cache: 'no-store' });
        if (!res.ok) throw new Error("Gagal fetch data blob");

        const textData = await res.text();
        if (!textData || textData.trim() === "") return [];

        return JSON.parse(textData);
    } catch (err) {
        console.error("⚠️ Warning readUsersFromBlob:", err.message);
        return [];
    }
}

async function saveUsersToBlob(data, token) {
    // ... (Logika saveUsersToBlob sama persis)
    const jsonString = JSON.stringify(data, null, 2);
    await put(FILE_NAME, jsonString, {
        access: "public",
        token: token,
        addRandomSuffix: false,
        contentType: 'application/json',
        allowOverwrite: true, 
    });
}

// --- API UTAMA: UPDATE PASSWORD ---
export async function POST(req) {
  try {
    const { username, oldPassword, newPassword } = await req.json();
    const CLEAN_TOKEN = TOKEN.trim();
    
    if (!CLEAN_TOKEN) {
        return NextResponse.json({ message: "Token Blob hilang." }, { status: 500 });
    }

    const users = await readUsersFromBlob(CLEAN_TOKEN);
    const userIndex = users.findIndex(u => u.username === username);

    // Cek User dan Password Lama
    if (userIndex === -1 || users[userIndex].password !== oldPassword) {
      return NextResponse.json(
        { message: "Password lama salah atau user tidak ditemukan." },
        { status: 401 }
      );
    }

    // Update Password
    users[userIndex].password = newPassword;
    
    // Simpan data kembali ke Blob
    await saveUsersToBlob(users, CLEAN_TOKEN);

    // [PENTING] Karena kita tidak menggunakan hashing, ini adalah risiko keamanan.
    console.log(`Peringatan: Password user ${username} diubah tanpa hashing.`);

    return NextResponse.json(
      { message: "Password berhasil diubah!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ UPDATE PASSWORD API ERROR:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 }
    );
  }
}