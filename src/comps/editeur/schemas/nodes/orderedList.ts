import { DOMOutputSpec, NodeSpec } from "prosemirror-model";
import { DEFAULT_LI_PADDING_LEFT } from "../DefautlsConst";
import toPt from "../ConvertStringToPt";
import { v4 as uuidV4 } from "uuid";

export interface OrderedListNode extends NodeSpec {
  attrs: {
    paddingLeft: { default: number };
    order: { default: number; validate: "number" };
    id: { default: string };
  };
}

export const OrderedList: OrderedListNode = {
  content: "list_item+",
  group: "block",
  attrs: {
    order: { default: 1, validate: "number" },
    paddingLeft: { default: DEFAULT_LI_PADDING_LEFT },
    id: { default: '' },
  },
  parseDOM: [
    {
      tag: "ol",
      getAttrs(dom) {
        return {
          paddingLeft: toPt(dom.style.paddingLeft),
          order: (dom as HTMLOListElement).start,
          id: dom.getAttribute("data-id") || uuidV4(),
        };
      },
    },
    { tag: "ol" },
  ],
  toDOM(node) {
    return [
      "ol",
      {
        start: node.attrs.order,
        style: `
        padding-left: ${node.attrs.paddingLeft}pt;
        margin : 0;
        `,
        "data-id": node.attrs.id,
      },
      0,
    ] as DOMOutputSpec;
  },
};
