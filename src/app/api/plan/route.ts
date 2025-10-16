import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import api from "../API";
import { title } from "process";

export async function POST(req: Request) {
  const { chunk } = await req.json();

  const filePath = path.join(process.cwd(), "src", "prompts", "PlanGet.md");
  const promptTemplate = fs.readFileSync(filePath, "utf8");

  const fnc = () => api(promptTemplate.replace("{chunk}", chunk));

  let boucle = 0;
  let lastRes: string | null;

  async function parseJson() {
    boucle++;
    if (boucle > 5) {
      console.error(lastRes);
      return NextResponse.json(
        { status: "ok", message: "Fichier introuvable.", titles: [] },
        { status: 404 }
      );
    }

    const response = await fnc();
    lastRes = response;
    try {
      const data = JSON.parse(response || "[]");
      console.log(data);
      return NextResponse.json({ status: "ok", titles: data });
    } catch (err) {
      return parseJson();
    }
  }

  return parseJson();
}
