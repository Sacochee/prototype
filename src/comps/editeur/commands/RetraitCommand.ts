import { EditorView } from "prosemirror-view";
import {
  DEFAULT_LI_PADDING_LEFT,
  DEFAULT_PADDING_LEFT,
  DEFAULT_PADDING_LEFT_INCREMENT,
} from "../schemas/DefautlsConst";
import { EditorState, Transaction } from "prosemirror-state";
import { Node } from "prosemirror-model";
export function CommandPaddingLeftIncrement(
  state: EditorState,
  d?: (tr: Transaction) => void,
  view?: EditorView
): boolean {
  if (view) return IncrementBlockLeftSpacingCommand(view);
  else return false;
}
export function IncrementBlockLeftSpacingCommand(editorView: EditorView) {
  const { state, dispatch } = editorView;
  const { tr, selection } = state;
  const { from, to } = selection;

  state.doc.nodesBetween(from, to, (node, pos, parent) => {
    if (parent && parent == state.doc) {
      applyToFirstInBranch2(node, pos, tr);
    }
  });

  if (tr.docChanged && dispatch) {
    dispatch(tr);
    return true;
  }
  return false;
}

export function CommandPaddingLeftReduce(
  state: EditorState,
  d?: (tr: Transaction) => void,
  view?: EditorView
): boolean {
  if (view) return ReduceBlockLeftSpacingCommand(view);
  else return false;
}
export function ReduceBlockLeftSpacingCommand(editorView: EditorView): boolean {
  const { state, dispatch } = editorView;
  const { tr, selection } = state;
  const { from, to } = selection;

  state.doc.nodesBetween(from, to, (node, pos, parent) => {
    if (parent && parent === state.doc) {
      applyToFirstInBranch(node, pos, tr);
    }
  });

  if (tr.docChanged && dispatch) {
    dispatch(tr);
    return true;
  }
  return false;
}

const allowed = new Set(["paragraph", "heading", "blockquote", "bulletList"]);

const minPadding: Record<string, number> = {
  paragraph: DEFAULT_PADDING_LEFT,
  heading: DEFAULT_PADDING_LEFT,
  blockquote: DEFAULT_PADDING_LEFT,
  bulletList: DEFAULT_LI_PADDING_LEFT,
};

function applyToFirstInBranch(node: Node, pos: number, tr: Transaction) {
  // si hors de la plage, on saute

  if (allowed.has(node.type.name)) {
    tr.setNodeMarkup(pos, node.type, {
      ...node.attrs,
      paddingLeft:
        node.attrs.paddingLeft > minPadding[node.type.name]
          ? node.attrs.paddingLeft - DEFAULT_PADDING_LEFT_INCREMENT
          : minPadding[node.type.name],
    });
    return true;
  }

  let offset = pos + 1;
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (applyToFirstInBranch(child, offset, tr)) {
      return true; // trouvé dans cette branche
    }
    offset += child.nodeSize;
  }
  return false;
}

function applyToFirstInBranch2(node: Node, pos: number, tr: Transaction) {
  // si hors de la plage, on saute

  if (allowed.has(node.type.name)) {
    tr.setNodeMarkup(pos, node.type, {
      ...node.attrs,
      paddingLeft:
        node.attrs.paddingLeft >= 360 - minPadding[node.type.name]
          ? 360
          : node.attrs.paddingLeft + DEFAULT_PADDING_LEFT_INCREMENT,
    });
    return true;
  }

  let offset = pos + 1;
  for (let i = 0; i < node.childCount; i++) {
    const child = node.child(i);
    if (applyToFirstInBranch(child, offset, tr)) {
      return true; // trouvé dans cette branche
    }
    offset += child.nodeSize;
  }
  return false;
}
