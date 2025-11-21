import { PlanTitle, TitlePlanRequestRaw } from "@/types/plan/types";

export default class {
  private titre: TitlePlanRequestRaw = [];
  constructor(title: TitlePlanRequestRaw) {
    //init avec les deja ttire

    for (const item of title) {
      if (item.title) {
        this.titre.push(item);
      }
    }
  }

  add(items: TitlePlanRequestRaw) {
    for(const item of items){
      this.titre.push(item)
    }
  }

  getTitle(): PlanTitle[] {
    // trie juste avant de renvoyer
    const sorted = [...this.titre].sort((a, b) => {
      const pa = typeof a.pos === "number" ? a.pos : 0;
      const pb = typeof b.pos === "number" ? b.pos : 0;
      return pa - pb;
    });

    return sorted.map((item) => {
      if (item.title)
        return {
          titre: item.text,
          id: item.id || "",
          level: typeof item.title === "number" ? item.title : 0,
        };
      return { titre: item.text, id: item.id || "" };
    });
  }
}
