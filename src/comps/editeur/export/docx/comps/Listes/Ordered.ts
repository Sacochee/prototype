import { Node } from "prosemirror-model";
import { Paragraph } from "docx";

export default function (node: Node) {
  const type = node.attrs.type;

  return new Paragraph({
    children: [],
    numbering: {
      reference: type,
      level: 0,
    },
  });
}
