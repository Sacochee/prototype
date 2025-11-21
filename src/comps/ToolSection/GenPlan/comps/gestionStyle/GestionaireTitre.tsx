import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import style from './style.module.css'
import { selectTitleStyleByTarget, useAppSelector } from "@/comps/store/store";
import { TitreStyle } from "@/types/plan/types";
import BoldBtn from "./btns/BoldBtn";
import UnderlineBtn from "./btns/UnderlineBtn";
import ItalicBtn from "./btns/ItalicBtn";
import FontSizeBtn from "./btns/FontSizeBtn";
import FontFamilyBtn from "./btns/FontFamilyBtn";
import ColorBtn from "./btns/ColorBtn";
import BackgroundColorBtn from "./btns/BackgroundColorBtn";
import ApplyStyleToTitle from "@/comps/editeur/commands/titles/ApplyStyleToTitle";
import { useEditor } from "@/comps/editeur/Context";

export default function ({ target, close }: { target: number | undefined, close: () => void }) {
    const { view } = useEditor()
    const [isVisible, setIsVisible] = useState(false)
    const [title, setTitle] = useState(1)
    const stylesTitles = useAppSelector(s => s.titleStyle)
    const oldStyleTitles = useRef(stylesTitles)
    const titreTarget = useAppSelector(selectTitleStyleByTarget(title))



    useEffect(() => {
        if (typeof target === "number") {
            if (target !== -1) setTitle(target)
            setIsVisible(true)
        } else setIsVisible(false)

    }, [target])

    const StyleBuilder = (style: TitreStyle): CSSProperties => ({
        color: style.color,
        backgroundColor: style.backgroundColor ? style.backgroundColor : "none",
        fontFamily: style.police,
        fontSize: style.fontSize,
        fontWeight: style.bold ? "bold" : "normal",
        fontStyle: style.italic ? "italic" : "normal",
        textDecoration: style.underline ? "underline" : "none"
    })

    const handlerDone = useCallback(() => {

        const updated = []

        for (let i = 0; i < oldStyleTitles.current.length; i++) {
            if (oldStyleTitles.current[i] !== stylesTitles[i]) {
                updated.push(i)
            }
        }

        for (const number of updated) {
            console.log(number, "item")
            ApplyStyleToTitle(view!, stylesTitles.find(item => item.target == number)!.style, number)
        }
        close()
    }, [stylesTitles])

    if (isVisible)
        return createPortal(
            <div className={style.bg}>
                {/* BG  */}
                <div className={style.main}>
                    {/* {popup} */}

                    <div className={style.nav}>
                        {/* Ne pas inclure DEfautl car c'est le style pour les non titres. */}
                        {stylesTitles.map(item => item.name !== "Default" && (<div onClick={() => setTitle(item.target)} className={`${item.target === title && style.active}`} key={item.name}  >
                            {item.name}
                        </div>))}
                    </div>
                    <div className={style.title}>
                        <div id="name">
                            {titreTarget!.name}
                        </div>
                        <div>
                            {/* Chiantttttt 
                                faire une barre d'édition + render. 
                            */}
                            <div id="menu">
                                <FontFamilyBtn title={titreTarget!} />
                                <FontSizeBtn title={titreTarget!} />
                                <span className={style.split}></span>
                                <BoldBtn title={titreTarget!} />
                                <UnderlineBtn title={titreTarget!} />
                                <ItalicBtn title={titreTarget!} />
                                <span className={style.split}></span>
                                <ColorBtn title={titreTarget!} />
                                <BackgroundColorBtn title={titreTarget!} />
                            </div>
                            <div style={StyleBuilder(titreTarget!.style)} id="exemple">
                                Ceci est un {titreTarget!.name}
                            </div>
                        </div>
                        <div>
                            <button disabled>
                                Réinitialiser
                            </button>
                            <button onClick={handlerDone}>
                                Terminé
                            </button>
                        </div>
                    </div>
                </div>
            </div>, document.body)
}