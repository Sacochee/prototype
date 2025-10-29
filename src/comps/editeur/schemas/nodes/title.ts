import { NodeSpec } from "prosemirror-model";
import {
  DEFAULT_LINE_HIGHT,
  DEFAULT_PADDING_BOTTOM,
  DEFAULT_PADDING_LEFT,
  DEFAULT_PADDING_RIGHT,
  DEFAULT_PADDING_TOP,
  DEFAULT_TEXT_ALIGN,
  DEFAULT_TEXT_INDENTE,
} from "../DefautlsConst";
import toPt from "../ConvertStringToPt";
import { v4 as uuidV4 } from "uuid";

const getattrs = (dom: any) => {
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

  const paddingBottom = dom.style.paddingBottom;
  if (paddingBottom)
    Object.assign(attrs, {
      paddingBottom: toPt(paddingBottom),
    });

  if (attrs) return attrs;
  else return { id: uuidV4() };
};

export const NodeHeading: NodeSpec = {
  attrs: {
    level: { default: 1, validate: "number" },
    id: { default: "" },
    textAlign: { default: DEFAULT_TEXT_ALIGN },
    paddingTop: { default: DEFAULT_PADDING_TOP },
    paddingBottom: { default: 20 },
    textIndente: { default: DEFAULT_TEXT_INDENTE },
    lineHeight: { default: DEFAULT_LINE_HIGHT },
    paddingLeft: { default: DEFAULT_PADDING_LEFT },
    paddingRight: { default: DEFAULT_PADDING_RIGHT },
  },
  content: "inline*",
  group: "block",
  defining: true,
  parseDOM: [
    { tag: "h1", attrs: { level: 1 }, getAttrs: getattrs },
    { tag: "h2", attrs: { level: 2 }, getAttrs: getattrs },
    { tag: "h3", attrs: { level: 3 }, getAttrs: getattrs },
    { tag: "h4", attrs: { level: 4 }, getAttrs: getattrs },
    { tag: "h5", attrs: { level: 5 }, getAttrs: getattrs },
    { tag: "h6", attrs: { level: 6 }, getAttrs: getattrs },
  ],
  toDOM(node) {
    return [
      "h" + (node.attrs.level > 6 ? 6 : node.attrs.level),
      {
        style: `
          text-align:${node.attrs.textAlign};
          line-height: ${node.attrs.lineHeight};
          padding-bottom: ${node.attrs.paddingBottom}pt;
          padding-top: ${node.attrs.paddingTop}pt;
          padding-left: ${node.attrs.paddingLeft}pt;
          padding-right: ${node.attrs.paddingRight}pt;
          margin: 0;
          color:red!important;
          font-size:20pt!important;
          `,
        "data-id": node.attrs.id,
      },
      0,
    ];
  },
};
