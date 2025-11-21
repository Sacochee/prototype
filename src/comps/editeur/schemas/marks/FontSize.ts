import { DOMOutputSpec, MarkSpec } from "prosemirror-model";
import { DEFAUTL_FONT_SIZE } from "../DefautlsConst";
import DevShowTypeName from "../DevShowTypeName";

export const FontSizeMark: MarkSpec = {
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
    }
  ],
  toDOM: (mark) => {
    return [
      "span",
      
        DevShowTypeName(
          { style: `font-size: ${mark.attrs.fontSize}pt;` },
          mark.type.name
        ),
      
      0,
    ] as DOMOutputSpec;
  },
};
