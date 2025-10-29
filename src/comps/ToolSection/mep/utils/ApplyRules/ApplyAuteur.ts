import { Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

export default function (
  view: EditorView,
  data: string[],
  from: number,
  to: number,
  tr: Transaction
) {
  const { state, dispatch } = view;
  let { doc } = state;

  data.forEach((item) => {
    const defText = item.toLowerCase();

    // Parcourir tous les nœuds texte
    doc.content.nodesBetween(from, to, (node, pos) => {
      if (!node.isText) return true;
      const text = node.text?.toLowerCase() || "";
      // Mettre le texte de def en gras si correspond exactement
      if (text!.includes(defText)) {
        const start = text!.indexOf(defText);
        tr = tr.addMark(
          pos + start,
          pos + start + defText.length,
          state.schema.marks.fontColor.create({ fontColor: "red" })
        );
      }
      return true;
    });
  });
  return tr;
}
