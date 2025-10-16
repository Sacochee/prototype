import { toggleMark } from "prosemirror-commands";
import schema from "./schemas/schema";
import { EditorView } from "prosemirror-view";
import {
  Command,
  EditorState,
  Selection,
  Transaction,
} from "prosemirror-state";
import { MarkType } from "prosemirror-model";


type v = EditorView | null;
type cv = (editorView: EditorView | null) => boolean;

type fnc = Command | cv;

//bold font
export function BoldCommand(editorView: v): boolean;
export function BoldCommand(
  state: EditorState,
  d?: (tr: Transaction) => void,
  view?: EditorView
): boolean;
export function BoldCommand(
  arg1: (EditorView | null) | EditorState,
  d?: (tr: Transaction) => void,
  view?: EditorView
): boolean {
  if (!arg1) return false;

  // si on reçoit (EditorState, view), on transforme en EditorView
  if (arg1 instanceof EditorState && view) arg1 = view;

  const editorView = arg1 as EditorView;
  const { state, dispatch } = editorView;

  if (!state.schema.marks.strong) return false;

  // on crée une transaction pour toggle le mark
  let tr = state.tr;

  // ⚡ On stocke dans le meta que l'utilisateur veut du bold actif
  tr = tr.setMeta("setBold", true);

  dispatch(tr);

  // toggleMark modifie la transaction directement via dispatch
  const applied = toggleMark(state.schema.marks.strong)(
    state,
    dispatch || ((t) => editorView.dispatch(t))
  );

  return applied;
}





//Underline font
export function UnderlineCommand(editorView: v): boolean;
export function UnderlineCommand(
  state: EditorState,
  d?: (tr: Transaction) => void,
  view?: EditorView
): boolean;

export function UnderlineCommand(
  arg1: v | EditorState,
  d?: (tr: Transaction) => void,
  view?: EditorView
): boolean {
  if (!arg1) return true;
  if (arg1 instanceof EditorState && view !== undefined) arg1 = view;
  const { state, dispatch } = arg1 as EditorView;
  toggleMark(schema.marks.underline)(state, dispatch);
  return true;
}

//Italique font
export function ItalicCommand(editorView: v): boolean;
export function ItalicCommand(
  state: EditorState,
  d?: (tr: Transaction) => void,
  view?: EditorView
): boolean;

export function ItalicCommand(
  arg1: v | EditorState,
  d?: (tr: Transaction) => void,
  view?: EditorView
): boolean {
  if (!arg1) return true;
  if (arg1 instanceof EditorState && view !== undefined) arg1 = view;
  const { state, dispatch } = arg1 as EditorView;
  toggleMark(schema.marks.em)(state, dispatch);
  return true;
}

export function FontSizeCommand(
  editorView: EditorView,
  size: number,
  value?: number
): boolean {
  if (!editorView) return false;

  const { state, dispatch } = editorView;
  const { tr, selection, schema } = state;
  const { from, to, empty } = selection;

  const markType: MarkType = schema.marks.fontSize;
  if (!markType) return false; // sécurité si le mark n'existe pas

  if (size === -1 || size === 1) {
    if (empty) {
      // curseur sans texte sélectionné
      // on stocke le mark pour usage futur
      const store = state.storedMarks?.find(
        (m) => m.type === state.schema.marks.fontSize
      );

      if (store && store.attrs && store.attrs.fontSize) {
        const number = Number.parseInt(store.attrs.fontSize);

        const newMark = markType.create({
          fontSize: `${(number || 0) + size}`,
        });
        tr.setMeta("setFontSize", newMark);
        tr.addStoredMark(newMark);
      } else {
        const newMark = markType.create({
          fontSize: (value || 0) + size,
        });
        tr.setMeta("setFontSize", newMark);
        tr.addStoredMark(newMark);
      }
      dispatch(tr);
      return true;
    }

    state.doc.nodesBetween(from, to, (node, pos) => {
      if (!node.isText) return;

      const fontMark = node.marks.find((m) => m.type === markType);

      if (fontMark) {
        let current = parseFloat(fontMark.attrs.fontSize) || 11;
        const newSize = current + size;

        tr.removeMark(from, to, markType);
        const newMark = markType.create({ fontSize: `${newSize}` });
        tr.setMeta("setFontSize", newMark);
        tr.addMark(from, to, newMark);
      } else {
        const defaultSize = 11 + size;
        const newMark = markType.create({ fontSize: `${defaultSize}` });
        tr.setMeta("setFontSize", newMark);
        tr.addMark(from, to, newMark);
      }
    });

    dispatch(tr);
  } else {
    if (empty) {
      const newMark = markType.create({
        fontSize: size,
      });
      tr.setMeta("setFontSize", newMark);
      tr.addStoredMark(newMark);
      dispatch(tr);
      return true;
    } else {
      tr.removeMark(from, to, markType);
      const newMark = markType.create({ fontSize: `${size}` });
      tr.setMeta("setFontSize", newMark);
      tr.addMark(from, to, newMark);
      dispatch(tr);
    }
  }

  return true;
}

export function FontFamilyCommand(
  editorView: EditorView,
  name: string
): boolean {
  if (!editorView) return false;

  const { state, dispatch } = editorView;
  const { tr, selection, schema } = state;
  const { from, to, empty } = selection;

  const markType: MarkType = schema.marks.fontFamily;
  if (!markType) throw new Error(" sécurité si le mark n'existe pas");

  if (empty) {
    tr.addStoredMark(
      markType.create({
        fontFamily: name,
      })
    );
    dispatch(tr);
    return true;
  } else {
    tr.removeMark(from, to, markType);
    tr.setMeta("setFontfamily", markType.create({ fontfamily: name }));
    tr.addMark(from, to, markType.create({ fontFamily: name }));
    dispatch(tr);
  }

  return true;
}

export function FontColorCommand(
  editorView: EditorView,
  color: string
): boolean {
  if (!editorView) return false;

  const { state, dispatch } = editorView;
  const { tr, selection, schema } = state;
  const { from, to, empty } = selection;

  const markType: MarkType = schema.marks.fontColor;
  if (!markType) throw new Error(" sécurité si le mark n'existe pas");

  if (empty) {
    tr.addStoredMark(
      markType.create({
        fontColor: color,
      })
    );
    dispatch(tr);
    return true;
  } else {
    tr.removeMark(from, to, markType);
    tr.setMeta("setFontColor", markType.create({ fontColor: color }));
    tr.addMark(from, to, markType.create({ fontColor: color }));
    dispatch(tr);
  }

  return true;
}






export function toogleLinkCommand(editorView: EditorView, link: string) {
  const { state, dispatch } = editorView;
  const { tr, selection, schema } = state;
  const { from, to, empty } = selection;
  const linkMark = schema.marks.link;

  if (link) {
    let stopMarksIsAdrelyDefiend = false;
    state.doc.nodesBetween(from, to, (node) => {
      const marks = node.marks.find((m) => m.type == linkMark);
      if (marks) {
        stopMarksIsAdrelyDefiend = true;
      }
    });
    if (!stopMarksIsAdrelyDefiend) {
      tr.addMark(from, to, linkMark.create({ href: link }));
      dispatch(tr);
    }
  } else {
    //TODO a test.

    if (!linkMark) return false;

    let trModified = false;

    state.doc.nodesBetween(from, to, (node, pos) => {
      const marks = node.marks.filter((m) => m.type === linkMark);
      if (marks.length > 0) {
        const start = Math.max(pos, from);
        const end = Math.min(pos + node.nodeSize, to);
        tr.removeMark(start, end, linkMark);
        trModified = true;
      }
    });

    if (trModified && dispatch) {
      dispatch(tr);
      return true;
    }
    return false;
  }
}

export function BackgroundColorCommand(
  editorView: EditorView,
  color: string | undefined
): boolean {
  if (!editorView) return false;

  const { state, dispatch } = editorView;
  const { tr, selection, schema } = state;
  const { from, to, empty } = selection;

  const markType: MarkType = schema.marks.backgroundColor;
  if (!markType) throw new Error(" sécurité si le mark n'existe pas");

  if (empty) {
    tr.addStoredMark(
      markType.create({
        backgroundColor: color,
      })
    );
    dispatch(tr);
    return true;
  } else {
    tr.removeMark(from, to, markType);
    tr.setMeta(
      "setBackgroundColor",
      markType.create({ backgroundColor: color })
    );
    tr.addMark(from, to, markType.create({ backgroundColor: color }));
    dispatch(tr);
  }

  return true;
}

export const placeCursorCommand = (editorView: v, place?: number) => {
  if (!editorView) return true;
  const { state } = editorView;
  editorView.dom.focus();
  const tr = state.tr.setSelection(Selection.atStart(state.doc));
  editorView.dispatch(tr);
  return true;
};
