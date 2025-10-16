// lib/EditorContext.tsx
"use client";
import { createContext, useContext, useState } from "react";
import type { EditorView } from "prosemirror-view";

type EditorCtx = {
  view: EditorView | null;
  setView: (v: EditorView | null) => void;
};

const EditorContext = createContext<EditorCtx | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<EditorView | null>(null);
  return (
    <EditorContext.Provider value={{ view, setView }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor must be inside EditorProvider");
  return ctx;
}
