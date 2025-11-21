import { TextRun } from "docx";
import { Mark, Node } from "prosemirror-model";
import { cssColorToHex } from "./utils";

export default function buildRuns(
  content: readonly Node[] = [],
  title?: boolean
): TextRun[] {
  if (!content) return [];
  const runs: TextRun[] = [];

  content.forEach((child) => {
    if (child.type.name === "text") {
      const options: any = { text: child.text };
      child.marks?.forEach((m: Mark) => {
        if (m.type.name === "strong") options.bold = true;
        if (m.type.name === "italic") options.italics = true;
        if (m.type.name === "underline") options.underline = {};
        if (m.type.name === "fontColor")
          options.color = cssColorToHex(m.attrs.fontColor);

        if (title) options.color = "FF0000";
      });
      runs.push(new TextRun(options));
    } else if (child.type.name === "hard_break") {
      console.log(child.type.name, "depuis le if");
      runs.push(new TextRun({ text: "", break: 1 }));
    } else if (child.content) {
      runs.push(...buildRuns(child?.children, title));
    } else console.log(child.type.name);
  });

  return runs;
}
