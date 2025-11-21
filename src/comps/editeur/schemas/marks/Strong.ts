import { MarkSpec } from "prosemirror-model";

export const StrongMark: MarkSpec = {
  attrs: {
    fontWeight: { default: 800 },
  },
  parseDOM: [
    {
      tag: "strong",
    },
    {
      tag: "b",
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
    "span",
    {
      style: `font-weight: ${node.attrs.fontWeight}`,
    },
    0,
  ],
};
