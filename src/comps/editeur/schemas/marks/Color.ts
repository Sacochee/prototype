import { DOMOutputSpec, MarkSpec } from "prosemirror-model";
import { DEFAULT_FONT_COLOR } from "../DefautlsConst";
import DevShowTypeName from "../DevShowTypeName";

export const FontColorMark: MarkSpec = {
  attrs: {
    fontColor: { default: DEFAULT_FONT_COLOR },
  },
  parseDOM: [
    {
      style: "color",
      getAttrs: (value) => {
        return { fontColor: value };
      },
    },
    {
      tag: "font[color]",
      getAttrs(dom) {
        // Priorité : attribut color
        const colorAttr = dom.getAttribute("color");
        return colorAttr ? { fontColor: colorAttr } : false;
      },
    },
  ],
  toDOM: (mark) => {
    return [
      "span",
      DevShowTypeName(
        { style: `color: ${mark.attrs.fontColor};` },
        mark.type.name
      ),
      0,
    ] as DOMOutputSpec;
  },
};
