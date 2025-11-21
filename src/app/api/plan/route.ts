import { NextResponse } from "next/server";
import AgentPlan from "@/agent/title/main";

export async function POST(req: Request) {
  const { raw } = await req.json();

  const res = await AgentPlan(raw);

  return NextResponse.json({ ok: "ok", titles : res });

  //2. check et si faux faire un fils de discution et
  //3. faire sur passage critque afin d'amélreore la précison pour autant je ne sias pas avec quoi coriser pour avoir un meiileur rendu.
}
