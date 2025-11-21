import fs from "fs";
import api from "@/agent/mep/utils/API";
import cleanResponse from "@/agent/mep/utils/CleanReponse";
import path from "path";
import TokenCount from "@/agent/mep/utils/TokenCount";

//TODO dev mode;
function logger(messages: any, json: any, name: string) {
  const data = `
  ## INPUT : 
  ${JSON.stringify(messages)}

  ## OUTPUT  : 
  ${JSON.stringify(json)}
  `;

  fs.writeFileSync(`${process.cwd()}/logger_${name}.md`, data, "utf8");
}

export default async function (raw: string[], token: TokenCount) {
  if (raw.length <= 0) {
    console.log("pas de contenue pour");
    return;
  }

  const pathSystem = path.join(
    process.cwd(),
    "src",
    "prompts",
    "AgentPlan",
    "work",
    "System.md"
  );
  const pathUser = path.join(
    process.cwd(),
    "src",
    "prompts",
    "AgentPlan",
    "work",
    "User.md"
  );

  const System = fs.readFileSync(pathSystem, "utf8");
  const User = (raw: string[]) =>
    fs.readFileSync(pathUser, "utf8").replace("{texte}", JSON.stringify(raw));

  const messages = [
    {
      role: "system",
      content: System,
    },
    {
      role: "user",
      content: User(raw),
    },
  ];
  //insert a logger.
  try {
    const res = await api(messages as any);
    console.log(res)
    const json = JSON.parse(cleanResponse(res || ""));

    logger(messages, json, "work PLAN");

    token.addInput(messages);
    token.addOutput(res || "");
    return json;
  } catch (err) {
    console.log(err);



    //insert un fils de discution pour obliger un response en JSON. sans commentaires.
    return [];
  }
}
