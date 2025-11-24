import { put, list } from "@vercel/blob";
import { NextResponse } from "next/server";

const FILE_NAME = "products.json";

// --- GET PRODUCT ---
export async function GET() {
  try {
    // Cari file bernama products.json
    const files = await list();
    const file = files.blobs.find(b => b.pathname === FILE_NAME);

    if (!file) {
      return NextResponse.json([]); // belum ada file
    }

    // Fetch data JSON dari URL blob
    const json = await fetch(file.url).then(res => res.json());
    return NextResponse.json(json);

  } catch (err) {
    console.error("GET ERROR:", err);
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 });
  }
}

// --- UPDATE PRODUCT ---
export async function POST(request) {
  try {
    const body = await request.json();

    await put(FILE_NAME, JSON.stringify(body, null, 2), {
      access: "public",
      contentType: "application/json"
    });

    return NextResponse.json({ message: "success" });

  } catch (err) {
    console.error("POST ERROR:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
