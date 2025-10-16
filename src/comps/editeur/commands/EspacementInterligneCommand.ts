import { EditorView } from "prosemirror-view";
import { DEFAULT_PADDING_SPACE } from "../schemas/DefautlsConst";

export function ToggleSpaceBeforeNodeCommand(editorView: EditorView) {
  const { state, dispatch } = editorView;
  const { tr, selection } = state;
  const { from, to, empty } = selection;

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type.name === "paragraph") {
      tr.setNodeMarkup(pos, node.type, {
        ...node.attrs,
        paddingTop: node.attrs.paddingTop == 0 ? DEFAULT_PADDING_SPACE : 0,
      });
    }
  });

  if (tr.docChanged && dispatch) {
    dispatch(tr);
    return true;
  }
  return false;
}

export function ToggleSpaceAfterNodeCommand(editorView: EditorView) {
  const { state, dispatch } = editorView;
  const { tr, selection } = state;
  const { from, to, empty } = selection;

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type.name === "paragraph") {
      tr.setNodeMarkup(pos, node.type, {
        ...node.attrs,
        paddingBottom:
          node.attrs.paddingBottom == 0 ? DEFAULT_PADDING_SPACE : 0,
      });
    }
  });

  if (tr.docChanged && dispatch) {
    dispatch(tr);
    return true;
  }
  return false;
}

export function LineHeightCommand(editorView: EditorView, value: number) {
  const { state, dispatch } = editorView;
  const { tr, selection } = state;
  const { from, to, empty } = selection;

  state.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type.name === "paragraph") {
      tr.setNodeMarkup(pos, node.type, {
        ...node.attrs,
        lineHeight: value,
      });
    }
  });

  if (tr.docChanged && dispatch) {
    dispatch(tr);
    return true;
  }
  return false;
}
