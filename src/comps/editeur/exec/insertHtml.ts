"use client";
import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";
import { useEditor } from "../Context";
import { EditorView } from "prosemirror-view";

export default function insertHtml(view: EditorView, html: string) {
  if (!view) return;

  const { state, dispatch } = view;
  const parser = ProseMirrorDOMParser.fromSchema(state.schema);

  // créer un fragment DOM à partir de la string
  const element = document.createElement("div");
  element.innerHTML = html;

  // parser le DOM en node prosemirror
  const slice = parser.parseSlice(element);

  // créer transaction pour insérer à la sélection
  const tr = state.tr.replaceSelection(slice);

  dispatch(tr.scrollIntoView());
}
