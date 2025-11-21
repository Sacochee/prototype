import switchPageFormat from '@/comps/editeur/commands/switchPageFormat'
import { useEditor } from '@/comps/editeur/Context'
import { setLockNodeAreaDeletion } from '@/comps/editeur/plugins/temporary/LockFullDelNodeArea'
import { setLockWhenLoading } from '@/comps/editeur/plugins/temporary/LockWhenLoading'
import styleFromCorrection from '../correction/style.module.css'
import { setWindowName, store, useAppDispatch } from '@/comps/store/store'
import React, { useEffect, useState } from 'react'
import { cleanIds } from '../utils/cleanIds'
import ArrowIcon from '@/comps/Icons/svg/ArrowIcon'
import PlanMap from './comps/planMap/PlanMap'
import style from './style.module.css'
import { TitleProps } from '@/types/plan/types'
import { createPortal } from 'react-dom'
import ConvertJson from './ConvertJson'
import EclairLoading from '@/comps/loading/eclairLoading/EclairLoading'



export default function PlanGenerator() {

    const { view } = useEditor()
    const [title, setTitle] = useState<TitleProps>({ titles: [] })
    const dispatch = useAppDispatch()
    const [popup, setPopup] = useState(false)

    const [loading, setLoading] = useState<string | undefined>(undefined)



    useEffect(() => {
        //init 
        switchPageFormat(view!, store, false)
        setLockNodeAreaDeletion(view!, true)
        setLockWhenLoading(view!, true)

        cleanIds(view!)

        return () => {
            setLockNodeAreaDeletion(view!, false)
            setLockWhenLoading(view!, false)
            switchPageFormat(view!, store, true)
        }

    }, [])


    useEffect(() => {
        const lst = ["Chargement", "Analyse du texte", "Extraction des titres", "Critique des résultats", "Classement des titres"]
        if (lst.includes(loading || "")) {
            const index = lst.indexOf(loading || "");
            if (index !== -1 && lst.length > index + 1) {
                const timeout = setTimeout(() => {
                    setLoading(lst[index + 1]);
                }, Math.random() * 5000 + 2000); // entre 1 et 3 secondes
                return () => clearTimeout(timeout);
            }
        }
    }, [
        loading
    ])

    const closeHandler = () => {
        dispatch(setWindowName(''))
    }


    const handlerAgent = async () => {
        //faire la fnc
        setLoading("Chargement")
        const documentString = new ConvertJson(view!.state.doc).getLst()

        const res = await fetch('/api/plan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // header correct
                'Accept': 'application/json'         // optionnel mais propre
            },
            body: JSON.stringify({ raw: documentString })
        })

        if (res.ok) {
            const { titles } = await res.json()
            setTitle(t => ({ ...t, titles: titles }))
        }
        setPopup(true)
        setLoading(undefined)
    }




    return (
        <div style={{ width: "330px" }} className={styleFromCorrection.global}>
            <div className={styleFromCorrection.topName}>
                Mise en forme texte
                <button onClick={closeHandler}>
                    <ArrowIcon orientation='left' height={9} color='#D41818' />
                    Fermer
                </button>
            </div>
            <div className={style.container}>
                {
                    loading ?
                        (<div className={style.loading}>

                            <EclairLoading />

                            <div>
                                {loading}
                            </div>
                        </div>) :
                        (<>
                            {title.titles.length > 0 ?
                                <button
                                    className={style.titles}
                                    onClick={() => setPopup(true)}>
                                    Afficher les titres</button> :
                                <button
                                    onClick={handlerAgent}
                                    className={style.gen}>
                                    Faire un plan de cours
                                </button>}
                        </>)
                }

            </div>
            {
                popup &&
                createPortal(
                    <div className={style.popupContainer} >
                        <PlanMap titles={title.titles} setTitles={setTitle} setPopup={setPopup} />
                    </div>, document.body)
            }
        </div >
    )
}

