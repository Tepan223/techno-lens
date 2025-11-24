import { kv } from "@vercel/kv";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// File lokal hanya untuk development
const filePath = path.join(process.cwd(), "app/product.json");

// --- GET PRODUCT ---
export async function GET() {
  try {
    // 1. Coba baca dari KV
    const kvData = await kv.get("product");
    if (kvData) {
      return NextResponse.json(kvData);
    }

    // 2. Jika KV kosong → baca file lokal (untuk mode dev)
    const data = fs.readFileSync(filePath, "utf8");
    return NextResponse.json(JSON.parse(data));

  } catch (err) {
    return NextResponse.json({ error: "Failed to read product" }, { status: 500 });
  }
}

// --- UPDATE PRODUCT ---
export async function POST(request) {
  try {
    const body = await request.json();

    // 1. Simpan ke KV (utama)
    await kv.set("product", body);

    // 2. Simpan ke file lokal hanya saat development
    if (process.env.NODE_ENV === "development") {
      fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
    }

    return NextResponse.json({ message: "success" });

  } catch (err) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
