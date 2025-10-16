import { NodeSpec } from "prosemirror-model";
import { DEFAULT_LI_PADDING_LEFT } from "../DefautlsConst";
import {v4 as uuidV4} from 'uuid'

export interface BulletListNode extends NodeSpec {
  attrs: {
    paddingLeft: { default: number };
    margin: { default: number };
    id : {default : string}
  };
}
export const BulletList: BulletListNode = {
  content: "list_item+",
  group: "block",
  attrs: {
    paddingLeft: { default: DEFAULT_LI_PADDING_LEFT },
    margin: { default: 0 },
    id : {default : ''}
  },
  parseDOM: [
    {
      tag: "ul",
       //TODO  add les styles
      getAttrs: (node)=>({id : node.getAttribute("data-id") || uuidV4()}),
    },
  
  ],
  toDOM(node) {
    return [
      "ul",
      {
        style: `
        padding-left:${node.attrs.paddingLeft}pt;
        margin : 0;`,
        "data-id" : node.attrs.id
      },
      0,
    ];
  },
};
