import { PlanTitle } from "@/types/plan/types";
import WorkTitles from "./work/WorkTitles";
import TokenCount from "../mep/utils/TokenCount";
import SplitData from "./work/SplitData";
import { hasUncaughtExceptionCaptureCallback } from "process";

export default async function (
  lst: PlanTitle[],
  token: TokenCount
): Promise<PlanTitle[]> {
  async function tryRun(item: any, attempt = 1): Promise<any> {
    try {
      const res = await WorkTitles(item, token);
      return JSON.parse(JSON.stringify(res)); // force JSON structure
    } catch (err) {
      if (attempt < 3) {
        console.warn(`Retry ${attempt} for item`, err);
        return tryRun(item, attempt + 1);
      } else {
        console.error("Skip item after 3 fails:", err);
        return null; // skip après 3 échecs
      }
    }
  }


  const chunks = SplitData(lst)

  console.log(chunks.length)
  console.log("length")
  chunks.forEach(item => console.log(item.length))

  let finalList: any[] = [];

  for (const chunk of chunks) {
    if (finalList.length > 0) {
      const { remaining, removed } = splitLast20OrAll(finalList);

      const res = await tryRun([...removed, ...chunk]);

      finalList = [...remaining, ...res];
      // add all to finalalsit
    } else {
      const res = await tryRun(chunk);

      finalList = res;

      // add all to finalalsit
    }
  }

  const Liste: PlanTitle[] = [];
  for (const t of finalList) {
    const oldItem = lst.find((item) => item.titre == t.text);
    Liste.push({
      id: oldItem?.id || "",
      titre: t.text,
      level: t.level,
    });
  }

  return Liste;
}

function splitLast20OrAll<T>(list: T[]): { remaining: T[]; removed: T[] } {
  if (!Array.isArray(list)) return { remaining: [], removed: [] };

  const count = list.length;

  if (count <= 20) {
    // Si 20 éléments ou moins, tout est retiré
    return { remaining: [], removed: [...list] };
  } else {
    // Sinon, on garde tout sauf les 20 derniers
    const removed = list.slice(count - 20);
    const remaining = list.slice(0, count - 20);
    return { remaining, removed };
  }
}
