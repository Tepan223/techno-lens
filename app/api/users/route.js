import { put, list } from "@vercel/blob";
import { NextResponse } from "next/server";

const FILE_NAME = "users.json";

// --- GET USER ---
export async function GET() {
  try {
    // Cari file users.json di blob storage
    const files = await list();
    const file = files.blobs.find(b => b.pathname === FILE_NAME);

    if (!file) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const json = await fetch(file.url).then(res => res.json());

    return NextResponse.json(json, { status: 200 });

  } catch (err) {
    console.error("GET users error:", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

// --- UPDATE USER ---
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.user) {
      return NextResponse.json(
        { error: "Invalid user format" },
        { status: 400 }
      );
    }

    // Simpan JSON ke blob
    await put(FILE_NAME, JSON.stringify(body, null, 2), {
      access: "public",
      contentType: "application/json"
    });

    return NextResponse.json(
      { message: "User updated!" },
      { status: 200 }
    );

  } catch (err) {
    console.error("POST users error:", err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
