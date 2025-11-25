import { list, put } from "@vercel/blob";

const FILE_NAME = "products.json";
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

// --- READ BLOB ---
async function readBlob() {
  try {
    const blobs = await list({ token: TOKEN });
    const existing = blobs.blobs.find((b) => b.pathname === FILE_NAME);

    if (!existing) return [];

    const res = await fetch(existing.url);
    if (!res.ok) return [];

    return await res.json();
  } catch (err) {
    console.error("readBlob error:", err);
    return [];
  }
}

// --- WRITE BLOB ---
async function writeBlob(data) {
  await put(FILE_NAME, JSON.stringify(data, null, 2), {
    access: "public",
    token: TOKEN,
    allowOverwrite: true,        // ← WAJIB!!!
  });
}

// --- API GET ---
export async function GET() {
  const data = await readBlob();
  return Response.json(data);
}

// --- API POST ---
export async function POST(req) {
  try {
    const body = await req.json();

    await writeBlob(body);

    return Response.json({ message: "success" });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}
