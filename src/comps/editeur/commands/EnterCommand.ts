import {
  chainCommands,
  createParagraphNear,
  liftEmptyBlock,
  newlineInCode,
  splitBlock,
} from "prosemirror-commands";
import { ContentMatch } from "prosemirror-model";
import { liftListItem, splitListItem } from "prosemirror-schema-list";
import {
  AllSelection,
  Command,
  EditorState,
  TextSelection,
  Transaction,
} from "prosemirror-state";
import { EditorView } from "prosemirror-view";
export type Dispatch = (tr: Transaction) => void;



export const newlineInLi: Command = (state, dispatch) => {
  const { $head, $anchor } = state.selection;
  const { listItem, paragraph } = state.schema.nodes;

  // Remonter pour trouver le li parent
  let depth = $head.depth;
  let liNode = $head.parent;
  while (liNode && liNode.type !== listItem && depth > 0) {
    liNode = $head.node(depth);
    depth--;
  }


  if (!liNode || liNode.type !== listItem || !$head.sameParent($anchor))
    return false;

  const liContent = liNode.content;
  const firstChild = liContent.firstChild;

  const isEmpty =
    liNode.childCount === 1 && // un seul enfant
    firstChild?.type === state.schema.nodes.paragraph &&
    firstChild?.content.size === 0;

  if (!dispatch) return true;

  let tr = state.tr;

  if (isEmpty) {
    console.log("here");
    // Si le li est vide, lift pour sortir du ul
    liftListItem(listItem)(state, (t) => (tr = t));

    // Insérer un paragraphe vide après
    const $pos = tr.selection.$from;
    const pNode = paragraph.createAndFill();
    if (pNode) {
      tr = tr.insert($pos.pos, pNode);
      tr = tr.setSelection(TextSelection.create(tr.doc, $pos.pos + 1));
    }
    return false
  } else {
    // Sinon split le li normalement
    splitListItem(listItem)(state, (t) => (tr = t));
  }

  dispatch(tr.scrollIntoView());
  return true;
};

export const EnterCommand: Command = chainCommands(
  newlineInCode,
  newlineInLi,
  createParagraphNear,
  liftEmptyBlock,
  splitBlock
);
