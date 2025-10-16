import { Schema } from "prosemirror-model";
import { Plugin, PluginKey } from "prosemirror-state";
import { DEFAUTL_FONT_FAMILY } from "../../schemas/DefautlsConst";

export const defaultFontSizeKey = new PluginKey("defaultFontFamily");

export default function defaultFontFamilyPlugin(schema: Schema) {
  const fontFamilyType = schema.marks.fontFamily;
  if (!fontFamilyType) throw new Error("schema.marks.fontSize manquant");

  return new Plugin({
    key: defaultFontSizeKey,

    state: {
      init: () => ({ fontFamilyAttrs: { fontFamily: DEFAUTL_FONT_FAMILY } }),
      apply(tr, prev) {
        const next = { ...prev };

        const fs = tr.getMeta("setFontFamily");
        if (fs !== undefined) next.fontFamilyAttrs = fs;

        return next;
      },
    },

    appendTransaction(_, __, newState) {
      const { fontFamilyAttrs } = this.getState(newState);
      if (!fontFamilyAttrs) return null;

      const sel = newState.selection;
      if (!sel.empty) return null;

      let marks = newState.storedMarks;
      if (!marks) marks = sel.$head.marks();

      if (fontFamilyType.isInSet(marks)) return null;

      const tr = newState.tr.setStoredMarks([
        ...marks.filter((m) => m.type !== fontFamilyType),
        fontFamilyType.create(fontFamilyAttrs),
      ]);

      return tr;
    },
  });
}
