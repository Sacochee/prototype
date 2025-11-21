import { Node } from "prosemirror-model";
import { EditorState } from "prosemirror-state";

export const CleanHtmlString = (str: string): string =>
  str.replaceAll(/\s*style="[^"]*"/gi, "").replaceAll(/<\/?span[^>]*>/gi, "");

export const getNodeById = (doc: EditorState["doc"], id: string) => {
  let foundNode: Node | undefined = undefined;
  let posNode: number = 0;
  let parentNode: Node | undefined = undefined;
  doc.descendants((node, pos, parent) => {
    if (node.attrs.id === id) {
      foundNode = node;
      posNode = pos;
      parentNode = parent ?? undefined;
      return false; // Stop descending further
    }
  });

  if (!foundNode && !posNode) return null;

  return { node: foundNode, pos: posNode, parent: parentNode };
};
