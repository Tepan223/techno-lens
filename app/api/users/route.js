import { promises as fs } from "fs";
import path from "path";

const DEV_FILE = path.join(process.cwd(), "app/users.json");

// --- GET USER ---
export async function GET() {
  try {
    const data = await fs.readFile(DEV_FILE, "utf-8");
    if (!data.trim()) return Response.json({ user: null });
    const json = JSON.parse(data);
    return Response.json({ user: json.user || null });
  } catch {
    return Response.json({ user: null });
  }
}

// --- POST / UPDATE USER ---
export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.user?.username || !body.user?.password) {
      return Response.json({ error: "Username & password required" }, { status: 400 });
    }

    // simpan ke file lokal
    await fs.writeFile(DEV_FILE, JSON.stringify(body, null, 2));

    return Response.json({ message: "User berhasil diperbarui!" });
  } catch (e) {
    console.error(e);
    return Response.json({ error: "SERVER ERROR" }, { status: 500 });
  }
}
