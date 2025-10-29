'use client'
import React from 'react'
import styles from './Menus.module.css'
import Template from './Template'
import { useEditor } from '@/comps/editeur/Context'
import schema from '@/comps/editeur/schemas/schema'
import { Transaction } from 'prosemirror-state'
import { defaultMarkdownSerializer } from "prosemirror-markdown";

export default function () {

  const { view } = useEditor()

  const handlerDownloadJson = () => {
    const data = view?.state.doc.toJSON();
    if (!data) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "FICHERSAVE.json";
    a.click();

    URL.revokeObjectURL(url);
  }

  const handlerDownloadMarkdown = () => {
  const doc = view?.state.doc;
  if (!doc) return;

  // Conversion du document ProseMirror → Markdown
  const markdown = defaultMarkdownSerializer.serialize(doc);

  // Création et téléchargement du fichier .md
  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "FICHERSAVE.md";
  a.click();

  URL.revokeObjectURL(url);
};

  const handlerOpenFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    //open a fileJSON et read it. 
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const json = JSON.parse(text);
        const tr: Transaction = view!.state.tr.replaceWith(
          0,
          view!.state.doc.content.size,
          schema.nodeFromJSON(json)
        );
        view!.dispatch(tr);
      } catch (err) {
        console.error("Invalid JSON", err);
      }
    };
    reader.readAsText(file);
  }
  return (
    <Template>
      <ul>
        <li>
          Importer un google docs
        </li>
        <li>
          Importer un ficher HTML.
        </li>
        <li onClick={handlerDownloadJson}>
          Télécharger le JSON.
        </li>
        <li onClick={handlerDownloadMarkdown}>
          Télécharger le md.
        </li>
        <li>
          <input type="file" accept="application/json" onChange={handlerOpenFile} />
        </li>
      </ul>
    </Template>
  )
}
