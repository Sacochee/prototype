import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import GetStyledMark from "./GetStyledMark";
import { TitleStyleType } from "@/comps/store/store";

type Dispatch = (tr: Transaction) => void;
export type enumType =
  | "p"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "h7"
  | "h8"
  | "h9"
  | "h10";

const defaultStyle: TitleStyleType["style"] = {
  bold: false,
  italic: false,
  underline: false,
  fontSize: "11pt",
  police: "Arial",
  backgroundColor: "none",
  color: "#000000",
};

export function ChangeBlockType(
  editorView: EditorView,
  type: enumType,
  titleStyle: TitleStyleType[]
) {
  const { state, dispatch } = editorView;
  const { tr, selection } = state;
  const { from, to, empty } = selection;
  const { nodeType, attrs: lvl } = transformData(type, state);

  const style = titleStyle.find((item) => item.target === lvl.level)?.style;

  const target = ["heading", "paragraph"];
  state.doc.nodesBetween(from, to, (node, pos) => {
    if (target.includes(node.type.name)) {
      const updatedContent = node.children.map((child) => {
        if (child.isText) {
          const newMarks = GetStyledMark(
            style || defaultStyle,
            state.schema,
            child.marks
          )!;
          return child.mark(newMarks);
        }
        return child;
      });
      const newNode = nodeType.create(
        { ...node.attrs, ...lvl },
        updatedContent
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
    case "h7":
      return {
        nodeType: state.schema.nodes.heading,
        attrs: { level: 7 },
      };
    case "h8":
      return {
        nodeType: state.schema.nodes.heading,
        attrs: { level: 8 },
      };
    case "h9":
      return {
        nodeType: state.schema.nodes.heading,
        attrs: { level: 9 },
      };
    case "h10":
      return {
        nodeType: state.schema.nodes.heading,
        attrs: { level: 10 },
      };
    default:
      return { nodeType: state.schema.nodes.paragraph, attrs: {} };
  }
}
