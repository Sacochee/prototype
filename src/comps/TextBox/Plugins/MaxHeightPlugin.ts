import {
  DOMSerializer,
  Fragment,
  Node,
  Schema,
  Slice,
} from "prosemirror-model";
import { Plugin } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

export default function (maxHeight: number) {
  let viewRef: EditorView | null = null;

  return new Plugin({
    view(view) {
      viewRef = view;
      return {};
    },

    appendTransaction(_, __, newState) {
      if (newState.tr.getMeta("skipTr")) return null;

      const serializer = DOMSerializer.fromSchema(viewRef!.state.schema);
      const lstNode: Node[] = [];
      const newNodes = newState.doc.children;
      const clone = CreateCloneEditor();

      document.body.appendChild(clone);

      let change = false;
      let LastNode;

      let LastHeight = {
        lastHeight: 0,
        heigh: 0,
      };

      for (const node of newNodes) {
        if (LastHeight.heigh !== clone.offsetHeight)
          LastHeight = {
            lastHeight: LastHeight.heigh,
            heigh: clone.offsetHeight,
          };

        const nDom = serializer.serializeNode(
          ensureEmptyParagraphHasHeight(node, viewRef!.state.schema)
        );
        clone.appendChild(nDom);

        if (!(clone.offsetHeight > maxHeight)) {
          lstNode.push(node);
        } else {
          LastNode = node;
          change = true;
          break;
        }
      }

      if (change && LastNode) {
        const slice = new Slice(Fragment.fromArray(lstNode), 0, 0);
        const lastNode = truncateNodeToHeight(
          LastNode,
          viewRef!.state.schema,
          maxHeight - LastHeight.lastHeight
        );
        return newState.tr
          .replace(0, newState.doc.content.size, appendSlices(slice, lastNode))
          .setMeta("skipTr", true)
          .scrollIntoView();
      }

      document.body.removeChild(clone);
      return null;
    },
  });
}

//TODO faire une liste des top nodes et le mettre partout.
function ensureEmptyParagraphHasHeight(node: Node, schema: Schema) {
  if (node.type.name === "paragraph" && node.content.size === 0) {
    // créer un node contenant un <br> pour que le DOM ait de la hauteur
    return schema.node("paragraph", null, schema.text("\u200B")); // caractère invisible
  }
  return node;
}

function truncateNodeToHeight(
  node: Node,
  schema: Schema,
  maxHeight: number
): Slice {
  // 1. Découpe le node en caractères
  const chars: Node[] = [];
  node.descendants((child) => {
    if (child.isText) {
      for (const char of child.text!) {
        chars.push(schema.text(char, child.marks));
      }
    } else if (child.type.name === "paragraph" && child.content.size === 0) {
      chars.push(schema.node("paragraph"));
    }
  });

  // 2. Crée un container DOM temporaire
  const tempDiv = CreateCloneEditor();
  document.body.appendChild(tempDiv);

  const finalNodes: Node[] = [];
  for (const charNode of chars) {
    //TODO penser a adpater aux autre nodes
    const tempFragment = schema.node(
      "paragraph",
      null,
      finalNodes.concat(charNode)
    );
    const serializer =
      DOMSerializer.fromSchema(schema).serializeNode(tempFragment);

    tempDiv.appendChild(serializer);

    if (tempDiv.scrollHeight > maxHeight) {
      break; // dépassement → arrêt
    } else {
      finalNodes.push(charNode);
    }

    tempDiv.innerHTML = "";
  }

  document.body.removeChild(tempDiv);

  if (finalNodes.length === 0) {
    return Slice.empty;
  }

  return new Slice(Fragment.fromArray(finalNodes), 0, 0);
}

function appendSlices(sliceA: Slice, sliceB: Slice): Slice {
  const combinedContent = Fragment.fromArray([
    ...fragmentToArray(sliceA.content),
    ...fragmentToArray(sliceB.content),
  ]);

  const openStart = sliceA.openStart;
  const openEnd = sliceB.openEnd;

  return new Slice(combinedContent, openStart, openEnd);
}

function fragmentToArray(fragment: Fragment): Node[] {
  const nodes: Node[] = [];
  fragment.forEach((node) => nodes.push(node));
  return nodes;
}

function CreateCloneEditor() {
  const clone = document.createElement("div");
  clone.style.boxSizing = "border-box";
  clone.style.padding = "10px";
  clone.style.width = "330px";
  clone.style.visibility = "hidden";
  clone.style.position = "absolute";
  clone.style.top = "0";
  clone.style.left = "0";
  clone.style.height = "auto";
  clone.style.wordBreak = "break-word";

  return clone;
}
