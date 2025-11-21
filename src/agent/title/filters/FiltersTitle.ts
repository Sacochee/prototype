import { TitlePlanRequestRaw } from "@/types/plan/types";

export default function (raw: TitlePlanRequestRaw) {
  const lst: TitlePlanRequestRaw = [],
    title: TitlePlanRequestRaw = [];

  raw.forEach((item) => {
    if (item.title) title.push(item);
    else lst.push(item);
  });

  return {lst, title}
}
