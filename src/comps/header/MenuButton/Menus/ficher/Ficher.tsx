'use client'
import React from 'react'
import styles from './Menus.module.css'
import Template from '../Template'
import { useEditor } from '@/comps/editeur/Context'
import schema from '@/comps/editeur/schemas/schema'
import { Transaction } from 'prosemirror-state'
import { defaultMarkdownSerializer } from "prosemirror-markdown";
import { DOMSerializer } from 'prosemirror-model'
import DocxParser from '@/comps/editeur/export/docx/DocxParser'
import * as mammoth from "mammoth";
import { DOMParser as PMDOMParser } from 'prosemirror-model'
import PreProcess from '@/comps/editeur/import/preprocess/PreProcess'
import LoadDocx from './LoadDocx'

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

  const handlerDownloadHTML = () => {
    const fragment = DOMSerializer.fromSchema(schema).serializeFragment(view!.state.doc.content);
    const wrapper = document.createElement("div");
    wrapper.appendChild(fragment);
    const htmlString = wrapper.innerHTML;

    const blob = new Blob([htmlString], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "SAVEHTML.html";
    a.click();

    URL.revokeObjectURL(url);
  }

  const handlerDownloadDocx = async () => {
    if (!view) return;

    try {
      // 1️⃣ Convertir ProseMirror en DOCX (Uint8Array)
      const arrayBuffer = await DocxParser(view.state.doc);

      // 2️⃣ Créer un blob DOCX
      const blob = new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // 3️⃣ Télécharger le fichier
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "document.docx";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur conversion DOCX:", err);
    }
  };

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    LoadDocx(e, view!)
  }

  return (
    <Template>
      <ul>
        <li onClick={handlerDownloadJson}>
          Télécharger le JSON.
        </li>
        <li onClick={handlerDownloadMarkdown}>
          Télécharger le md.
        </li>
        <li onClick={handlerDownloadHTML}>
          Télécharger le HTML
        </li>
        <li onClick={handlerDownloadDocx}>
          Télécharger le Docx
        </li>
        <li>
          <input type="file" accept="application/json" onChange={handlerOpenFile} />
        </li>
        <li>
          <input type="file" accept=".docx" onChange={handleFileChange} />
        </li>
      </ul>
    </Template>
  )
}
