import { Fragment, Node, NodeType } from "prosemirror-model";
import {
  liftListItem,
  orderedList,
  splitListItem,
} from "prosemirror-schema-list";
import { Command, EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import schema from "../schemas/schema";

//set UL list
export function ToggleUlCommand(editorView: EditorView | null): boolean;
export function ToggleUlCommand(
  state: EditorState,
  d?: (tr: Transaction) => void,
  view?: EditorView
): boolean;
export function ToggleUlCommand(
  arg1: EditorState | (EditorView | null),
  d?: (tr: Transaction) => void
): boolean {
  let state: EditorState;
  let dispatch: (tr: Transaction) => void;

  if (arg1 instanceof EditorState) {
    state = arg1;
    dispatch = d ?? (() => {});
  } else {
    state = arg1!.state;
    dispatch = arg1!.dispatch;
  }

  if (!state || !dispatch) return false;

  const { bulletList, listItem, orderedList } = state.schema.nodes;
  const { from, to } = state.selection;
  let tr = state.tr;

  // récupérer tous les top-level nodes
  const topNodes: { node: any; pos: number }[] = [];
  state.doc.nodesBetween(from, to, (node, pos, parent) => {
    if (parent === state.doc) {
      topNodes.push({ node, pos });
      return false;
    }
    return true;
  });

  if (!topNodes.length) return false;

  // Si tous les topNodes sont des listItem → unwrap
  const allListItems = topNodes.filter(
    (n) => n.node.type === bulletList || n.node.type === orderedList
  );

  if (allListItems.length > 0) {
    // console.log("here");
    // // On sort les items de la liste (unwrap)
    // return liftListItem(listItem)(state, dispatch);
    console.log("here");
    unwrapList(topNodes, bulletList, orderedList, tr, dispatch);
  }

  // Si aucun n'est un listItem → wrap dans une bulletList
  const noListItems = topNodes.every((n) => n.node.type !== bulletList);
  if (noListItems) {
    const liNodes: Node[] = topNodes.map(
      (n) => listItem.createAndFill(null, n.node) as any
    );
    const ulNode = bulletList.create(null, Fragment.from(liNodes));
    const start = topNodes[0].pos;
    const end =
      topNodes[topNodes.length - 1].pos +
      topNodes[topNodes.length - 1].node.nodeSize;
    tr = tr.replaceWith(start, end, ulNode);
    if (tr.docChanged) dispatch(tr);
    return true;
  }

  // Sinon, ne rien faire (cas mixte)
  return false;
}

export function ToggleOlCommand(editorView: EditorView | null): boolean;
export function ToggleOlCommand(
  state: EditorState,
  d?: (tr: Transaction) => void,
  view?: EditorView
): boolean;
export function ToggleOlCommand(
  arg1: EditorState | (EditorView | null),
  d?: (tr: Transaction) => void
): boolean {
  let state: EditorState;
  let dispatch: (tr: Transaction) => void;

  if (arg1 instanceof EditorState) {
    state = arg1;
    dispatch = d ?? (() => {});
  } else {
    state = arg1!.state;
    dispatch = arg1!.dispatch;
  }

  if (!state || !dispatch) return false;

  const { bulletList, listItem, orderedList } = state.schema.nodes;
  const { from, to } = state.selection;
  let tr = state.tr;

  // récupérer les top-level nodes dans la sélection
  const topNodes: { node: any; pos: number }[] = [];
  state.doc.nodesBetween(from, to, (node, pos, parent) => {
    if (parent === state.doc) {
      topNodes.push({ node, pos });
      return false; // ne pas descendre dans l'arbre
    }
    return true;
  });

  if (!topNodes.length) return false;

  // Vérifier si on est déjà dans une liste (ul ou ol)
  const first = topNodes[0].node;
  if (first.type === bulletList || first.type === orderedList) {
    unwrapListWithSplit()(state, dispatch);
    return true;
  }

  // Sinon, wrap dans une orderedList
  const liNodes: Node[] = topNodes.map(
    (n) => listItem.createAndFill(null, n.node) as Node
  );

  const olNode = orderedList.create(null, Fragment.from(liNodes));

  const start = topNodes[0].pos;
  const end =
    topNodes[topNodes.length - 1].pos +
    topNodes[topNodes.length - 1].node.nodeSize;
  tr = tr.replaceWith(start, end, olNode);

  if (tr.docChanged) dispatch(tr);

  return true;
}

function unwrapList(
  topNodes: { node: any; pos: number }[],
  bulletList: NodeType,
  orderedList: NodeType,
  tr: Transaction,
  dispatch: (tr: Transaction) => void
) {
  const start = topNodes[0].pos;
  const end =
    topNodes[topNodes.length - 1].pos +
    topNodes[topNodes.length - 1].node.nodeSize;

  const children: Node[] = [];
  topNodes.forEach(({ node }) => {
    if (node.type === bulletList || node.type === orderedList) {
      node.forEach((li: Node) => {
        li.forEach((child) => children.push(child));
      });
    } else {
      children.push(node);
    }
  });

  tr = tr.replaceWith(start, end, Fragment.from(children));
  if (tr.docChanged) dispatch(tr);
  return true;
}

export function unwrapListWithSplit(
  listItemType = schema.nodes.listItem
): Command {
  return function (state, dispatch) {
    const { $from } = state.selection;

    // Si on est au milieu d'un item → on split d'abord
    if (
      $from.parentOffset > 0 &&
      $from.parentOffset < $from.parent.nodeSize - 2
    ) {
      if (splitListItem(listItemType)(state, dispatch)) {
        // après le split, on "unwrap" l'item (lift)
        return liftListItem(listItemType)(state, dispatch);
      }
    }

    // sinon, on fait juste un unwrap normal
    return liftListItem(listItemType)(state, dispatch);
  };
}
