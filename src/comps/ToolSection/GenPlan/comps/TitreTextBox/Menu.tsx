import { EditorView } from "prosemirror-view";
import style from './style.module.css'
import SelectCustom from "./SelectCustom";
import { PlanTitle } from "@/types/plan/types";
import ClassNameMerge from "@/utils/css/ClassNameMerge";
import GestionaireTitre from "../gestionStyle/GestionaireTitre";
import { useState } from "react";

type Props = { 
    ref: React.RefObject<EditorView>, 
    title: PlanTitle, 
    changeTitleLevel: (lvl: number | null) => void, 
    delTitle: (args0: string) => void
 }
export default function ({ ref, title, changeTitleLevel, delTitle }: Props) {

    const [target, setTarget] = useState<number | undefined>(undefined)

    const delButtonHandler = () => {
        console.log(title.titre)
        delTitle(title.id)
    }

    const styleHandler = () => {
        setTarget(title.level || -1)
    }

    return (
        <div onMouseDown={(e) => e.preventDefault()} onClick={() => ref.current.dom.focus()} className={ClassNameMerge([style.menu])}>
            <SelectCustom title={title} setLvl={changeTitleLevel} />
            <div>
                <button className={style.edit} onClick={styleHandler}>
                    Modfier le style
                </button>
            </div>
            <div className={style.del} style={{ position: "relative" }}>
                <button onClick={delButtonHandler}>
                    <span></span>
                </button>
            </div>
            <GestionaireTitre target={target} close={() => setTarget(undefined)} />
        </div>)
}