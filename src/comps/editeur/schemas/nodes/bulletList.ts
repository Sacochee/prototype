import { NodeSpec } from "prosemirror-model";
import { DEFAULT_LI_PADDING_LEFT } from "../DefautlsConst";
import { v4 as uuidV4 } from "uuid";
import toPt from "../ConvertStringToPt";

export interface BulletListNode extends NodeSpec {
  attrs: {
    paddingLeft: { default: number };
    margin: { default: number };
    id: { default: string };
  };
}
export const BulletList: NodeSpec = {
  content: "list_item+",
  group: "block",
  attrs: {
    paddingLeft: { default: DEFAULT_LI_PADDING_LEFT },
    margin: { default: 0 },
    id: { default: "" },
    type: { default: "disc" },
  },
  parseDOM: [
    {
      tag: "ul",
      getAttrs(dom) {
  
        const paddingL = toPt(dom.style.paddingLeft) || 0;
        const type = dom.style.listStyleType || "disc";
        return {
          paddingLeft: paddingL > 30 ? paddingL : DEFAULT_LI_PADDING_LEFT,
          order: (dom as HTMLOListElement).start,
          id: dom.getAttribute("data-id") || uuidV4(),
          type: type,
        };
      },
    },
  ],
  toDOM(node) {
    return [
      "ul",
      {
        style: `
        padding-left:${node.attrs.paddingLeft}pt;
        margin : 0;
        list-style-type: ${node.attrs.type};`,
        "data-id": node.attrs.id,
      },
      0,
    ];
  },
};
