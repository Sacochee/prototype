import { title } from "./route";

export default class {
  private chunkT: title[][] = [];

  constructor(titles: title[]) {
    let length = 0;
    let lst: title[] = [];

    for (const t of titles) {
      const l = t.id.length + t.titre.length;

      if (length + l > 9_000) {
        this.chunkT.push(lst);
        lst = [t];
        length = l;
      } else {
        length += l;
        lst.push(t);
      }
    }
  }

  get() {
    return this.chunkT;
  }
}
