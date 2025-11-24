import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "app/users.json");

// --- GET USER ---
export async function GET() {
  try {
    const file = await fs.readFile(filePath, "utf-8");

    if (!file.trim()) {
      return Response.json({ user: null }, { status: 200 });
    }

    const json = JSON.parse(file);
    return Response.json(json);

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

    await fs.writeFile(filePath, JSON.stringify(body, null, 2));

    return Response.json({ message: "User updated!" });

  } catch (err) {
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
}
