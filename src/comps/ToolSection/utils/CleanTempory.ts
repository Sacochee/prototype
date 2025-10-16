import { EditorView } from "prosemirror-view";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { TextSelection } from "prosemirror-state";

export default function cleanTemporaryNode(view: EditorView) {
  const { state, dispatch } = view;
  let tr = state.tr;

  // 1. Supprimer les nodes "nodeArea" mais garder leur contenu
  tr.doc.descendants((node: ProseMirrorNode, pos: number) => {
    if (node.type.name === "nodeArea") {
      tr = tr.replaceWith(pos, pos + node.nodeSize, node.content);
    }
  });

  // 2. Supprimer les textes recouverts par delMark
  const delMark = state.schema.marks.delMark;
  if (delMark) {
    tr.doc.descendants((node: ProseMirrorNode, pos: number) => {
      if (node.isText && node.marks.some((m) => m.type === delMark)) {
        tr = tr.delete(pos, pos + node.nodeSize);
      }
    });
  }

  // 3. Supprimer addMark et editMark (mais garder le texte)
  ["addMark", "editMark"].forEach((name) => {
    const type = state.schema.marks[name];
    if (type) {
      tr = tr.removeMark(0, tr.doc.content.size, type);
    }
  });

  if (tr.docChanged) {
    dispatch(tr);
  }
}
