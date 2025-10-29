import { Plugin, PluginKey } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type { Transaction } from "prosemirror-state";
import { EditorState } from "prosemirror-state";
import { MarkType, Node } from "prosemirror-model";
import {
  setBackgroundColor,
  setBold,
  setFontColor,
  setFontFamily,
  setFontSize,
  setItalic,
  setLineHeight,
  setMarginBottom,
  setMarginTop,
  setNodeType,
  setTextAlign,
  setUnderline,
} from "@/comps/store/store";
import FontNames from "../FontsFamily.json";

// Tu passes un "dispatch" en paramètre (par ex: redux.dispatch)
export default function (dispatch: (action: any) => void) {
  return new Plugin({
    key: new PluginKey("SelectionPlugin"),

    view(editorView: EditorView) {
      return {
        update(view, prevState) {
          const { state } = view;

          dispatch(setBold(markIsActive(state, state.schema.marks.strong)));
          dispatch(
            setUnderline(markIsActive(state, state.schema.marks.underline))
          );
          dispatch(setItalic(markIsActive(state, state.schema.marks.em)));

          //TODO il faudra patch cette fnc pour la perfctionnée.
          dispatch(setFontSize(getFontSize(state) as any));

          dispatch(setFontFamily(MatchFontFamilyNames(getFontFamily(state))));

          dispatch(setFontColor(getFontColor(state)));

          dispatch(setBackgroundColor(getBackgroundColor(state)));

          dispatch(setTextAlign(getTextAlign(state) as any));

          dispatch(setLineHeight(getLineHeight(state)));

          dispatch(setMarginBottom(getMarginBottom(state)));

          dispatch(setMarginTop(getMarginTop(state)));

          dispatch(setNodeType(getNodeType(state) as any));
        },
      };
    },
  });
}

function markIsActive(state: EditorState, markType: MarkType): boolean {
  const { from, $from, to, empty } = state.selection;

  if (empty) {
    return !!markType.isInSet(state.storedMarks || $from.marks());
  } else {
    return state.doc.rangeHasMark(from, to, markType);
  }
}

function getNodeType(state: EditorState) {
  const { selection } = state;
  const { from, to } = selection;
  let value: string | null | undefined = null;
  const target = ["heading", "paragraph"];
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (!target.includes(node.type.name)) return;

    let nodeT = null;
    if (node.type.name === "heading") nodeT = getName(node.attrs.level);
    else nodeT = "p";

    if (value === null) {
      value = nodeT;
    } else if (nodeT && value !== nodeT) {
      value = undefined;
    }
  });

  return value;
}

function getName(lvl: number): string | undefined {
  switch (lvl) {
    case 1:
      return "h1";
    case 2:
      return "h2";
    case 3:
      return "h3";
    case 4:
      return "h4";
    case 5:
      return "h5";
    case 6:
      return "h6";
    default:
      return undefined;
  }
}

function MatchFontFamilyNames(str: string | undefined): string | undefined {
  if (str) {
    for (const item of FontNames) {
      if (item[1] == str) {
        return item[0];
      }
    }
  } else return str;
}

function getMarginBottom(state: EditorState): number | undefined {
  const { from, to, empty, $from } = state.selection;

  // Cas curseur (sélection vide)
  if (empty) {
    const parent = $from.parent;
    return parent?.attrs.marginBottom || null;
  }

  // Cas sélection étendue
  let value: string | null | undefined = null;

  state.doc.nodesBetween(from, to, (node) => {
    if (!node.isBlock) return; // On ne regarde que les blocks

    const nodeMarginBottom = node.attrs.marginBottom || null;

    if (value === null) {
      value = nodeMarginBottom;
    } else if (nodeMarginBottom && value !== nodeMarginBottom) {
      value = undefined; // Inconsistant entre plusieurs nodes
    }
  });

  return value as any;
}

function getMarginTop(state: EditorState): number | undefined {
  const { from, to, empty, $from } = state.selection;

  // Cas curseur (sélection vide)
  if (empty) {
    const parent = $from.parent;
    return parent?.attrs.marginTop || null;
  }

  // Cas sélection étendue
  let value: string | null | undefined = null;

  state.doc.nodesBetween(from, to, (node) => {
    if (!node.isBlock) return; // On ne regarde que les blocks

    const nodeMarginTop = node.attrs.marginTop || null;

    if (value === null) {
      value = nodeMarginTop;
    } else if (nodeMarginTop && value !== nodeMarginTop) {
      value = undefined; // Inconsistant entre plusieurs nodes
    }
  });

  return value as any;
}

function getLineHeight(state: EditorState): number | undefined {
  const { from, to, empty, $from } = state.selection;

  // Cas curseur (sélection vide)
  if (empty) {
    const parent = $from.parent;
    return parent?.attrs.lineHeight || null;
  }

  // Cas sélection étendue
  let value: string | null | undefined = null;

  state.doc.nodesBetween(from, to, (node) => {
    if (!node.isBlock) return; // On ne regarde que les blocks

    const nodeLineHeight = node.attrs.lineHeight || null;

    if (value === null) {
      value = nodeLineHeight;
    } else if (nodeLineHeight && value !== nodeLineHeight) {
      value = undefined; // Inconsistant entre plusieurs nodes
    }
  });

  return value as any;
}
export function getTextAlign(state: EditorState): string | undefined {
  const { from, to, empty, $from } = state.selection;

  // Cas curseur (sélection vide)
  if (empty) {
    const parent = $from.parent;
    return parent?.attrs.textAlign || null;
  }

  // Cas sélection étendue
  let value: string | null | undefined = null;

  state.doc.nodesBetween(from, to, (node) => {
    if (!node.isBlock) return; // On ne regarde que les blocks

    const nodeAlign = node.attrs.textAlign || null;

    if (value === null) {
      value = nodeAlign;
    } else if (nodeAlign && value !== nodeAlign) {
      value = undefined; // Inconsistant entre plusieurs nodes
    }
  });

  return value as any;
}

function getFontFamily(state: EditorState): string | undefined {
  const markType = state.schema.marks.fontFamily;
  const { from, $from, to, empty } = state.selection;

  if (empty) {
    const marks = state.storedMarks || $from.marks();
    const mark = marks.find((m) => m.type === markType);
    if (mark) return mark.attrs.fontFamily;

    const parent = $from.parent;
    return parent?.attrs.fontFamily || null;
  }

  let value: string | null | undefined = null;
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (!node.isText) return;

    const mark = node.marks.find((m) => m.type === markType);
    let nodeFont: string | null = null;

    if (mark) {
      nodeFont = mark.attrs.fontFamily;
    } else {
      const parent = state.doc.nodeAt(pos - 1) || state.doc.resolve(pos).parent;
      nodeFont = parent?.attrs.fontFamily || null;
    }

    if (value === null) {
      value = nodeFont;
    } else if (nodeFont && value !== nodeFont) {
      value = undefined;
    }
  });

  return value as any;
}

function getFontColor(state: EditorState): string | undefined {
  const markType = state.schema.marks.fontColor;
  const { from, $from, to, empty } = state.selection;

  if (empty) {
    const marks = state.storedMarks || $from.marks();
    const mark = marks.find((m) => m.type === markType);
    if (mark) return mark.attrs.fontColor;

    const parent = $from.parent;
    return parent?.attrs.fontColor || null;
  }

  let value: string | null | undefined = null;
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (!node.isText) return;

    const mark = node.marks.find((m) => m.type === markType);
    let nodeFont: string | null = null;

    if (mark) {
      nodeFont = mark.attrs.fontColor;
    } else {
      const parent = state.doc.nodeAt(pos - 1) || state.doc.resolve(pos).parent;
      nodeFont = parent?.attrs.fontColor || null;
    }

    if (value === null) {
      value = nodeFont;
    } else if (nodeFont && value !== nodeFont) {
      value = undefined;
    }
  });

  return value as any;
}

function getBackgroundColor(state: EditorState): string | undefined {
  const markType = state.schema.marks.backgroundColor;
  const { from, $from, to, empty } = state.selection;

  if (empty) {
    const marks = state.storedMarks || $from.marks();
    const mark = marks.find((m) => m.type === markType);
    if (mark) return mark.attrs.backgroundColor;

    const parent = $from.parent;
    return parent?.attrs.backgroundColor || null;
  }

  let value: string | null | undefined = null;
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (!node.isText) return;

    const mark = node.marks.find((m) => m.type === markType);
    let nodeFont: string | null = null;

    if (mark) {
      nodeFont = mark.attrs.backgroundColor;
    } else {
      const parent = state.doc.nodeAt(pos - 1) || state.doc.resolve(pos).parent;
      nodeFont = parent?.attrs.backgroundColor || null;
    }

    if (value === null) {
      value = nodeFont;
    } else if (nodeFont && value !== nodeFont) {
      value = undefined;
    }
  });

  if (value === null) value = undefined;

  return value as any;
}

function getFontSize(state: EditorState): string | null | undefined {
  const markType = state.schema.marks.fontSize;
  const { from, $from, to, empty } = state.selection;

  if (empty) {
    const marks = state.storedMarks || $from.marks();
    const mark = marks.find((m) => m.type === markType);
    if (mark) return mark.attrs.fontSize;

    const parent = $from.parent;
    return parent?.attrs.fontSize || null;
  }

  let value: string | null | undefined = null;
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (!node.isText) return;

    const mark = node.marks.find((m) => m.type === markType);
    let nodeFont: string | null = null;

    if (mark) {
      nodeFont = mark.attrs.fontSize;
    } else {
      const parent = state.doc.nodeAt(pos - 1) || state.doc.resolve(pos).parent;
      nodeFont = parent?.attrs.fontSize || null;
    }

    if (value === null) {
      value = nodeFont;
    } else if (nodeFont && value !== nodeFont) {
      value = undefined;
    }
  });

  return value;
}
