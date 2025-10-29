import { decoKey } from "@/comps/editeur/plugins/dynamicDeco";
import { setBornesIds } from "@/comps/store/store";
import { combineSlices, Store } from "@reduxjs/toolkit";
import {
  DOMSerializer,
  MarkType,
  Node,
  DOMParser as ProseMirrorDOMParser,
  Slice,
} from "prosemirror-model";
import { v4 as uuidV4 } from "uuid";
import { EditorView } from "prosemirror-view";

/**
 * MEssage  a moi qui aura oubleir ma super idée
 *
 * faire node d'utilsiation
 * et node d'ia
 *
 * nodes noramles
 *
 * // nodes temporaires
 *
 * un qui englobe tout le contenu avec un attrs laoding boolean
 * des node span edit/edl/add avec un data-authorize="true"
 *
 *
 * faire unscritp qui convertir les p data-id="..." en p data-id="a" style b etc..
 * fair eun script qui converit <del> en span class="de" data-authorize="true" etc..
 *
 * del les id sur les marks.
 */

export default class {
  private slice;
  private from;
  private id = uuidV4();

  constructor(private view: EditorView, startId: string, endId: string) {
    const doc = this.view.state.doc;

    this.from = getNodePosById(startId, doc)!.pos;

    const { node: endNode, pos: endPos } = getNodePosById(endId, doc);

    const to = endPos + endNode.nodeSize;

    const { state, dispatch } = this.view;
    const containerType = state.schema.nodes.nodeArea;

    // extrait le contenu de la plage
    this.slice = state.doc.slice(this.from, to);
    // crée un nœud container avec ce contenu
    const container = containerType.create(
      { loading: true, id: this.id, type: "Correction" },
      this.slice.content
    );

    // remplace la plage sélectionnée par le container
    const tr = state.tr.replaceRangeWith(this.from, to, container);
    tr.setMeta("secured", true);

    //refrest this.start and this.end pos avec la pos de container ?

    dispatch(tr);
    (view.nodeDOM(this.from) as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  getSlice = () => ({ slice: this.slice, from: this.from });

  getContent(): string {
    const { node } = getNodePosById(this.id, this.view.state.doc);
    const serializer = DOMSerializer.fromSchema(this.view.state.schema);
    const frag = serializer.serializeFragment(node.content);
    const wrapper = document.createElement("div");
    wrapper.appendChild(frag);
    return wrapper.innerHTML;
  }

  loadingStop() {
    const { state, dispatch } = this.view;

    const { pos: startPos, node } = getNodePosById(
      this.id,
      this.view.state.doc
    );

    const newNode = node.type.create(
      { ...node.attrs, loading: false },
      this.slice.content
    );

    const tr = state.tr.replaceWith(
      startPos, // début du contenu interne
      startPos + node.nodeSize, // fin du contenu interne
      newNode
    );
    tr.setMeta("secured", true);
    if (tr.docChanged) {
      dispatch(tr);
    }
    return true;
  }

  replace(html: string) {
    const { state, dispatch } = this.view;
    const schema = state.schema;

    const { pos: startPos, node } = getNodePosById(
      this.id,
      this.view.state.doc
    );

    const parser = ProseMirrorDOMParser.fromSchema(schema);
    const doc = new DOMParser().parseFromString(html, "text/html");
    const fragment = parser.parse(doc.body).content;

    if (!node || node.type.name !== "nodeArea") return false;

    const newNode = node.type.create(
      { ...node.attrs, loading: false },
      fragment
    );

    const tr = state.tr.replaceWith(
      startPos, // début du contenu interne
      startPos + node.nodeSize, // fin du contenu interne
      newNode
    );
    tr.setMeta("secured", true);
    if (tr.docChanged) {
      dispatch(tr);
    }
    return true;
  }

  clean() {
    const { state, dispatch } = this.view;
    const { pos: startPos, node } = getNodePosById(
      this.id,
      this.view.state.doc
    );

    const tr = state.tr;

    const addMark = state.schema.marks.addMark;
    const delMark = state.schema.marks.delMark;
    const editMark = state.schema.marks.editMark;

    if (node?.type.name === "nodeArea") {
      tr.removeMark(startPos, startPos + node.nodeSize, addMark);
      tr.removeMark(startPos, startPos + node.nodeSize, editMark);
    }

    //remove les marks del de la section.
    this.deleteMarkContent(tr, node, startPos, delMark);
    //   tr.removeMark(startPos, startPos + node.nodeSize, delMark); rm les balises
    tr.setMeta("secured", true);
    if (tr.docChanged) dispatch(tr);
  }

  destoy() {
    try {
      const { pos: startPos, node } = getNodePosById(
        this.id,
        this.view.state.doc
      );
      const { state, dispatch } = this.view;
      const tr = state.tr;

      if (!node || node.type.name !== "nodeArea") {
        console.warn("Pas de container ca peut etre OK et c'est OK. ");
        return undefined;
      }

      // créer un slice du contenu interne
      const slice = new Slice(node.content, 0, 0);

      // remplacer le node par son contenu
      tr.replaceRange(startPos, startPos + node.nodeSize, slice);
      tr.setMeta("secured", true);
      dispatch(tr);

      return { start: startPos, nodeSize: node.nodeSize - 2 };
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  getStartPos() {
    const { pos: startPos, node } = getNodePosById(
      this.id,
      this.view.state.doc
    );
    return { startPos: startPos, endPos: startPos + node.nodeSize };
  }

  private deleteMarkContent(
    tr: any,
    node: Node,
    posOffset: number,
    markType: MarkType
  ) {
    const toDelete: { from: number; to: number }[] = [];

    node.descendants((child, pos) => {
      if (child.isText && child.marks.some((m) => m.type === markType)) {
        const from = posOffset + pos + 1;
        const to = from + child.text!.length; // <-- utiliser text length pour être précis
        toDelete.push({ from, to });
      }
    });

    // Supprimer de la fin vers le début
    toDelete.sort((a, b) => b.from - a.from);

    toDelete.forEach(({ from, to }) => {
      tr.delete(from, to);
    });

    return tr;
  }
}

function getNodePosById(id: string, doc: Node): { node: Node; pos: number } {
  let found: { node: Node; pos: number } | null = null;

  doc.descendants((node, pos) => {
    if (!found && node.attrs.id === id) {
      found = { node, pos };
    }
    return !found;
  });
  if (found) return found;
  throw new Error("Id no Found....."); // { node, pos } ou null
}
