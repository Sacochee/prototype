export default class {
  private dictionnaire: Record<string, string> = {};
  private lastName = "";
  private element;

  constructor(string: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(string, "text/html");
    this.element = doc.body;
    this.CompressHtml(this.element);
  }

  get() {
    return { html: this.element.innerHTML, dictionnaire: this.dictionnaire };
  }

  private async CompressHtml(el: HTMLElement) {
  // sélecteur universel = tous les éléments descendants
  const all = [el, ...el.querySelectorAll<HTMLElement>("*")];

  for (const node of all) {
    for (const attrName of ["data-id", "class"]) {
      const val = node.getAttribute(attrName);
      if (!val) continue;

      let name = this.getKeyByValue(val);
      if (!name) {
        name = this.incrementName();
        this.dictionnaire[name] = val;
      }
      node.setAttribute(attrName, name);
    }
  }

  return true;
}


  private getKeyByValue(value: string): string | undefined {
    const entry = Object.entries(this.dictionnaire).find(
      ([_, v]) => v === value
    );
    return entry?.[0]; // retourne la clé ou undefined si non trouvé
  }

  private incrementName(): string {
    const newName = this.buildNewName();

    this.lastName = newName;

    return newName;
  }

  private buildNewName(): string {
    if (!this.lastName) return "a";

    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let nameArr = this.lastName.split("");
    let i = nameArr.length - 1;

    while (i >= 0) {
      const index = chars.indexOf(nameArr[i]);
      if (index < chars.length - 1) {
        // incrémente la lettre
        nameArr[i] = chars[index + 1];
        return nameArr.join("");
      } else {
        // si on arrive à 'z', on remet à 'a' et on carry
        nameArr[i] = "a";
        i--;
      }
    }

    // Si toutes les lettres étaient 'z', on ajoute un 'a' devant
    return "a" + nameArr.join("");
  }
}
