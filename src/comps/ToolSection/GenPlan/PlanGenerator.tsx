import switchPageFormat from '@/comps/editeur/commands/switchPageFormat'
import { useEditor } from '@/comps/editeur/Context'
import { setLockNodeAreaDeletion } from '@/comps/editeur/plugins/temporary/LockFullDelNodeArea'
import { setLockWhenLoading } from '@/comps/editeur/plugins/temporary/LockWhenLoading'
import styleFromCorrection from '../correction/style.module.css'
import { setWindowName, store, useAppDispatch } from '@/comps/store/store'
import React, { useEffect, useRef, useState } from 'react'
import { cleanIds } from '../utils/cleanIds'
import chunkBorderClass from '../utils/chunkBorderClass'
import ArrowIcon from '@/comps/Icons/svg/ArrowIcon'
import GetSelectionComps from '../comps/step/GetSelectionComps'
import { Selection, TextSelection } from 'prosemirror-state'
import cleanTemporaryNode from '../utils/CleanTempory'
import { Chunk, sliceToChunk } from '../utils/ChunkBuilder'
import { EditorView } from 'prosemirror-view'
import decompressHtmlStyle from '../mep/utils/unCompressHhtmlStyle'
import PlanMap from './comps/planMap/PlanMap'
import { CleanHtmlString } from './Utils'
import { constrainedMemory } from 'process'
import ApplyNode from './comps/ApplyNode'

export type Title =
    {
        titre: string, level?: number,
        id: string
    }

export type TitleProps = {
    selection?: Selection, titles: Title[]
}

export default function PlanGenerator() {

    const { view } = useEditor()
    const deco = useRef<chunkBorderClass>(null)
    const running = useRef<boolean>(false)
    const [title, setTitle] = useState<TitleProps>({ titles: [] })
    const dispatch = useAppDispatch()
    const [gen, setGen] = useState(false)

    const slice = useRef<any>(null)

    useEffect(() => {
        //init 
        switchPageFormat(view!, store, false)
        setLockNodeAreaDeletion(view!, true)
        setLockWhenLoading(view!, true)

        cleanIds(view!)

        return () => {
            setLockNodeAreaDeletion(view!, false)
            setLockWhenLoading(view!, false)

            deco.current?.clean();
            deco.current?.destoy();

            switchPageFormat(view!, store, true)
        }

    }, [])

    const closeHandler = () => {
        dispatch(setWindowName(''))
    }

    useEffect(() => {
        console.log(title.titles)
    }, [title.titles])


    const updateDeco = async (slice: Chunk) => {

        const newDeco = new chunkBorderClass(view as EditorView, slice.pos.startId, slice.pos.endId)

        deco.current = newDeco

        //condense le html en 
        const raw = CleanHtmlString(slice.raw)

        const res = await (await fetch('/api/plan', {
            method: "POST",
            body: JSON.stringify({ chunk: raw })
        })).json()


        if (res.status === "ok") {
            if (res.titles.length > 0) {
                const titles = res.titles.map((item: { titre: string, id: string }) => ({
                    id: slice.dictionnaire[item.id], titre: item.titre
                }))
                setTitle(s => ({ ...s, titles: [...s.titles, ...titles] }))
            }
            newDeco.loadingStop()
            running.current = false
            handler2()
        }


    }

    const handler2 = async () => {
        if (!running.current) {
            running.current = true



            //expérimentale
            // cleanIds(view!)

            //si deco.current null = error si undef = vide
            deco.current?.clean();
            const haveDeco = deco.current?.destoy() || undefined;
            deco.current = null;
            let start = title.selection?.from || 0, nodeSize = 0
            if (haveDeco) {
                start = haveDeco.start
                nodeSize = haveDeco.nodeSize
            }

            if ((start + nodeSize) >= (view!.state.doc.nodeSize - 2)) {
                //passe 2. 
                running.current = false
                return;
            }

            slice.current = sliceToChunk(view!.state.doc, start, nodeSize, view!.state.schema, true, 5000)

            //set afficher le comps trois. 
            !gen && setGen(true)

            await updateDeco(slice.current)
            running.current = false
        }
    }

    const handler1 = () => {
        cleanTemporaryNode(view!)
        const s = view?.state.selection
        if (s?.from != s?.to) {
            setTitle(state => ({ ...state, selection: s }))
            setGen(true)

            //reset la selection
            const cursor = TextSelection.create(view!.state.tr.doc, view!.state.selection.from);
            view!.dom.focus()
            view!.dispatch(view!.state.tr.setSelection(cursor).scrollIntoView());



            return true
        }
        else return false
    }

    const handlerClass = async () => {
        const res = await fetch('/api/plan/ordered', {
            method: "POST",
            body: JSON.stringify({ titles: title.titles })
        })

        const json = await res.json()
        console.log(json, "json respspp")
        if (json.status === "ok") {

            setTitle(s => ({ ...s, titles: json.res }))
        }
    }

    const handlerApply = () => {
        const { state, dispatch } = view!;
        let tr = state.tr; // une seule transaction

        for (const t of title.titles) {
            tr = ApplyNode(t, state, tr) || tr;
        }

        if (tr.docChanged) dispatch(tr);
    };

    return (
        <div style={{ width: "330px" }} className={styleFromCorrection.global}>
            <div className={styleFromCorrection.topName}>
                Mise en forme texte
                <button onClick={closeHandler}>
                    <ArrowIcon orientation='left' height={9} color='#D41818' />
                    Fermer
                </button>
            </div>
            <div className={!gen ? styleFromCorrection.forceCursorInitial : undefined}>
                <GetSelectionComps nextHandler={handler1} open={() => {
                    deco.current?.destoy()
                    deco.current = null;
                    setTitle(s => ({ ...s, selection: undefined }))
                    setGen(false)
                }}

                />
            </div>
            <button onClick={handler2}>handler2</button>
            <button onClick={handlerClass}>class</button>
            <button onClick={handlerApply}>Apply</button>
            {gen &&
                (
                    <div className={styleFromCorrection.forceCursorInitial}>
                        {title.titles.length > 0 && (
                            <PlanMap titles={title.titles} setTitles={setTitle} />
                        )}
                    </div>
                )
            }
        </div>
    )
}

// //TODO mv
// function getPrompt(txt: string) {
//     return (
//         `
// Tu es un extracteur et correcteur de titres pour cours et documents académiques.

// Tâche :
// - Lire attentivement le texte fourni.
// - Identifier uniquement les véritables titres ou sous-titres (chapitre, partie, section, sous-section, article, paragraphe).
// - Organiser les titres hiérarchiquement en balises HTML <h1> à <h6>.
// - Harmoniser la numérotation au sein d’un même niveau (ex. mélange de "I.", "1)", "2°", "A)" → tous convertis dans un seul style cohérent).
// - Corriger les titres mal notés ou mal orthographiés (ex. "chapitr" → "Chapitre", "Secion" → "Section") tout en gardant le sens.
// - Ne pas inventer de titres inexistants.



// Consignes :
// - H1 = niveau principal (ex. Partie, Titre, Chapitre).
// - H2 = sous-niveaux (ex. Section, Article).
// - H3 → H6 pour subdivisions plus fines.
// - Conserver le texte original des titres, sauf correction orthographique ou régularisation du préfixe.
// - Réponse = uniquement du HTML valide avec les balises <h1>…<h6>.

// Texte du cours :
// ${txt}
// `)
// }