import { MarkSpec } from "prosemirror-model";
import { DEFAUTL_FONT_FAMILY } from "../DefautlsConst";
import DevShowTypeName from "../DevShowTypeName";

export const FontFamilyMark: MarkSpec = {
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
    {
      tag: "font[face]",
      getAttrs: (node) => {
        const fontFamily = (node as HTMLElement).getAttribute("face");
        return fontFamily ? { fontFamily: fontFamily } : false;
      },
    },
  ],
  toDOM: (mark) => [
    "span",
    DevShowTypeName(
      {
        style: `font-family: ${mark.attrs.fontFamily};`,
      },
      mark.type.name
    ),
    0,
  ],
};
