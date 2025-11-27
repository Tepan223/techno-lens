import { list, put } from "@vercel/blob";

const FILE_NAME = "users.json";
const TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

// --- READ BLOB ---
async function readBlob() {
  try {
    const blobs = await list({ token: TOKEN });
    const existing = blobs.blobs.find((b) => b.pathname === FILE_NAME);

    if (!existing) return { user: null };

    const res = await fetch(existing.url);
    if (!res.ok) return { user: null };

    return await res.json();
  } catch (err) {
    console.error("readBlob error:", err);
    return { user: null };
  }
}

// --- WRITE BLOB ---
async function writeBlob(data) {
  await put(FILE_NAME, JSON.stringify(data, null, 2), {
    access: "public",
    token: TOKEN,
    allowOverwrite: true, // WAJIB supaya bisa update tanpa error
  });
}

// --- GET USER ---
export async function GET() {
  const data = await readBlob();
  return Response.json(data);
}

// --- UPDATE USER ---
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body?.user) {
      return Response.json(
        { error: "Invalid format. Use { user: { username, password } }" },
        { status: 400 }
      );
    }

    // Ambil data lama
    const oldData = await readBlob();

    // Merge user lama dengan user baru
    const newData = {
      user: {
        ...oldData.user,
        ...body.user,
      },
    };

    // Simpan ke blob
    await writeBlob(newData);

    return Response.json({
      message: "User updated!",
      data: newData,
    });
  } catch (err) {
    console.error("POST error:", err);
    return Response.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
  