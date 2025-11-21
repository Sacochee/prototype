import { NodeSpec } from "prosemirror-model";
import toPt from "../ConvertStringToPt";
import { v4 as uuidV4 } from "uuid";

export interface listItemNode extends NodeSpec {
  attrs: {
    id: { default: string };
  };
}

export const listItem: NodeSpec = {
  content: "paragraph block*",
  group: "list_item",
  attrs: {
    id: { default: "" },
    fontSize: { default: "11pt" },
    fontFamily: { default: "inherit" },
    // paddingBottom : {default }
  },
  parseDOM: [
    {
      tag: "li",
      getAttrs(node) {
        const fontSize = node.style.fontSize || "11pt";
        const fontFamily = node.style.fontFamily || "inherit";
        return {
          paddingLeft: toPt(node.style.paddingLeft),
          id: node.getAttribute("data-id") || uuidV4(),
          fontSize,
          fontFamily,
        };
      },
    },
  ],
  toDOM(node) {
    return [
      "li",
      {
        style: `font-size: ${node.attrs.fontSize}; font-family: ${node.attrs.fontFamily}`,
        "data-id": node.attrs.id,
      },
      0,
    ];
  },
  defining: true,
};
