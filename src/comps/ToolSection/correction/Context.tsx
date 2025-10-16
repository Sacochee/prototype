import { Selection } from "prosemirror-state";
import React, { createContext, useContext, useState } from "react";


export type promptSettings = {
    orthographe: boolean;
    grammaire: boolean;
    syntaxe: boolean;
    ponctuation: boolean;
    langue: string;
};
// État initial
const initState = {
    selection: undefined as undefined | Selection,
    prompt: undefined as undefined | promptSettings
};

// Création du contexte
const CorrectionContext = createContext<{
    correction: typeof initState;
    setCorrection: React.Dispatch<React.SetStateAction<typeof initState>>;
} | null>(null);

// Hook personnalisé
export function useCorrection() {
    const context = useContext(CorrectionContext);
    if (!context) {
        throw new Error(
            "useCorrection doit être utilisé à l'intérieur de CorrectionProvider"
        );
    }
    return context;
}

// Provider
export function CorrectionProvider({ children }: { children: React.ReactNode }) {
    const [correction, setCorrection] = useState(initState);

    return (
        <CorrectionContext.Provider value={{ correction, setCorrection }}>
            {children}
        </CorrectionContext.Provider>
    );
}
