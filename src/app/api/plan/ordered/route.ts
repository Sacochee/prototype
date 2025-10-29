import fs from "fs";
import path from "path";
import api, { ResponseApi } from "../../API";
import { NextResponse } from "next/server";
import { MessageBuilderPlanclass } from "./MessageBuilder";
import cleanResponse from "../../CleanResponse";

type titles = [
  {
    text: string;
    id: string;
    lvl?: number;
  }
];

export async function POST(req: Request) {
  const { titles } = (await req.json()) as { titles: titles };

  const messages = MessageBuilderPlanclass(JSON.stringify(titles));

  try {
    const res = await ResponseApi(messages);
    console.log(res);
    const json = JSON.parse(cleanResponse(res || ""));

    return NextResponse.json({ status: "ok", res: json });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ status: "error", res: [] });
  }
}
