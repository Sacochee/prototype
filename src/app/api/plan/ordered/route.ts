import fs from "fs";
import path from "path";
import api from "../../API";
import { NextResponse } from "next/server";



type titles = [
  {
    text: string;
    id: string;
    lvl?: number;
  }
];

export async function POST(req: Request) {
  const { titles } = (await req.json()) as { titles: titles };

  const filePath = path.join(process.cwd(), "src", "prompts", "PlanOrdered.md");
  const promptTemplate = fs.readFileSync(filePath, "utf8");

  const fnc = () =>
    api(promptTemplate.replace("{titles}", JSON.stringify(titles)));

  let lastRes: any;
  let boucle = 0

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
