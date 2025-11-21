import { NextResponse } from "next/server";
import { PlanTitle, TitlePlanRequestRaw } from "@/types/plan/types";
import ClassTitle from "@/agent/title/ClassTitle";
import TokenCount from "@/agent/mep/utils/TokenCount";

export async function POST(req: Request) {
  const { titles } = (await req.json()) as { titles: PlanTitle[] };
  const finalTitles = titles.map((item) => ({ ...item, lvl: 0 }));
  const Token = new TokenCount();

  try {
    const res = await ClassTitle(finalTitles, Token);

    return NextResponse.json({ ok: true, res });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", res: [] });
  }
}
