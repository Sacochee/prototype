import { EditorState, Transaction } from "prosemirror-state";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { EditorView } from "prosemirror-view";

export function cleanIds(view: EditorView) {
  const { doc, tr } = view.state;
  const seen = new Set<string>();
  const toUpdate: { pos: number; attrs: any }[] = [];

  doc.descendants((node: ProseMirrorNode, pos: number) => {
    if (node.attrs?.id) {
      const id = node.attrs.id as string;
      if (seen.has(id)) {
        // on note pour mise à jour plus tard
        toUpdate.push({
          pos,
          attrs: { ...node.attrs, id: undefined },
        });
      } else {
        seen.add(id);
      }
    }
    return true;
  });

  // appliquer les modifs séparément
  for (const { pos, attrs } of toUpdate) {
    tr.setNodeMarkup(pos, undefined, attrs);
  }

  if (toUpdate.length > 0 && view) {
    view.dispatch(tr);
  }
}
