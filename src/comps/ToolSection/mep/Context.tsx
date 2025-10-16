import { Selection } from "prosemirror-state";
import React, { createContext, useContext, useState } from "react";


export type RulePrompt  = {
    id : string,
    desc : string,
    name : string, 
    miseEnForme:  string, 
    exemple : {input: string, output: string}[]
}

export type StateContext = {
      selection?:  Selection,
    prompt:  RulePrompt[]
};
// État initial
const initState : StateContext = {
    prompt  :[]
};
// Création du contexte
const MepContext = createContext<{
    MEP: typeof initState;
    setMEP: React.Dispatch<React.SetStateAction<typeof initState>>;
} | null>(null);

// Hook personnalisé
export function useMEP() {
    const context = useContext(MepContext);
    if (!context) {
        throw new Error(
            "useMep doit être utilisé à l'intérieur de MEPProvider"
        );
    }
    return context;
}

// Provider
export function MEPProvider({ children }: { children: React.ReactNode }) {
    const [MEP, setMEP] = useState(initState);

    return (
        <MepContext.Provider value={{ MEP, setMEP }}>
            {children}
        </MepContext.Provider>
    );
}
