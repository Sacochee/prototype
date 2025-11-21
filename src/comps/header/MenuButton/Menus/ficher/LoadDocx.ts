"use client"
import PreProcess from "@/comps/editeur/import/preprocess/PreProcess";
import { DOMParser as PMDOMParser } from "prosemirror-model";
import { EditorView } from "prosemirror-view";

export default async function (
  e: React.ChangeEvent<HTMLInputElement>,
  view: EditorView
) {
  const schema = view.state.schema;
  const file = e.target.files?.[0];
  if (!file) return;

  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/convert", { method: "POST", body: form });
  const data = await res.json();

  const preDom = new DOMParser().parseFromString(data.html, "text/html");

  const dom = PreProcess(preDom);

  const doc = PMDOMParser.fromSchema(schema).parse(dom.body);

  view?.dispatch(
    view!.state.tr.replaceWith(0, view.state.doc.content.size, doc)
  );
  return true
}
