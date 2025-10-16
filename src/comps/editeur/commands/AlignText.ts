import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

type Dispatch = (tr: Transaction) => void;
export type enumTextAlign = "center" | "start" | "end" | "justify";
export function TextAlignCommand(
  editorView: EditorView,
  position: enumTextAlign
): boolean;
export function TextAlignCommand(
  editorView: EditorView,

  position: enumTextAlign
) {
  const { state, dispatch } = editorView;
  const { tr, selection } = state;
  const { from, to, empty } = selection;

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type.name === "paragraph") {
      tr.setNodeMarkup(pos, node.type, {
        ...node.attrs,
        textAlign: position,
      });
    }
  });

  if (tr.docChanged && dispatch) {
    dispatch(tr);
    return true;
  }
  return false;
}

export function TextAlignCommandStart(_: any, __: any, view?: EditorView) {
  if (view) return TextAlignCommand(view, "start");
  else return false;
}

export function TextAlignCommandCenter(_: any, __: any, view?: EditorView) {
  if (view) return TextAlignCommand(view, "center");
  else return false;
}

export function TextAlignCommandEnd(_: any, __: any, view?: EditorView) {
  if (view) return TextAlignCommand(view, "end");
  else return false;
}

export function TextAlignCommandJustify(_: any, __: any, view?: EditorView) {
  if (view) return TextAlignCommand(view, "justify");
  else return false;
}
