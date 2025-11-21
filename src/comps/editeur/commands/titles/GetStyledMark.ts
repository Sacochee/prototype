import { TitleStyleType } from "@/comps/store/store";
import { Mark, MarkSpec, Schema } from "prosemirror-model";

const marksUsed = [
  "strong",
  "em",
  "underline",
  "fontColor",
  "fontSize",
  "fontFamily",
  "backgroundColor",
];
export default function (
  style: TitleStyleType["style"],
  schema: Schema,
  _marks?: readonly Mark []
) {
  const marks = [];


  console.log(style)

  if (_marks && _marks.length > 0) {
    for (const mark of _marks) {
      if (!marksUsed.includes(mark.type.name)) {
        marks.push(mark);
      }
    }
  }

  if (!style) return _marks;

  if (style.bold) marks.push(schema.marks.strong.create());
  if (style.italic) marks.push(schema.marks.em.create());
  if (style.underline) marks.push(schema.marks.underline?.create?.());
  if (style.color)
    marks.push(schema.marks.fontColor?.create({ fontColor: style.color }));
  if (style.fontSize)
    marks.push(schema.marks.fontSize.create({ fontSize: style.fontSize }));
  if (style.police)
    marks.push(schema.marks.fontFamily.create({ fontFamily: style.police }));
  if (style.backgroundColor)
    marks.push(
      schema.marks.backgroundColor.create({
        backgroundColor: style.backgroundColor,
      })
    );
    console.log(marks, "marksss")
  return marks;
}
