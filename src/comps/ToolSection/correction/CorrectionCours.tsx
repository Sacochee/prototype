import React, { useEffect, useRef, useState } from 'react'
import One from '../comps/step/GetSelectionComps'
import Tow from './step/Tow'
import { useEditor } from '@/comps/editeur/Context'
import { useCorrection } from './Context'
import { EditorView } from 'prosemirror-view'
import chunkBorderClass from '../utils/chunkBorderClass'
import decompressHtml from '../utils/unCompressHtml'
import { cleanIds } from '../utils/cleanIds'
import cleanTemporaryNode from '../utils/CleanTempory'
import { TextSelection } from 'prosemirror-state'
import style from './style.module.css'
import ArrowIcon from '@/comps/Icons/svg/ArrowIcon'
import { Chunk, sliceToChunk } from '../utils/ChunkBuilder'
import { setLockNodeAreaDeletion } from '@/comps/editeur/plugins/temporary/LockFullDelNodeArea'
import { setLockWhenLoading } from '@/comps/editeur/plugins/temporary/LockWhenLoading'
import Three from '../comps/step/RequestGestionComps'
import { setMessage, setWindowName, store, useAppDispatch } from '@/comps/store/store'
import switchPageFormat from '@/comps/editeur/commands/switchPageFormat'

export default function CorrectionCours() {

    const { view } = useEditor()
    const [setting, setSetting] = useState(false)
    const [gen, setGen] = useState(false)
    const [genContent, setGenContent] = useState(true)

    const deco = useRef<chunkBorderClass>(null)
    const slice = useRef<Chunk>(null)

    const { correction, setCorrection } = useCorrection()
    const dispatch = useAppDispatch()

    const enable = useRef<boolean>(true)

    useEffect(() => {
        setLockNodeAreaDeletion(view!, true)
        setLockWhenLoading(view!, true)
        //set le format en mode sans page
        switchPageFormat(view!, store, false)

        return () => {
            setLockNodeAreaDeletion(view!, false)
            setLockWhenLoading(view!, false)

            //set le format en mode page.
            switchPageFormat(view!, store, true)

            deco.current?.clean();
            deco.current?.destoy();
        }
    }, [])

    const updateDeco = async (slice: Chunk) => {

        const newDeco = new chunkBorderClass(view as EditorView, slice.pos.startId, slice.pos.endId)

        deco.current = newDeco

        const res = await (await fetch('/api/correct', {
            method: "POST",
            body: JSON.stringify({ raw: slice.raw })
        })).json()

        const html = decompressHtml(res.res, slice.dictionnaire)

        newDeco.replace(html)
    }

    const handler1 = () => {
        cleanTemporaryNode(view!)
        const s = view?.state.selection
        if (s?.from != s?.to) {
            setCorrection(state => ({ ...state, selection: s }))
            setSetting(true)

            //reset la selection
            const cursor = TextSelection.create(view!.state.tr.doc, view!.state.selection.from);
            view!.dom.focus()
            view!.dispatch(view!.state.tr.setSelection(cursor).scrollIntoView());
            return true
        }
        else return false
    }

    const closeHandler = () => {
        dispatch(setWindowName(''))
    }

    const handler2 = async (next = true as boolean) => {
        if (enable.current) {
            enable.current = false
            //reset le switch. 
            setGenContent(true)

            //expérimentale
            cleanIds(view!)

            //si null = error si undef = vide
            deco.current?.clean();
            const haveDeco = deco.current?.destoy() || undefined;
            deco.current = null;
            let start = correction.selection?.from || 0, nodeSize = 0
            if (haveDeco) {
                start = haveDeco.start
                nodeSize = haveDeco.nodeSize
            }

            if (start === 0 && next === false) {
                dispatch(setMessage({ message: "ATTENTION : Il est impossible de trouver un texte avant celui-ci.", type: "error" }))
                enable.current = true
                return;
            }


            if ((start + nodeSize) >= (view!.state.doc.nodeSize - 2) && next == true) {
                dispatch(setMessage({ message: "ATTENTION : Il est impossible de trouver un texte après celui-ci.", type: "error" }))
                enable.current = true
                return;
            }

            slice.current = sliceToChunk(view!.state.doc, start, nodeSize, view!.state.schema, next, 2000)

            //set afficher le comps trois. 
            !gen && setGen(true)

            await updateDeco(slice.current)
            enable.current = true
        }
    }

    const nextHandler3 = () => { handler2(); setGenContent(true) }

    const backHandler3 = () => { handler2(false); setGenContent(true) }

    const reloadHandler3 = async (next = true as boolean) => {
        if (enable.current) {
            enable.current = false
            setGenContent(true)
            //expérimentale
            cleanIds(view!)

            //si null = error si undef = vide
            const haveDeco = deco.current?.destoy() || undefined;
            deco.current = null;
            let start = correction.selection?.from || 0, nodeSize = 0
            if (haveDeco) {
                start = haveDeco.start
                nodeSize = haveDeco.nodeSize
            }


            const slice = sliceToChunk(view!.state.doc, start, 0, view!.state.schema, next, 2000)

            //set afficher le comps trois. 
            !gen && setGen(true)

            await updateDeco(slice)
            enable.current = true
        }
    }

    const switchContent = () => {
        if (deco.current && slice.current && enable.current) {
            // doit siwtch to raw
            if (genContent) {
                slice.current = { ...slice.current, res: deco.current.getContent() }
                deco.current.replace(decompressHtml(slice.current.raw, slice.current.dictionnaire))
                setGenContent(false)
            }
            //Doit switch to response. 
            else {
                const safeContent = deco.current.getContent()
                deco.current.replace(slice.current?.res || safeContent)
                setGenContent(true)
            }
        } else dispatch(setMessage({ message: "ATTENTION : Impossible d'éffecter l'action. ", type: "error" }))

    }

    return (
        <div style={{ width: "330px" }} className={style.global}>
            <div className={style.topName}>
                Correction Texte
                <button onClick={closeHandler}>
                    <ArrowIcon orientation='left' height={9} color='#D41818' />
                    Fermer
                </button>
            </div>
            <div className={!setting ? style.forceCursorInitial : undefined}>
                <One nextHandler={handler1} open={() => {
                    deco.current?.destoy()
                    deco.current = null;
                    setCorrection(s => ({ ...s, selection: undefined }))
                    setGen(false)
                    setSetting(false)
                }} />
            </div>

            {setting && (
                <div className={!gen ? style.forceCursorInitial : undefined}><Tow nextHandler={handler2} open={() => {
                    deco.current?.destoy();
                    deco.current = null;
                    setGen(false)
                }} /></div>
            )}
            {gen &&
                (
                    <div className={style.forceCursorInitial}>
                        <Three
                            nextHandler={nextHandler3}
                            backHandler={backHandler3}
                            reloadHandler={reloadHandler3}
                            toggle={genContent}
                            switchHandler={switchContent}
                        />
                    </div>
                )
            }
        </div>
    )
}
