import { kv } from "@vercel/kv";
import { promises as fs } from "fs";
import path from "path";

// Lokasi file lokal (hanya dipakai saat development)
const filePath = path.join(process.cwd(), "app/users.json");

// --- GET USER ---
export async function GET() {
  try {
    // 1. Coba baca dari KV (source utama)
    const kvData = await kv.get("user");

    if (kvData) {
      return Response.json(kvData, { status: 200 });
    }

    // 2. Jika KV kosong → fallback ke file lokal
    const file = await fs.readFile(filePath, "utf-8");
    if (!file.trim()) {
      return Response.json({ user: null }, { status: 200 });
    }

    const json = JSON.parse(file);
    return Response.json(json, { status: 200 });

  } catch (err) {
    return Response.json({ user: null }, { status: 200 });
  }
}

// --- UPDATE USER ---
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.user) {
      return Response.json({ error: "Invalid user format" }, { status: 400 });
    }

    // 1. Simpan ke KV (utama)
    await kv.set("user", body);

    // 2. (Opsional) simpan ke file lokal untuk development
    if (process.env.NODE_ENV === "development") {
      await fs.writeFile(filePath, JSON.stringify(body, null, 2));
    }

    return Response.json({ message: "User updated!" }, { status: 200 });

  } catch (err) {
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}
