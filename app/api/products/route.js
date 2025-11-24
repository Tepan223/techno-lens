import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Tentukan lokasi file JSON yang akan dibaca/ditulis
const filePath = path.join(process.cwd(), "app/product.json");

export async function GET() {
  // Membaca file product.json secara sinkron
  // fs.readFileSync akan membaca isi file sebagai string UTF-8
  const data = fs.readFileSync(filePath, "utf8");

  // Mengirim response berupa JSON ke client
  return NextResponse.json(JSON.parse(data));
}

export async function POST(request) {
  // Mengambil body request dan parsing menjadi object
  const body = await request.json();

  // Menulis ulang file product.json dengan data baru
  // JSON.stringify(body, null, 2) --> merapikan format JSON
  fs.writeFileSync(filePath, JSON.stringify(body, null, 2));

  // Mengirim response sukses
  return NextResponse.json({ message: "success" });
}
