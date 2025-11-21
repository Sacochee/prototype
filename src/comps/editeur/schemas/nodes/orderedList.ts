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

/**
1	Default. Decimal numbers (1, 2, 3, 4)
a	Alphabetically ordered list, lowercase (a, b, c, d)
A	Alphabetically ordered list, uppercase (A, B, C, D)
i	Roman numbers, lowercase (i, ii, iii, iv)
I	Roman numbers, uppercase (I, II, III, IV)
 */
export const OrderedList: NodeSpec = {
  content: "list_item+",
  group: "block",
  attrs: {
    order: { default: 1, validate: "number" },
    paddingLeft: { default: DEFAULT_LI_PADDING_LEFT },
    id: { default: "" },
    type: { default: "decimal" },
  },
  parseDOM: [
    {
      tag: "ol",
      getAttrs(dom) {
        const paddingL = toPt(dom.style.paddingLeft) || 0;

        let type = dom.style.listStyleType;
        if (!type && dom.getAttribute("type"))
          type = TypeToTypeCss(dom.getAttribute("type")!);
   
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
      "ol",
      {
        start: node.attrs.order,
        style: `
        padding-left: ${node.attrs.paddingLeft}pt;
        margin : 0;
        list-style-type: ${node.attrs.type};`,
        "data-id": node.attrs.id,
      },
      0,
    ] as DOMOutputSpec;
  },
};

function TypeToTypeCss(type: string): string {
  switch (type) {
    case "1":
      return "decimal";
    case "a":
      return "lower-alpha";
    case "A":
      return "upper-alpha";
    case "i":
      return "lower-roman";
    case "I":
      return "upper-roman";
    default:
      return "decimal";
  }
}
