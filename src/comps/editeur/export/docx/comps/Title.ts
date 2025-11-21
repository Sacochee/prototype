import { HeadingLevel, Paragraph } from "docx";
import { Node } from "prosemirror-model";
import buildRuns from "./Run";

export default function (node: Node): Paragraph {
  console.log(node.attrs);
  return new Paragraph({
    heading: mapHeadingLevel(node.attrs?.level),
    children: buildRuns(node?.children, true),
    //margin ?
    spacing: {
      before: node.attrs.paddingTop * 20 || 0,
      after: node.attrs.paddingBottom * 20 || 0,
    },
  });
}

function mapHeadingLevel(level: number = 1) {
  switch (level) {
    case 1:
      return HeadingLevel.HEADING_1;
    case 2:
      return HeadingLevel.HEADING_2;
    case 3:
      return HeadingLevel.HEADING_3;
    case 4:
      return HeadingLevel.HEADING_4;
    case 5:
      return HeadingLevel.HEADING_5;
    case 6:
      return HeadingLevel.HEADING_6;
    default:
      return HeadingLevel.HEADING_6;
  }
}
