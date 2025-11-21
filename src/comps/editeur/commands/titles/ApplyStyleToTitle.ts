import { TitleStyleType } from "@/comps/store/store";
import { EditorView } from "prosemirror-view";
import GetStyledMark from "./GetStyledMark"; // adapte le chemin
import { Node } from "prosemirror-model";

export default function (
  view: EditorView,
  style: TitleStyleType["style"],
  target: number
) {
  const { state, dispatch } = view;
  const { tr, schema } = state;

  // Collecte toutes les positions des nœuds à modifier
  const nodesToUpdate: { node: Node; pos: number }[] = [];

  state.doc.descendants((node, pos) => {
    if (node.type.name === "heading" && node.attrs.level === target) {
      nodesToUpdate.push({ node, pos });
    }
  });

  // Parcourir de la fin vers le début
  for (let i = nodesToUpdate.length - 1; i >= 0; i--) {
    const { node, pos } = nodesToUpdate[i];

    const updatedContent = node.children.map((child) => {
      if (child.isText) {
        const newMarks = GetStyledMark(style!, schema, child.marks);
        return child.mark(newMarks!);
      }
      return child;
    });

    const newNode = node.type.create(node.attrs, updatedContent);

    tr.replaceWith(pos, pos + node.nodeSize, newNode);
  }

  if (tr.docChanged) dispatch(tr);
}
