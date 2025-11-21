import { EditorState } from "prosemirror-state";

// === Constantes des nodes ===
const PARAGRAPH = "paragraph";
const HEADING = "heading";
const LIST_ITEM = "listItem";
const BULLET_LIST = "bulletList";
const ORDERED_LIST = "orderedList";

// === Types de listes ordonnées ===
const DECIMAL = "decimal";
const DECIMAL_LEADING_ZERO = "decimal-leading-zero";
const LOWER_ROMAN = "lower-roman";
const UPPER_ROMAN = "upper-roman";
const LOWER_GREEK = "lower-greek";
const LOWER_ALPHA = "lower-alpha";
const LOWER_LATIN = "lower-latin";
const UPPER_ALPHA = "upper-alpha";
const UPPER_LATIN = "upper-latin";

export default class {
  private result: {
    text: string;
    id: string | null;
    pos: number;
    title?: boolean;
  }[] = [];
  private pos = 0;

  constructor(doc: EditorState["doc"]) {
    // === Début du parcours ===
    this.walk(doc);
  }

  // === Parcours récursif ===
  walk(node: any, ancestors: any[] = []) {
    switch (node.type.name) {
      case PARAGRAPH:
        this.handleParagraph(node);
        break;
      case HEADING:
        this.handleHeading(node);
        break;
      case LIST_ITEM:
        this.handleListItem(node, ancestors);
        break;
      case BULLET_LIST:
      case ORDERED_LIST:
        this.handleList(node, ancestors);
        break;
      default:
        if (node.isText)
          this.result.push({
            text: node.text,
            id: null,
            pos: this.getNumber(),
          });
        // Si node a des enfants, on parcourt aussi
        if (node.content)
          node.content.forEach((child: any) => this.walk(child, ancestors));
        break;
    }
  }

  getLst() {
    return this.result;
  }

  handleParagraph(node: any) {
    this.result.push({
      text: node.textContent,
      id: node.attrs.id,
      pos: this.getNumber(),
    });
  }

  handleHeading(node: any) {
    const level = node.attrs.level || true;
    this.result.push({
      text: node.textContent,
      pos: this.getNumber(),
      id: node.attrs.id,
      title: level,
    });
  }

  handleListItem(node: any, ancestors: any[]) {
    const parent = ancestors[ancestors.length - 1];
    const depth =
      ancestors.filter(
        (a) => a.type.name === BULLET_LIST || a.type.name === ORDERED_LIST
      ).length - 1;
    const indent = "  ".repeat(Math.max(depth, 0));

    let prefix = "-";
    if (parent?.type.name === ORDERED_LIST) {
      const index = (parent.attrs.order || 1) - 1;
      const orderType = parent.attrs?.type || DECIMAL;
      prefix = this.getListPrefix(orderType, index);
    }

    let firstLine = true;
    node.content?.forEach((child: any) => {
      if (firstLine) {
        if (child.type.name === PARAGRAPH) {
          this.result.push({
            text: `${indent}${prefix} ${child.textContent}`,
            id: node.attrs.id,
            pos: this.getNumber(),
          });
        } else {
          this.walk(child, [...ancestors, node]);
        }
        firstLine = false;
      } else {
        this.walk(child, [...ancestors, node]);
      }
    });
  }

  handleList(node: any, ancestors: any[]) {
    node.content?.forEach((child: any) =>
      this.walk(child, [...ancestors, node])
    );
  }

  getListPrefix(orderType: string, index: number): string {
    switch (orderType) {
      case DECIMAL:
        return `${index + 1}.`;
      case DECIMAL_LEADING_ZERO:
        return `${String(index + 1).padStart(2, "0")}.`;
      case LOWER_ROMAN:
        return this.toRoman(index + 1).toLowerCase() + ".";
      case UPPER_ROMAN:
        return this.toRoman(index + 1).toUpperCase() + ".";
      case LOWER_GREEK:
        return this.toGreek(index) + ".";
      case LOWER_ALPHA:
      case LOWER_LATIN:
        return String.fromCharCode(97 + index) + ".";
      case UPPER_ALPHA:
      case UPPER_LATIN:
        return String.fromCharCode(65 + index) + ".";
      default:
        return `${index + 1}.`;
    }
  }

  getNumber() {
    let num = this.pos;
    this.pos += 1;
    return num;
  }

  // === Utilitaires ===
  toRoman(num: number) {
    const romans: [string, number][] = [
      ["M", 1000],
      ["CM", 900],
      ["D", 500],
      ["CD", 400],
      ["C", 100],
      ["XC", 90],
      ["L", 50],
      ["XL", 40],
      ["X", 10],
      ["IX", 9],
      ["V", 5],
      ["IV", 4],
      ["I", 1],
    ];
    let res = "";
    for (const [sym, val] of romans) {
      while (num >= val) {
        res += sym;
        num -= val;
      }
    }
    return res;
  }

  toGreek(index: number) {
    const greek = [
      "α",
      "β",
      "γ",
      "δ",
      "ε",
      "ζ",
      "η",
      "θ",
      "ι",
      "κ",
      "λ",
      "μ",
      "ν",
      "ξ",
      "ο",
      "π",
      "ρ",
      "σ",
      "τ",
      "υ",
      "φ",
      "χ",
      "ψ",
      "ω",
    ];
    return greek[index % greek.length];
  }
}
