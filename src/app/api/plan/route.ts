import fs from "fs";
import path from "path";
import api, { ResponseApi } from "../API";
import { MessageBuilderPlan } from "./MessageBuilder";
import { NextResponse } from "next/server";
import cleanResponse from "../CleanResponse";

export async function POST(req: Request) {
  const { chunk } = await req.json();

  let message = MessageBuilderPlan(chunk);

  try {
    const res = await ResponseApi(message);
    console.log(res);
    const json = JSON.parse(cleanResponse(res || ""));

    return NextResponse.json({ status: "ok", titles: json });
  } catch (err) {
    //faire le fils de discution.
    console.error(err);
    return NextResponse.json({ status: "ok", error: true, titles: [] });
  }

  //2. check et si faux faire un fils de discution et
  //3. faire sur passage critque afin d'amélreore la précison pour autant je ne sias pas avec quoi coriser pour avoir un meiileur rendu.
}
