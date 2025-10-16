import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export function GET() {
  const filePath = path.join(process.cwd(), "data", "flashcard");

  const filesStorage: string[] = [];

  fs.readdirSync(filePath).map((file) => {
    if (file.endsWith(".json")) {
      filesStorage.push(file.replace(".json", ""));
    }
  });

  return NextResponse.json({ ok: true, files: filesStorage });
}

export async function POST(req: Request) {
  const { dir, q, r } = await req.json();
  if (!dir || !q || !r)
    return NextResponse.json(
      { ok: false, error: "Missing parameters" },
      { status: 400 }
    );
  const filePath = path.join(process.cwd(), "data", "flashcard", dir + ".json");

  const OldData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  OldData.push({ q, r });

  fs.writeFileSync(filePath, JSON.stringify(OldData, null, 2), "utf-8");

  return NextResponse.json({ ok: true });
}
