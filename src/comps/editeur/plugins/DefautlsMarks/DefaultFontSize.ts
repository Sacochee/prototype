import { Schema } from "prosemirror-model";
import { Plugin, PluginKey } from "prosemirror-state";
import { DEFAUTL_FONT_SIZE } from "../../schemas/DefautlsConst";

export const defaultFontSizeKey = new PluginKey("defaultFontSize");

export default function defaultFontSizePlugin(schema: Schema) {
  const fontSizeType = schema.marks.fontSize;
  if (!fontSizeType) throw new Error("schema.marks.fontSize manquant");

  return new Plugin({
    key: defaultFontSizeKey,

    state: {
      init: () => ({ fontSizeAttrs: { fontSize: DEFAUTL_FONT_SIZE } }),
      apply(tr, prev) {
        const next = { ...prev };

        const fs = tr.getMeta("setFontSize");
        if (fs !== undefined) next.fontSizeAttrs = fs;

        return next;
      },
    },

    appendTransaction(_, __, newState) {
      const { fontSizeAttrs } = this.getState(newState);
      if (!fontSizeAttrs) return null;

      const sel = newState.selection;
      if (!sel.empty) return null;

      let marks = newState.storedMarks;
      if (!marks) marks = sel.$head.marks();

      if (fontSizeType.isInSet(marks)) return null;

      const tr = newState.tr.setStoredMarks([
        ...marks.filter((m) => m.type !== fontSizeType),
        fontSizeType.create(fontSizeAttrs),
      ]);

      return tr;
    },
  });
}
