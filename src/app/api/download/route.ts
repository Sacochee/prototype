import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { data, name } = await req.json();

  return new NextResponse(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=" + name + ".json",
    },
  });
}
