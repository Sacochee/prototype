import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

type Dispatch = (tr: Transaction) => void;
export type enumType = "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export function ChangeBlockType(editorView: EditorView, type: enumType) {
  const { state, dispatch } = editorView;
  const { tr, selection } = state;
  const { from, to, empty } = selection;

  console.log(type, "typeee");

  const target = ["heading", "paragraph"];
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (target.includes(node.type.name)) {
      const { nodeType, attrs: lvl } = transformData(type, state);
      const newNode = nodeType.create(
        { ...node.attrs, ...lvl },
        node.content,
        node.marks
      );
      tr.replaceWith(pos, pos + node.nodeSize, newNode);
    }
  });

  if (tr.docChanged) dispatch(tr);
}

function transformData(type: enumType, state: EditorState) {
  switch (type) {
    case "h1":
      return {
        nodeType: state.schema.nodes.heading,
        attrs: { level: 1 },
      };
    case "h2":
      return {
        nodeType: state.schema.nodes.heading,
        attrs: { level: 2 },
      };
    case "h3":
      return {
        nodeType: state.schema.nodes.heading,
        attrs: { level: 3 },
      };
    case "h4":
      return {
        nodeType: state.schema.nodes.heading,
        attrs: { level: 4 },
      };
    case "h5":
      return {
        nodeType: state.schema.nodes.heading,
        attrs: { level: 5 },
      };
    case "h6":
      return {
        nodeType: state.schema.nodes.heading,
        attrs: { level: 6 },
      };
      break;
    default:
      return { nodeType: state.schema.nodes.paragraph, attrs: {} };
  }
}
