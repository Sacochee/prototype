import { NextResponse } from "next/server";
import Together from "together-ai";
import fs from "fs";
import path from "path";
import { Console } from "console";


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
    const { context, q, r } = body;
    //TODO check raw et si raw pas trop grand.

    // const filePath = path.join(process.cwd(), "src", "prompts", "P1.md");
    // const prompt = fs.readFileSync(filePath, "utf-8");
    // const promptTxt = prompt.replace("{texte}", raw);
    // const html = await api(promptTxt);

    //passe 1

    const filePath = path.join(process.cwd(), "src", "prompts", "MEPflashcard.md");
    const prompt = fs.readFileSync(filePath, "utf-8");
    const promptTxt = prompt.replace("{q}", q).replace("{r}", r);
    console.log(promptTxt)
    const p = await api(promptTxt);
    console.log("response", p);
    const json =  JSON.parse(p || "{}")
   


    return NextResponse.json({...json, ok : true});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
