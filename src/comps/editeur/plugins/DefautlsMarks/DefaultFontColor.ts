import { Schema } from "prosemirror-model";
import { Plugin, PluginKey } from "prosemirror-state";
import { DEFAULT_FONT_COLOR } from "../../schemas/DefautlsConst";

export const defaultFontColor = new PluginKey("defaultFontColor");

export default function defaultFontColorPlugin(schema: Schema) {
  const fontColorType = schema.marks.fontColor;
  if (!fontColorType) throw new Error("schema.marks.fontCOlor manquant");

  return new Plugin({
    key: defaultFontColor,

    state: {
      init: () => ({ fontColorAttrs: { fontColor: DEFAULT_FONT_COLOR } }),
      apply(tr, prev) {
        const next = { ...prev };

        const fs = tr.getMeta("setFontColor");
        if (fs !== undefined) next.fontColorAttrs = fs;

        return next;
      },
    },

    appendTransaction(_, __, newState) {
      const { fontColorAttrs } = this.getState(newState);
      if (!fontColorAttrs) return null;

      const sel = newState.selection;
      if (!sel.empty) return null;

      let marks = newState.storedMarks;
      if (!marks) marks = sel.$head.marks();

      if (fontColorType.isInSet(marks)) return null;

      const tr = newState.tr.setStoredMarks([
        ...marks.filter((m) => m.type !== fontColorType),
        fontColorType.create(fontColorAttrs),
      ]);

      return tr;
    },
  });
}
