import { Plugin } from "prosemirror-state";
import { ReplaceStep } from "prosemirror-transform";
import { v4 as uuidV4 } from "uuid";

const nodeId = ["paragraph", "heading", "orderedList", "bulletList"];

//TODO passer en commadnClean si c'est trop couteux
export default function ensureNodeIds() {
  return new Plugin({
    appendTransaction(_, __, newState) {
      const tr = newState.tr;
      let modified = false;
      const positionsToFix: number[] = [];

      // collecter les nœuds sans id
      newState.doc.descendants((node, pos) => {
        if (nodeId.includes(node.type.name) && !node.attrs.id) {
          positionsToFix.push(pos);
        }
      });

      // appliquer les id après
      for (const pos of positionsToFix) {
        const node = tr.doc.nodeAt(pos);
        if (node && !node.attrs.id) {
          tr.setNodeMarkup(pos, undefined, {
            ...node.attrs,
            id: uuidV4(),
          });
          modified = true;
        }
      }

      return modified ? tr : null;

      // let tr = newState.tr;
      // let modified = false;

      // for (const transaction of transactions) {
      //   for (const step of transaction.steps) {

      //     newState.doc.descendants((node, pos) => {
      //       if (node.type.name === "paragraph" && !node.attrs.id) {

      //         tr = tr.setNodeMarkup(pos, undefined, {
      //           ...node.attrs,
      //           id: uuidV4(), // attribut modifié
      //         });
      //         // tr = tr.setNodeMarkup(step.from + pos, undefined, {
      //         //   ...node.attrs,
      //         //   id: uuidV4(),
      //         // });
      //         modified = true;
      //       }
      //     });
      //     //   if (step instanceof ReplaceStep) {
      //     //     const slice = step.slice;

      //     //     slice.content.descendants(
      //     //   }
      //   }
      // }

      // return modified ? tr : null;
      return null;
    },
  });
}
