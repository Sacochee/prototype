import { EditorState } from "prosemirror-state";

export default function (doc: EditorState["doc"], id: string) {
  let pos = 0;
  for (const item of doc.children) {
    if (item.attrs.id === id) return { node: item, pos: pos };
    else {
      let find = false;
      item.descendants((node, pos) => {
        if (node.attrs.id === id) {
          find = true;
          return false;
        }
      });
      if(find) return {node : item, pos}
      else pos += item.nodeSize
    }
  }
}
