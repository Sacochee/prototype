import { EditorState, TextSelection, Transaction } from "prosemirror-state";

export function ClearFormattingCommand(
  state: EditorState,
  dispatch?: (tr: Transaction) => void
): boolean {
  if (!dispatch) return true;

  const { tr, schema, selection } = state;
  const { from, to } = selection;

  // Supprimer toutes les marques
  //filter et set a defautls les marks def
  schema.marks &&
    Object.values(schema.marks).forEach((mark) => {
      tr.removeMark(from, to, mark);
    });

  tr.addMark(from, to, schema.marks.fontSize.create());
  tr.addMark(from, to, schema.marks.fontColor.create());
  tr.addMark(from, to, schema.marks.fontFamily.create());

  // Remettre les nœuds en paragraphes
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.isTextblock && node.type !== schema.nodes.paragraph) {
      tr.setNodeMarkup(pos, schema.nodes.paragraph, null, node.marks);
    }
  });

  // Nettoyer la sélection
  tr.setSelection(TextSelection.create(tr.doc, from, to));

  dispatch(tr.scrollIntoView());
  return true;
}
