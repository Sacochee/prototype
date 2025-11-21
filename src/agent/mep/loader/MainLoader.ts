import fs from "fs";
import api from "../utils/API";
import cleanResponse from "../utils/CleanReponse";
import path from "path";
import TokenCount from "../utils/TokenCount";

//TODO dev mode;
function logger(messages: any, json: any, name: string) {
  const data = `
  ## INPUT : 
  ${JSON.stringify(messages)}

  ## OUTPUT  : 
  ${JSON.stringify(json)}
  `;

  console.log(data);
  fs.writeFileSync(`${process.cwd()}/logger_${name}.md`, data, "utf8");
}

export default async function MainLoader(
  name: string,
  raw: string,
  token: TokenCount
) {
  if (raw == "") {
    console.log("pas de contenue pour" + name);
    return;
  }

  const pathSystem = path.join(
    process.cwd(),
    "src",
    "prompts",
    "AgentMep",
    name,
    "System.md"
  );
  const pathUser = path.join(
    process.cwd(),
    "src",
    "prompts",
    "AgentMep",
    name,
    "User.md"
  );

  const System = fs.readFileSync(pathSystem, "utf8");
  const User = (raw: string) =>
    fs.readFileSync(pathUser, "utf8").replace("{texte}", raw);

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

    const json = JSON.parse(cleanResponse(res || ""));

    logger(messages, json, name);

    token.addInput(messages);
    token.addOutput(res || "");
    return json;
  } catch (err) {
    console.log(err);

    //insert un fils de discution pour obliger un response en JSON. sans commentaires.
    return [];
  }
}
