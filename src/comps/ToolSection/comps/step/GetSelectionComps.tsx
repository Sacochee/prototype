import React, { useEffect, useRef, useState } from 'react'
import Wrapper from '../Wrapper'
import { useEditor } from '@/comps/editeur/Context'
import AllIcon from '@/comps/Icons/svg/AllIcon'
import Button from '../../correction/comps/Button'
import style from './steps.module.css'
import { toggleSelectionPlugin } from '@/comps/editeur/plugins/SelectionGetter'
import { useAppSelector } from '@/comps/store/store'
import { TextSelection } from 'prosemirror-state'

export default function ({ nextHandler, open }: { nextHandler: () => boolean, open: () => void}) {

    const { view } = useEditor()
    const [select, setSelect] =  useState(false)
    const wraper = useRef<any>(null)

    const selection = useAppSelector(s => s.data.selection)

    const handler = () => {
        if (nextHandler()) wraper.current.close();
        else undefined//error 
    }
    //Stream de la selection
    useEffect(() => {
        toggleSelectionPlugin(view!, true)
        return () => toggleSelectionPlugin(view!, false)
    }, [])

    useEffect(() => {
        if (selection && selection.from != selection.to && selection.from + 10 < selection.to)
            setSelect(true)
        else
            setSelect(false)
    }, [selection])

    //off
    // const showHandler = () => {
    //     if (correction.selection) {
    //         const { state } = view!;

    //         let tr = state.tr;
    //         view?.dom.focus()
    //         tr = tr.setSelection(TextSelection.create(state.doc, correction.selection.from, correction.selection.to));
    //         view!.dispatch(tr.scrollIntoView());
    //     }
    // }

    const selectAllHandler = () => {
        const { dispatch } = view!
        const { doc, tr } = view!.state;
        const selection = TextSelection.create(doc, 0, doc.content.size);

        if (dispatch) {
            dispatch(tr.setSelection(selection).scrollIntoView());
        }

        handler()

    }

    return (
        <Wrapper title='1. Selection' ref={wraper} callback={open}>
            <div>
                <div>
                    Sélectionner où commencer
                </div>
                <div className={style.show}>
                    {select ? (
                        <div>
                            {(selection?.to || 0)  - (selection?.from || 0) } caractères selectionnés
                        </div>
                    ) : (
                        <div>
                            Pas de texte selectionné
                        </div>
                    )}

                </div>
                <div className={style.OneBtns}>
                    <button onClick={selectAllHandler} className={style.all}>Selectionner tout <AllIcon height={15} weight={4} color='#001429' /> </button>
                    <Button onClick={handler} disabled={!select} />
                </div>
            </div>
        </Wrapper>
    )
}
