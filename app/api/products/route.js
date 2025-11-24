import { NextResponse } from "next/server";
import { put, list } from "@vercel/blob";
import fs from "fs";
import path from "path";

const FILE_NAME = "products.json";
const LOCAL_PATH = path.join(process.cwd(), "app", FILE_NAME);

// --------------------
// READ LOCAL FILE
// --------------------
async function readLocal() {
  try {
    if (!fs.existsSync(LOCAL_PATH)) return [];
    const txt = fs.readFileSync(LOCAL_PATH, "utf8");
    if (!txt.trim()) return [];
    return JSON.parse(txt);
  } catch (e) {
    console.error("readLocal error:", e);
    return [];
  }
}

// --------------------
// WRITE LOCAL FILE
// --------------------
async function writeLocal(data) {
  try {
    fs.writeFileSync(LOCAL_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (e) {
    console.error("writeLocal error:", e);
  }
}

// --------------------
// GET PRODUCTS
// --------------------
export async function GET() {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    // --- DEVELOPMENT MODE OR NO TOKEN ---
    if (!token || process.env.NODE_ENV === "development") {
      const local = await readLocal();
      return NextResponse.json({ products: Array.isArray(local) ? local : [] });
    }

    // --- PRODUCTION USING VERCEL BLOB ---
    const res = await list();
    const file = res?.blobs?.find((b) => b.pathname === FILE_NAME);

    // File tidak ditemukan → tetap return JSON aman
    if (!file) {
      return NextResponse.json({ products: [] });
    }

    // Fetch blob
    const blobData = await fetch(file.url);
    const json = await blobData.json().catch(() => []);

    return NextResponse.json({
      products: Array.isArray(json) ? json : []
    });

  } catch (err) {
    console.error("GET /api/products error:", err);
    return NextResponse.json(
      { products: [] }, // fallback aman
      { status: 200 }
    );
  }
}

// --------------------
// POST PRODUCTS (SAVE)
// --------------------
export async function POST(req) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !Array.isArray(body.products)) {
      return NextResponse.json(
        { error: "Invalid payload, expected: { products: [] }" },
        { status: 400 }
      );
    }

    const products = body.products;
    const token = process.env.BLOB_READ_WRITE_TOKEN;

    // --- DEVELOPMENT MODE (LOCAL WRITE) ---
    if (!token || process.env.NODE_ENV === "development") {
      await writeLocal(products);
      return NextResponse.json({ message: "saved (local)", products });
    }

    // --- PRODUCTION (VERCEL BLOB) ---
    await put(FILE_NAME, JSON.stringify(products, null, 2), {
      access: "public",
      contentType: "application/json",
    });

    return NextResponse.json({ message: "saved", products });

  } catch (err) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: "SERVER FAILED" }, { status: 500 });
  }
}
