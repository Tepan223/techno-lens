import { list, put } from "@vercel/blob";
import { NextResponse } from "next/server";

const FILE_NAME = "users-akun.json";

// --- 1. FUNGSI READ ---
async function readUsersFromBlob(token) {
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

// --- 2. FUNGSI SAVE (DIPERBAIKI) ---
async function saveUsersToBlob(data, token) {
  const jsonString = JSON.stringify(data, null, 2);
  
  await put(FILE_NAME, jsonString, {
    access: "public",
    token: token,
    addRandomSuffix: false, // Nama file tetap konsisten
    contentType: 'application/json',
    allowOverwrite: true, // <--- INI SOLUSINYA! Izinkan menimpa file lama
  });
}

// --- MAIN API HANDLER ---
export async function POST(req) {
  try {
    // 1. Ambil & Bersihkan Token
    const rawToken = process.env.BLOB_READ_WRITE_TOKEN;
    if (!rawToken) {
      return NextResponse.json({ message: "Token Blob hilang." }, { status: 500 });
    }
    const CLEAN_TOKEN = rawToken.trim();

    // 2. Parse Body
    let body;
    try {
        body = await req.json();
    } catch (e) {
        return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
    }
    
    const { fullname, username, password } = body;

    if (!fullname || !username || !password) {
      return NextResponse.json({ message: "Data tidak lengkap!" }, { status: 400 });
    }

    // 3. Baca User Lama
    const users = await readUsersFromBlob(CLEAN_TOKEN);

    // 4. Cek Duplikasi
    const userList = Array.isArray(users) ? users : [];
    if (userList.find((u) => u.username === username)) {
      return NextResponse.json({ message: "Username sudah dipakai!" }, { status: 400 });
    }

    // 5. Buat User Baru
    const newUser = {
      id: Date.now(),
      fullname,
      username,
      password, 
      role: "member",
      createdAt: new Date().toISOString()
    };

    // 6. Simpan (Overwrite file lama)
    const updatedUsers = [...userList, newUser];
    await saveUsersToBlob(updatedUsers, CLEAN_TOKEN);

    console.log("✅ Register Sukses:", username);

    return NextResponse.json(
      { message: "Registrasi Berhasil!", user: newUser },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ REGISTER ERROR:", error);
    return NextResponse.json(
      { message: "Server Error: " + error.message },
      { status: 500 }
    );
  }
}