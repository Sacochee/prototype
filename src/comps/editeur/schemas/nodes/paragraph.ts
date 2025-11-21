import { DOMOutputSpec, NodeSpec } from "prosemirror-model";
import {
  DEFAULT_LINE_HIGHT,
  DEFAULT_PADDING_BOTTOM,
  DEFAULT_PADDING_LEFT,
  DEFAULT_PADDING_RIGHT,
  DEFAULT_PADDING_TOP,
  DEFAULT_TEXT_ALIGN,
  DEFAULT_TEXT_INDENTE,
} from "../DefautlsConst";
import { enumTextAlign } from "../../commands/AlignText";
import toPt from "../ConvertStringToPt";
import { v4 as uuidV4 } from "uuid";

export interface ParagraphNode extends NodeSpec {
  attrs: {
    textAlign: { default: enumTextAlign };
    paddingTop: { default: number };
    paddingBottom: { default: number };
    paddingLeft: { default: number };
    paddingRight: { default: number };
    lineHeight: { default: number };
    textIndente: { default: number };
    id: { default: string; validate: any };
  };
}

export const Paragraph: ParagraphNode = {
  group: "block",
  content: "inline*",

  attrs: {
    textAlign: { default: DEFAULT_TEXT_ALIGN },
    paddingTop: { default: DEFAULT_PADDING_TOP },
    paddingBottom: { default: DEFAULT_PADDING_BOTTOM },
    textIndente: { default: DEFAULT_TEXT_INDENTE },
    lineHeight: { default: DEFAULT_LINE_HIGHT },
    paddingLeft: { default: DEFAULT_PADDING_LEFT },
    paddingRight: { default: DEFAULT_PADDING_RIGHT },
    id: {
      default: "",
      validate: (id: any) => {
        if (!id || id == "") throw new Error("pas d'id....");
      },
    },
  },
  parseDOM: [
    {
      tag: "p",
      getAttrs: (dom) => {
        let attrs = {};

        const id = dom.getAttribute("data-id");
        if (id && id.trim().length > 0) {
          Object.assign(attrs, {
            id,
          });
        } else {
          Object.assign(attrs, {
            id: uuidV4(),
          });
        }

        const textAlign = dom.style.textAlign;
        if (textAlign) {
          Object.assign(attrs, {
            textAlign,
          });
        }

        const lineHeight = dom.style.lineHeight;
        if (lineHeight)
          Object.assign(attrs, {
            lineHeight,
          });

        const padding = dom.style.padding;
        if (padding)
          Object.assign(attrs, {
            paddingTop: toPt(padding),
            paddingBottom: toPt(padding),
          });

        const paddingTop = dom.style.paddingTop;
        if (paddingTop)
          Object.assign(attrs, {
            paddingTop: toPt(paddingTop),
          });

        const marginBottom = dom.style.marginBottom;
        if (marginBottom)

          Object.assign(attrs, {
            paddingBottom: toPt(marginBottom),
          });

        if (attrs) return attrs;
        else return { id: uuidV4() };
      },
    },
  ],
  toDOM: (node) => {
   
    return [
      "p",
      {
        style: `
          text-align:${node.attrs.textAlign};
          line-height: ${node.attrs.lineHeight};
          padding-bottom: ${node.attrs.paddingBottom}pt;
          padding-top: ${node.attrs.paddingTop}pt;
          padding-left: ${node.attrs.paddingLeft}pt;
          padding-right: ${node.attrs.paddingRight}pt;
          margin: 0;
          `,
        "data-id": node.attrs.id,
      },
      0,
    ] as DOMOutputSpec;
  },
};
