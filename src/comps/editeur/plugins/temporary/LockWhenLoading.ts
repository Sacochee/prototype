import { Plugin, PluginKey } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import type { Transaction } from "prosemirror-state";
import { setMessage } from "@/comps/store/store";
import { CantEditWHilLoading } from "@/comps/notificationCenter/MessagesText";

function transactionHasLoadingNode(tr: Transaction): boolean {
  let result = false;

  tr.steps.forEach((step) => {
    const map = step.getMap(); // StepMap de ce step
    map.forEach((from, to) => {
      // comparer avec chaque node de niveau 1 sous le doc
      tr.doc.forEach((child, offset) => {
        const nodeFrom = offset;
        const nodeTo = offset + child.nodeSize;

        if (child.attrs?.loading) {
          // chevauchement ?
          if (from < nodeTo && to > nodeFrom) {
            result = true;
          }
        }
      });
    });
  });

  return result;
}

export const lockWhenLoadingKey = new PluginKey("lockWhenLoading");

export function lockWhenLoadingPlugin(store: {
  dispatch: (action: any) => void;
  getState: () => any;
}) {
  return new Plugin({
    key: lockWhenLoadingKey,
    state: {
      init() {
        return false; // désactivé par défaut
      },
      apply(tr, value) {
        const meta = tr.getMeta(lockWhenLoadingKey);
        if (meta && typeof meta.enabled === "boolean") {
          return meta.enabled;
        }
        return value;
      },
    },
    filterTransaction(tr, state) {
      const enabled = lockWhenLoadingKey.getState(state) as boolean;
      if (!enabled) return true;

      console.log(tr.getMeta("secured") === true, "META CHECK");
      // bypass si transaction marquée comme sécurisée
      if (tr.getMeta("secured") === true) return true;

      if (transactionHasLoadingNode(tr)) {
        store.dispatch(
          setMessage({ message: CantEditWHilLoading, type: "error" })
        );
        return false;
      }

      return true;
    },
  });
}

// Helper pour activer/désactiver
export function setLockWhenLoading(view: EditorView, enabled: boolean) {
  const tr = view.state.tr.setMeta(lockWhenLoadingKey, { enabled });
  view.dispatch(tr);
}
