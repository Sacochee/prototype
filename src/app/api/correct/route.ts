import { NextResponse } from "next/server";
import Together from "together-ai";
import fs from "fs";
import path from "path";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  async function api(prompt: string) {
    const together = new Together({
      apiKey:
        "acedc05c0c0d15f97d330657e48b7cfc991cd96d0f75a7de4a69af7e4f132a41", // sécurise la clé
    });

    const response = await together.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    });

    if (response.choices[0].message) {
      return response.choices[0].message.content;
    } else {
      throw new Error("No response from API");
    }
  }
  try {
    const body = await req.json();
    const { raw } = body;
    //TODO check raw et si raw pas trop grand.

    // const filePath = path.join(process.cwd(), "src", "prompts", "P1.md");
    // const prompt = fs.readFileSync(filePath, "utf-8");
    // const promptTxt = prompt.replace("{texte}", raw);
    // const html = await api(promptTxt);

    //passe 1

    const filePath = path.join(process.cwd(), "src", "prompts", "passe0.md");
    const prompt = fs.readFileSync(filePath, "utf-8");
    const promptTxt = prompt.replace("{texte}", raw);
    const passe1 = await api(promptTxt);

    if (passe1 === null) throw new Error("pas de Pass1");

    const filePath2 = path.join(process.cwd(), "src", "prompts", "passe1.md");
    const prompt2 = fs.readFileSync(filePath2, "utf-8");
    const promptTxt1 = prompt2.replace("{texte_original}", raw);
    const promptTxt2 = promptTxt1.replace("{texte_corrige_pass1}", passe1);
    const html = await api(promptTxt2);

    // TODO add un check de sécurité .

    // await  delay(1000) démo

    return NextResponse.json({ res: html });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
