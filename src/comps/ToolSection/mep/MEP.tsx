import ArrowIcon from '@/comps/Icons/svg/ArrowIcon'
import { setMessage, setWindowName, store, useAppDispatch } from '@/comps/store/store'
import React, { useEffect, useRef, useState } from 'react'
import styleFromCorrection from '../correction/style.module.css'
import switchPageFormat from '@/comps/editeur/commands/switchPageFormat'
import { useEditor } from '@/comps/editeur/Context'
import { setLockNodeAreaDeletion } from '@/comps/editeur/plugins/temporary/LockFullDelNodeArea'
import { setLockWhenLoading } from '@/comps/editeur/plugins/temporary/LockWhenLoading'
import chunkBorderClass from '../utils/chunkBorderClass'
import cleanTemporaryNode from '../utils/CleanTempory'
import { useMEP } from './Context'
import { EditorState, TextSelection } from 'prosemirror-state'

import Tow from './comps/Tow'
import { Chunk, sliceToChunk } from '../utils/ChunkBuilder'
import { EditorView } from 'prosemirror-view'
import decompressHtml from './utils/unCompressHtmlWihtoutStyle'
import decompressHtmlStyle from './utils/unCompressHhtmlStyle'
import GetSelectionComps from '../comps/step/GetSelectionComps'
import RequestGestionComps from '../comps/step/RequestGestionComps'
import { cleanIds } from '../utils/cleanIds'
import ApplyDefs from './utils/ApplyRules/ApplyDefs'
import ApplyEnonce from './utils/ApplyRules/ApplyEnonce'
import ApplyExemple from './utils/ApplyRules/ApplyExemple'
import ApplyQuestion from './utils/ApplyRules/ApplyQuestion'
import ApplyAuteur from './utils/ApplyRules/ApplyAuteur'
import ApplyDate from './utils/ApplyRules/ApplyDate'
import ApplyNotion from './utils/ApplyRules/ApplyNotion'
import ApplyCle from './utils/ApplyRules/ApplyCle'

export default function () {

    const CHUNK_SIZE = 10_000

    const { view } = useEditor()
    const dispatch = useAppDispatch()
    const [setting, setSetting] = useState(false)
    const [gen, setGen] = useState(false)
    const { MEP, setMEP } = useMEP();
    const [genContent, setGenContent] = useState(true)

    const slice = useRef<Chunk>(null)
    const enable = useRef(true)
    const deco = useRef<chunkBorderClass>(null)

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

    const handler1 = () => {
        cleanTemporaryNode(view!)
        const s = view?.state.selection
        if (s?.from != s?.to) {
            setMEP(state => ({ ...state, selection: s }))
            setSetting(true)

            //reset la selection
            const cursor = TextSelection.create(view!.state.tr.doc, view!.state.selection.from);
            view!.dom.focus()
            view!.dispatch(view!.state.tr.setSelection(cursor).scrollIntoView());
            return true
        }
        else return false
    }

    const updateDeco = async (slice: Chunk) => {

        const newDeco = new chunkBorderClass(view as EditorView, slice.pos.startId, slice.pos.endId)

        deco.current = newDeco

        const raw = decompressHtmlStyle(slice.raw, slice.dictionnaire)

        const res = (await (await fetch('/api/mep', {
            method: "POST",
            body: JSON.stringify({ raw }),
            headers: {
                "Content-Type": "application/json",
            }
        })).json())

        console.log(res)
        //faire un undo. a la place d'un replace faire les deux. 
        newDeco.loadingStop()
        const { startPos: from, endPos: to } = newDeco.getStartPos()

        const { state, dispatch } = view!;
        let tr = state.tr; // une seule transaction
        
        tr = ApplyDate(view!, res.date, from, to, tr)
        tr = ApplyDefs(view!, res.def, from, to, tr)
        tr = ApplyEnonce(view!, res.enonce, from, to, tr)
        tr = ApplyExemple(view!, res.exemple, from, to, tr)
        tr = ApplyQuestion(view!, res.question, from, to, tr)
        tr = ApplyAuteur(view!, res.auteur, from, to, tr)
        tr = ApplyNotion(view!, res.notion, from, to, tr)
        tr = ApplyCle(view!, res.cle, from, to, tr)


        if (tr.docChanged) dispatch(tr);


    }
    const handler2 = async (next = true as boolean) => {
        if (enable.current) {
            enable.current = false
            //reset le switch. 
            setGenContent(true)

            // expérimentale
            cleanIds(view!)

            //si deco.current null = error si undef = vide
            deco.current?.clean();
            const haveDeco = deco.current?.destoy() || undefined;
            deco.current = null;
            let start = MEP.selection?.from || 0, nodeSize = 0
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

            console.log(start, nodeSize, "eheh")

            slice.current = sliceToChunk(view!.state.doc, start, nodeSize, view!.state.schema, next, CHUNK_SIZE)

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
            let start = MEP.selection?.from || 0, nodeSize = 0
            if (haveDeco) {
                start = haveDeco.start
                nodeSize = haveDeco.nodeSize
            }


            const slice = sliceToChunk(view!.state.doc, start, 0, view!.state.schema, next, CHUNK_SIZE)

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
        <div style={{ width: "330px" }} className={styleFromCorrection.global}>
            <div className={styleFromCorrection.topName}>
                Mise en forme texte
                <button onClick={closeHandler}>
                    <ArrowIcon orientation='left' height={9} color='#D41818' />
                    Fermer
                </button>
            </div>
            <div className={!setting ? styleFromCorrection.forceCursorInitial : undefined}>
                <GetSelectionComps nextHandler={handler1} open={() => {
                    deco.current?.destoy()
                    deco.current = null;
                    setMEP(s => ({ ...s, selection: undefined }))
                    setGen(false)
                    setSetting(false)
                }}
                />
            </div>

            {setting && (
                <div className={!gen ? styleFromCorrection.forceCursorInitial : undefined}><Tow nextHandler={handler2} open={() => {
                    deco.current?.destoy();
                    deco.current = null;
                    setGen(false)
                }} /></div>
            )}
            {gen &&
                (
                    <div className={styleFromCorrection.forceCursorInitial}>
                        <RequestGestionComps
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
