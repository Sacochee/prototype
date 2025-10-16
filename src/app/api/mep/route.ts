import { NextResponse } from "next/server";
import Together from "together-ai";
import fs from "fs";
import path from "path";
import api from "../API";
import { RulePrompt } from "@/comps/ToolSection/mep/Context";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  function buildString(rule: RulePrompt): string {
    return `<description>
      ${rule.desc}
      </description>
      <règle_mise_en_forme>
      ${rule.miseEnForme}
      </règle_mise_en_forme>
      <exemples>
      ${rule.exemple.map(
        (item) => `
        <exemple>
          <input>
          ${item.input}
          </input>
          <output>
          ${item.output}
          </output>
        </exemple>
        `
      )}
      </exemples>`;
  }

  try {
    const body = await req.json();
    const { raw, prompt } = body as { raw: string; prompt: RulePrompt[] };
    const filePath = path.join(
      process.cwd(),
      "src",
      "prompts",
      "MEPTemplatePrompt.md"
    );
    const promptTemplate = fs.readFileSync(filePath, "utf8");

    const promptApi = promptTemplate
      .replace("{prompt}", prompt.map((item) => buildString(item)).join("\n"))
      .replace("{texte}", raw);
    console.log(promptApi);

    const res = await api(promptApi);

    return NextResponse.json({ res: res });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

/**
 * 
 *    <transformation type="definitions">
    <description>
      Détecter les phrases contenant une définition sous les formes suivantes :
      - "{mot} est ..."  
      - "Une {mot} est ..."  
      - "On appelle {mot} ..."  
    </description>
    <règle_mise_en_forme>
      mettre le mot défini en rouge.
      Mettre le texte de la définition (hors mot) en gras.
    </règle_mise_en_forme>
    <exemple>
      Entrée : "Une base de données est un ensemble organisé d'informations."
      Sortie : "<p><span style='color: rgb(255, 0, 0);'>base de données</span> est <b>un ensemble organisé d'informations.</b></p>"
    </exemple>
  </transformation>
 */
