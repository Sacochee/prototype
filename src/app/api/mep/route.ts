import { NextResponse } from "next/server";
import Together from "together-ai";
import fs from "fs";
import path from "path";
import api from "../API";
import { RulePrompt } from "@/comps/ToolSection/mep/Context";
import AgentIaMiseEnPage from "@/agent/mep/main";

//TODO agents // transformer html en md
// Mistral Agent. // GIT, devops.
// junior entreprise
// observabilité grafana
// faire power point arhci drive.

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { raw } = body as { raw: string; prompt: RulePrompt[] };

    const res = await AgentIaMiseEnPage(raw);
    //DEV check
    // return NextResponse.json({ res: raw });
    return NextResponse.json(res);
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
