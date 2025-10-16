import { setSelection } from "@/comps/store/store";
import { Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

const selectionPluginKey = new PluginKey("selectionPlugin");

export default (store: { dispatch: (action: any) => void }) =>
  new Plugin({
    key: selectionPluginKey,
    state: {
      init: () => ({ active: false }),
      apply(tr, pluginState) {
        const meta = tr.getMeta(selectionPluginKey);
        if (meta?.active !== undefined) {
          return { active: meta.active };
        }
        return pluginState;
      },
    },
    view(editorView) {
      return {
        update(view) {
          const pluginState = selectionPluginKey.getState(view.state);
          if (pluginState.active) {
            const { from, to } = view.state.selection;
           
            store.dispatch(setSelection({ from, to }));
          }
        },
      };
    },
  });

// Pour activer/désactiver
export const toggleSelectionPlugin = (view: EditorView, active: boolean) => {
  view.dispatch(view.state.tr.setMeta(selectionPluginKey, { active }));
};
