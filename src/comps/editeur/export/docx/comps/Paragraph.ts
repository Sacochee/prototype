import { Paragraph } from "docx";
import { Node } from "prosemirror-model";
import buildRuns from "./Run";

export default function (node: Node): Paragraph {
  return new Paragraph({ children: buildRuns(node?.children) });
}
