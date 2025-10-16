import { NodeSpec } from "prosemirror-model";
import toPt from "../ConvertStringToPt";
import { v4 as uuidV4 } from "uuid";

export interface listItemNode extends NodeSpec {
  attrs: {
    id: { default: string };
  };
}

export const listItem: listItemNode = {
  content: "paragraph block*",
  group: "list_item",
  attrs: {
    id: { default: '' },
  },
  parseDOM: [
    {
      tag: "li",
      getAttrs(node) {
        return {
          paddingLeft: toPt(node.style.paddingLeft),
          id: node.getAttribute("data-id") || uuidV4(),
        };
      },
    },
  ],
  toDOM(node) {
    return ["li", { "data-id": node.attrs.id }, 0];
  },
  defining: true,
};
