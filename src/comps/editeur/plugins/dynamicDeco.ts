import { Plugin, PluginKey } from "prosemirror-state";
import { DecorationSet } from "prosemirror-view";

export const decoKey = new PluginKey("dynamic-deco");

export const decoPlugin = new Plugin({
  key: decoKey,
  state: {
    init: () => DecorationSet.empty,
    apply(tr, oldDecos : DecorationSet) {
      const action = tr.getMeta(decoKey);
      if (action?.add) {
      
        return action.add
      }
      if (action?.remove) {
        return DecorationSet.empty
      }
      return oldDecos.map(tr.mapping, tr.doc);
    }
  },
  props: {
    decorations(state) {
      return decoKey.getState(state);
    }
  }
});
