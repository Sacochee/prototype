import { Plugin, PluginKey, Transaction } from "prosemirror-state";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { Store } from "@reduxjs/toolkit";
import { setMessage } from "@/comps/store/store";
import { CantDelFully } from "@/comps/notificationCenter/MessagesText";
import { EditorView } from "prosemirror-view";
import { lockWhenLoadingKey } from "./LockWhenLoading";

export const lockNodeAreaDeletionKey = new PluginKey("lockNodeAreaDeletion");

export function lockNodeAreaDeletionPlugin(
  store: Store,
  nodeTypeName = "nodeArea"
) {
  return new Plugin({
    key: lockNodeAreaDeletionKey,

    state: {
      init: () => ({ enabled: true }),
      apply(tr, value) {
        const meta = tr.getMeta(lockNodeAreaDeletionKey);
        if (meta && typeof meta.enabled === "boolean") {
          return { enabled: meta.enabled };
        }
        return value;
      },
    },

    filterTransaction(tr, state) {
      const { enabled } = lockNodeAreaDeletionKey.getState(state);
      if (!enabled) return true;

      // autoriser si transaction marquée "secured"
      if (tr.getMeta("secured") === true) return true;

      const prevDoc = state.doc;
      const nextDoc = tr.doc;

      let prevHave = false;
      let nextHave = false;
      let blocked = false;

      prevDoc.descendants((node: ProseMirrorNode, pos: number) => {
        if (node.type.name === nodeTypeName) {
          prevHave = true;
          return false;
        }
        return true;
      });

      nextDoc.descendants((node: ProseMirrorNode, pos: number) => {
        if (node.type.name === nodeTypeName) {
          nextHave = true;
          return false;
        }
        return true;
      });

      if (prevHave) if (!nextHave) blocked = true;

      if (blocked) store.dispatch(setMessage({message : CantDelFully, type : "error"}));

      return !blocked;
    },
  });
}

/**
 * set helper
 */
export function setLockNodeAreaDeletion(view: EditorView, enabled: boolean) {
  const tr = view.state.tr.setMeta(lockWhenLoadingKey, { enabled });
  view.dispatch(tr);
}
