// lib/EditorContext.tsx
"use client";
import { createContext, useContext, useState } from "react";

type data = {
  Correct: { raw: string, from: number, to: number },
  rawTitle: { raw: string, from: number, to: number },
  rawFormatted: { raw: string, from: number, to: number },
}

type DataCtx = {
  data: data | null;
  setData: (v: data | null) => void;
};

const DataContext = createContext<DataCtx | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<data | null>(null);
  return (
    <DataContext.Provider value={{ data, setData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be inside DAtaProvider");
  return ctx;
}
