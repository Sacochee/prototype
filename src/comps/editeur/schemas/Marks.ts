import { DOMOutputSpec, MarkSpec } from "prosemirror-model";
import {
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_FONT_COLOR,
  DEFAUTL_FONT_FAMILY,
  DEFAUTL_FONT_SIZE,
} from "./DefautlsConst";
import { AddMark } from "./marks/temporary/markAdd";
import { DelMark } from "./marks/temporary/markDel";
import { EditMark } from "./marks/temporary/markEdit";

interface Imarks {
  /**
    A link. Has `href` and `title` attributes. `title`
    defaults to the empty string. Rendered and parsed as an `<a>`
    element.
    */
  link: MarkSpec;
  /**
    An emphasis mark. Rendered as an `<em>` element. Has parse rules
    that also match `<i>` and `font-style: italic`.
    */
  em: MarkSpec;
  /**
    A strong mark. Rendered as `<strong>`, parse rules also match
    `<b>` and `font-weight: bold`.
    */
  strong: MarkSpec;
  /**
    Code font mark. Represented as a `<code>` element.
    */
  code: MarkSpec;

  fontSize: MarkSpec;

  underline: MarkSpec;

  fontFamily: MarkSpec;

  fontColor: MarkSpec;

  backgroundColor: MarkSpec;

  addMark: MarkSpec;
  delMark: MarkSpec;
  editMark: MarkSpec;
}

// const emDOM = ["em", 0] as DOMOutputSpec,
//   strongDOM = ["strong", 0] as DOMOutputSpec,
//   codeDOM = ["code", 0] as DOMOutputSpec,
//   spanDom = ["span", 0] as DOMOutputSpec;

const marks: Imarks = {
  /**
    A link. Has `href` and `title` attributes. `title`
    defaults to the empty string. Rendered and parsed as an `<a>`
    element.
    */

  link: {
    attrs: {
      href: { validate: "string" },
      title: { default: null, validate: "string|null" },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: "a[href]",
        getAttrs(dom) {
          return {
            href: dom.getAttribute("href"),
            title: dom.getAttribute("title"),
          };
        },
      },
    ],
    toDOM(node) {
      let { href, title, id } = node.attrs;
      return ["a", { href, title }, 0];
    },
  },
  /**
    An emphasis mark. Rendered as an `<em>` element. Has parse rules
    that also match `<i>` and `font-style: italic`.
    */
  em: {
    parseDOM: [
      {
        tag: "i",
      },
      {
        tag: "em",
      },
      { style: "font-style=italic" },
      {
        style: "font-style=normal",
        clearMark: (m) => m.type.name == "em",
      },
    ],
    toDOM: () => ["em", 0],
  },
  /**
    A strong mark. Rendered as `<strong>`, parse rules also match
    `<b>` and `font-weight: bold`.
    */
  strong: {
    attrs: {
      fontWeight: { default: 800 },
    },
    parseDOM: [
      {
        tag: "strong",
      },
      {
        tag: "b",
        getAttrs: (node) => ({
          fontWeight: node.style.fontWeight != "normal" && null,
        }),
      },
      {
        style: "font-weight=400",
        clearMark: (m) => m.type.name == "strong",
      },
      {
        style: "font-weight",
        getAttrs: (value) => ({
          fontWeight: /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
        }),
      },
    ],
    toDOM: (node) => [
      "strong",
      {
        style: `font-weight: ${node.attrs.fontWeight}`,
      },
      0,
    ],
  },
  /**
    Code font mark. Represented as a `<code>` element.
    */
  code: {
    code: true,
    parseDOM: [
      {
        tag: "code",
      },
    ],
    toDOM: () => ["code", 0],
  },

  fontSize: {
    attrs: {
      fontSize: { default: DEFAUTL_FONT_SIZE },
    },
    parseDOM: [
      {
        style: "font-size",
        getAttrs: (value) => {
          const number = Number.parseInt(value.slice(0, -2));
          if (!Number.isNaN(number)) return { fontSize: value.slice(0, -2) };
          else return false;
        },
      },
    ],
    toDOM: (mark) => {
      return [
        "span",
        {
          style: `font-size: ${mark.attrs.fontSize}pt;`,
        },
        0,
      ] as DOMOutputSpec;
    },
  },

  /**
   * A vocation a disparaitre. une fois toous les styles gérés.
   */

  fontColor: {
    attrs: {
      fontColor: { default: DEFAULT_FONT_COLOR },
    },
    parseDOM: [
      {
        style: "color", getAttrs: (value) => ({ fontColor: value })
      },
    ],
    toDOM: (mark) =>
      [
        "span",
        { style: `color: ${mark.attrs.fontColor};` },
        0,
      ] as DOMOutputSpec,
  },

  backgroundColor: {
    attrs: {
      backgroundColor: { default: DEFAULT_BACKGROUND_COLOR },
    },
    parseDOM: [
      {
        style: "background-color",
        getAttrs: (value) => ({ backgroundColor: value }),
      },
    ],
    toDOM: (mark) =>
      [
        "span",
        mark.attrs.backgroundColor
          ? {
              style: `background-color: ${mark.attrs.backgroundColor};`,
            }
          : {},
        0,
      ] as DOMOutputSpec,
  },

  underline: {
    parseDOM: [
      { tag: "u" },
      { tag: "ins" },
      {
        style: "text-decoration=underline",
      },
    ],
    toDOM: (mark) => ["span", { style: "text-decoration: underline;" }, 0],
  },

  fontFamily: {
    attrs: {
      fontFamily: { default: DEFAUTL_FONT_FAMILY },
    },
    parseDOM: [
      {
        style: "font-family",
        getAttrs: (dom) => {
          const fontFamily = dom;
          return { fontFamily: fontFamily };
        },
      },
    ],
    toDOM: (mark) => [
      "span",
      {
        style: `font-family: ${mark.attrs.fontFamily};`,
      },
      0,
    ],
  },

  // Temporary Mark for editing texte
  addMark: AddMark,
  delMark: DelMark,
  editMark: EditMark,
};

export { marks };
