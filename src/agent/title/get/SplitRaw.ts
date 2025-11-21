import { TitlePlanRequestRaw } from "@/types/plan/types";

const LIMIT_SIZE = 5_000;
export default function (raw: TitlePlanRequestRaw): TitlePlanRequestRaw[] {
  const finalList: any[][] = [];
  let len = 0;
  let listInWork: any[] = [];

  for (const item of raw) {
    //agrandir pour assumer le json to string
    if (item.text.length * 1.2 + len > LIMIT_SIZE) {
      finalList.push(listInWork);
      listInWork = [item.text];
      len = item.text.length * 1.2;
    } else {
      listInWork.push(item.text);
      len += item.text.length * 1.2;
    }
  }

  if (listInWork.length > 0) finalList.push(listInWork);

  return finalList;
}
