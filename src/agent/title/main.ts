// plan Agent

import { TitlePlanRequestRaw } from "@/types/plan/types";
import filtersTitle from "./filters/FiltersTitle";
import FilterSize from "./filters/FilterSize";
import TitreGestionaire from "./TitreGestionaire";
import TokenCount from "../mep/utils/TokenCount";
import PoolRequest from "./PoolRequest";
import GetTitle from "./get/GetTitle";
import SplitRaw from "./get/SplitRaw";
import ClassTitle from "./ClassTitle";
import { Hurricane } from "next/font/google";

export default async function (raw: TitlePlanRequestRaw) {

  const { lst, title } = filtersTitle(FilterSize(raw));
  const TitreGestion = new TitreGestionaire(title);
  const tokenGestion = new TokenCount();

  //similation
  const chunk = SplitRaw(lst);

  console.log(chunk.length)

  const res = await PoolRequest(GetTitle, chunk, tokenGestion);

  for (const liste of res) {
    const lstData = [];

    //récupérer toutes les données initals
    for (const item of liste) {
      const oldItem = lst.find((i) => i.text === item);
      oldItem && lstData.push(oldItem);
    }

    TitreGestion.add(lstData);
  }

  const finallst = TitreGestion.getTitle();

  const titlesClass = await ClassTitle(finallst, tokenGestion);
  


  return titlesClass
  /**
   * TODO  (le loup)
   * 1. fair eles promtps
   * 2. faire les fnc pour appliquer les prompts
   * 3. détermier la size du chunk
   * 4. faire le pool dynamique avec les fncs et les chunks
   *
   *
   * // hiarhcei
   */

  //split raw en chunk.

  //faire un pipeline avec pool

  //Refaire les foramt non conforme.

  //passer a lhairchi
}
