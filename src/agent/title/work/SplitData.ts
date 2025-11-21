import { PlanTitle, TitlePlanRequestRaw } from "@/types/plan/types";
import { M_PLUS_2 } from "next/font/google";

const LIMIT_SIZE = 2_000;
export default function (raw: PlanTitle[]): PlanTitle[][] {
  const finalList: any[][] = [];
  let len = 0;
  let listInWork: any[] = [];

  for (const item of raw) {
    //agrandir pour assumer le json to string
    if ((item.titre.length * 1.2) + len > LIMIT_SIZE) {
      finalList.push(listInWork);
      listInWork = [item.titre];
      len = (item.titre.length * 1.2)
    } else {
      listInWork.push(item.titre);
      len += (item.titre.length * 1.2)
    }

    console.log(len, "len")
  }

  if (listInWork.length > 0) finalList.push(listInWork);

  return finalList;
}
