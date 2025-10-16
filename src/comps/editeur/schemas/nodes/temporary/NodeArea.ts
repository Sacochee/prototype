import { DOMOutputSpec, NodeSpec } from "prosemirror-model";

// mes types : Correction, Previsualisation, MiseEnForme, etc;..
export const NodeArea: NodeSpec = {
  group: "block",
  content: "block+",
  attrs: {
    loading: { default: false },
    type : {default : 'Correction'},
    id : {default : ''}
  },
  parseDOM: [{ tag: 'div[data-autorize="true"]' }],
  toDOM: (node) => {
    return [
      "div",
      {
        class: `textIA`,
        // rien pour l'instant
      },
      node.attrs.loading ? ["div", { class: "TextIALaoding" }, 0] : 0,
    ] as DOMOutputSpec;
  },
};
