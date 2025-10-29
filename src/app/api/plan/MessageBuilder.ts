import fs from "fs";
import path from "path";

export function MessageBuilderPlan(raw: string): any[] {
  const systemPath = path.join(
    process.cwd(),
    "src",
    "prompts",
    "plan",
    "get",
    "System.md"
  );
  const userPath = path.join(
    process.cwd(),
    "src",
    "prompts",
    "plan",
    "get",
    "User.md"
  );
  return [
    {
      role: "system",
      content: fs.readFileSync(systemPath, "utf8"),
    },
    {
      role: "user",
      content: fs.readFileSync(userPath, "utf8").replace("{texte}", raw),
    },
  ];
}
