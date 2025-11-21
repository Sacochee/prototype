import { EditorView } from "prosemirror-view";
import { TitleProps } from "@/types/plan/types";
import { getNodeById } from "../../../ToolSection/GenPlan/Utils";
import { TitleStyleType } from "@/comps/store/store";
import { Node } from "prosemirror-model";
import GetTopNodeOfId from "../../../ToolSection/GenPlan/GetTopNodeOfId";

export default function (
  view: EditorView,
  titles: TitleProps["titles"],
  TitleStyleType: TitleStyleType[]
) {
  const { state, dispatch } = view;
  let { tr, schema } = state;

  let currentDoc = state.doc;

  for (const title of titles) {
    let res = GetTopNodeOfId(currentDoc, title.id);
    if (!res) continue;
    const { node, pos } = res;
    if (!node || pos == null) continue;

    // 1. Construire le contenu textuel avec marks selon le style
    const marks = [];
    const style = TitleStyleType.find(
      (item) => item.target === title.level
    )?.style;

    if (!style) continue;

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

    const textNode = schema.text(title.titre || "", marks);

    // 2. Construire le nouveau heading
    const newNode = schema.nodes.heading.create(
      { level: title.level || 6, id: (node as Node).attrs.id },
      textNode
    );

    // 3. Remplacer le nœud
    tr = tr.replaceWith(pos, pos + (node as Node).nodeSize, newNode);
    currentDoc = tr.doc;
  }

  if (tr.docChanged) dispatch(tr);
}
