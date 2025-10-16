import { EditorView } from "prosemirror-view";
import { togglePagePlugin } from "../plugins/PagesBreak";
import { Store } from "@reduxjs/toolkit";
import { RootState, setPages } from "@/comps/store/store";

export default function (editorView: EditorView, store: Store<RootState>, toogle?:boolean) {
    // prend le parms ou l'inverse du state actuel. 
  const pages = toogle || !store.getState().data.pages;
  store.dispatch(setPages(pages));
  togglePagePlugin(editorView, pages);
}