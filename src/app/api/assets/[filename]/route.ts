import { verifyToken, type AccessTokenPayload } from "@/lib/jwt";
import { cookies } from "next/headers";
import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

const ROOT = join(process.cwd(), "src", "assets");

const MIME_TYPES: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await verifyToken<AccessTokenPayload>(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await params;

  const ext = filename.substring(filename.lastIndexOf(".")).toLowerCase();
  const contentType = MIME_TYPES[ext];
  if (!contentType) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const safeName = filename.replace(/\.\.\//g, "").replace(/^\/+/, "");
  const filePath = join(ROOT, payload.role, safeName);

  if (!filePath.startsWith(ROOT)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      status: 200,
      headers: { "Content-Type": contentType },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
