import { MarkSpec } from "prosemirror-model";

export const EditMark: MarkSpec = {
  attrs: {
    oldHtml: { default: null },
  },
  parseDOM: [
    {
      tag: "edit",
      getAttrs(node) {
        return { oldHtml: node.getAttribute("data-oldHtml") || "" };
      },
    },
    {
      tag: "span[class=edit]",
      getAttrs(node) {
        return { oldHtml: node.getAttribute("data-oldHtml") || "" };
      },
    },
  ],
  toDOM: () => ["span", { class: "edit" }, 0],
};
