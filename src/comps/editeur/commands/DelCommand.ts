import { Command, TextSelection } from "prosemirror-state";
import {
  chainCommands,
  deleteSelection,
  joinBackward,
  joinForward,
  selectNodeBackward,
  selectNodeForward,
} from "prosemirror-commands";
import { Node } from "prosemirror-model";

function findParentOfType($pos: any, typeNames: string[]) {
  for (let d = $pos.depth; d > 0; d--) {
    if (typeNames.includes($pos.node(d).type.name)) {
      return { node: $pos.node(d), depth: d };
    }
  }
  return null;
}

export const customDel: Command = (state, dispatch) => {
  const { selection } = state;
  const { $from, $to, empty } = selection;

  if (!empty) return false;

  const parent = findParentOfType($from, ["listItem"]);

  // en dehors d'une liste
  if (!parent) {
    const depth = $from.depth;
    const index = $from.index(depth - 1); // index du node courant dans son parent
    const parentNode = $from.node(depth - 1); // le parent immédiat
    if (index <= 0 || depth == 0) return false;
    const beforeNode = parentNode.child(index - 1);

    if (
      beforeNode &&
      (beforeNode.type.name === "bulletList" ||
        beforeNode.type.name === "orderedList") &&
      $from.node(depth).textContent === ""
    ) {
      if (dispatch) {
        let tr = state.tr;

        console.log(state.doc.nodeSize, "doc size");
        console.log($from.pos, "from pos");
        console.log($from.pos + $from.node(depth).nodeSize - 2, "pos B");

        // supprimer le node courant (ex: paragraphe vide)
        if (depth > 0) {
          tr.delete($from.before(depth), $from.after(depth));
        }
        // position du bulletList précédent
        // if (!($from.depth > 0)) return false;
        console.log($from.depth - 1, "depth");
        const listPos = $from.before($from.depth);
        console.log(listPos, "listpos");
        const listNode = beforeNode;

        // récupérer le dernier list_item
        const lastIndex = listNode.childCount - 1;
        const lastItem = listNode.child(lastIndex);

        console.log(lastItem, "last item");
        // calculer la position de ce dernier list_item dans le doc
        const lastItemPos = listPos + 1; // premier enfant
        let pos = lastItemPos;
        for (let i = 0; i < lastIndex; i++) {
          pos += listNode.child(i).nodeSize;
        }

        // fin du dernier list_item
        const lastItemEnd = pos + lastItem.nodeSize;

        // placer le curseur juste avant la fin

        const safePos = Math.min(lastItemEnd - 1, tr.doc.content.size);

        tr = tr.setSelection(TextSelection.near(tr.doc.resolve(safePos)));

        dispatch(tr.scrollIntoView());
      }
      return true;
    }

    return false;
  }

  // dans une liste.
  const {
    node: liItem,
    depth,
  }: {
    node: Node;
    depth: number;
  } = parent;

  if (liItem.childCount == 1 && liItem.firstChild?.textContent === "") {
    ///savoir si le la list est coupée ou non
    const listNode = $from.node(depth - 1); // bullet_list ou ordered_list
    const childCount = listNode.childCount; // nb de list_item
    const index = $from.index(depth - 1); // position du li dans le ul/ol
    const isLast = index === childCount - 1;
    // dernier elements pas de split.
    if (isLast) {
      if (dispatch) {
        let tr = state.tr;
        //liste avec un seul elemnt donc del la liste.
        if (childCount == 1) {
          const depthParent = depth - 1;
          if (depthParent > 0)
            tr.delete($from.before(depthParent), $from.after(depthParent));
        }
        // liste avec + que 1 element.
        else {
          if (depth > 0) tr.delete($from.before(depth), $from.after(depth));
          const paragraph = state.schema.nodes.paragraph.create();
          const mappedPos = tr.mapping.map($from.after(depth - 1), -1);
          tr.insert(mappedPos, paragraph);
          tr = tr.setSelection(
            TextSelection.near(tr.doc.resolve(mappedPos + 1))
          );
        }

        dispatch(tr.scrollIntoView());
        return true;
      }
    } else {
      if (dispatch) {
        let tr = state.tr;

        const listNode = $from.node(depth - 1); // ul ou ol
        const listType = listNode.type;

        const index = $from.index(depth - 1); // index du li vide
        const beforeItems: Node[] = [];
        const afterItems: Node[] = [];

        console.log(beforeItems);
        console.log(afterItems);

        for (let i = 0; i < listNode.childCount; i++) {
          if (i < index) beforeItems.push(listNode.children[i]);
          if (i > index) afterItems.push(listNode.children[i]);
        }

        // supprimer la liste entière
        const start = $from.before(depth - 1);
        const end = $from.after(depth - 1);
        tr.delete(start, end);

        // reconstruire : liste avant + paragraphe + liste après
        if (beforeItems.length) {
          tr.insert(start, listType.create(null, beforeItems));
        }

        let pos = start;
        if (beforeItems.length) pos += tr.doc.nodeAt(start)!.nodeSize;

        const cursorPos = pos;
        const paragraph = state.schema.nodes.paragraph.create();
        tr.insert(pos, paragraph);
        pos += paragraph.nodeSize;

        if (afterItems.length) {
          tr.insert(pos, listType.create(null, afterItems));
        }

        tr = tr.setSelection(TextSelection.near(tr.doc.resolve(cursorPos)));

        dispatch(tr.scrollIntoView());
        return true;
      }
    }
  }

  return false;
};

export const delCommand: Command = chainCommands(
  deleteSelection,
  customDel,
  joinBackward,
  selectNodeBackward
);
