import { EditorState, Transaction } from "prosemirror-state";
import { Title } from "../PlanGenerator";
import { Node } from "prosemirror-model";

export default function ApplyNode(
  title: Title,
  state: EditorState,
  tr: Transaction
): Transaction | null {
  const { doc, schema } = state;
  let nodeTarget: Node | undefined;
  let posTarget: number | undefined;

  doc.descendants((node, pos) => {
    if (node.attrs.id === title.id) {
      nodeTarget = node;
      posTarget = pos;
      return true;
    }
    return false;
  });

  if (nodeTarget && typeof posTarget === "number") {
    const newNode = schema.nodes.heading.create(
      { level: title.level || 1 },
      nodeTarget.content,
      nodeTarget.marks
    );
    tr.replaceWith(posTarget, posTarget + nodeTarget.nodeSize, newNode);
    return tr;
  }

  return null;
}
