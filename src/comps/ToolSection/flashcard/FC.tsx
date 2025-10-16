import ArrowIcon from '@/comps/Icons/svg/ArrowIcon'
import { setWindowName, store, useAppDispatch } from '@/comps/store/store'
import React, { FormEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import styleFromCorrection from '../correction/style.module.css'
import switchPageFormat from '@/comps/editeur/commands/switchPageFormat'
import { useEditor } from '@/comps/editeur/Context'
import TextBox, { TextBoxHandle } from '../../TextBox/TextBox'
import { DOMSerializer } from 'prosemirror-model'


export default function () {

    const { view } = useEditor()
    const dispatch = useAppDispatch()

    const question = useRef<TextBoxHandle>(null);
    const reponse = useRef<TextBoxHandle>(null);

    const [data, setData] = useState("")//TODO temp

    // Dev. 
    const [dir, setDir] = useState([] as string[])

    const switchQnR = useCallback(() => {
        const docQ = question.current!.getDoc()
        const docR = reponse.current!.getDoc()

        question.current!.replaceDoc(docR!)
        reponse.current!.replaceDoc(docQ!)
    }, [])

    useEffect(() => {
        //init 

        switchPageFormat(view!, store, false)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'q') {
                const { state } = view!
                if (state.selection.ranges.length === 0) return
                const { from, to } = state.selection
                const selectedText = state.doc.slice(from, to)
                question.current!.setContent(selectedText)
                e.preventDefault();
            }
            if (e.ctrlKey && e.key.toLowerCase() === 'r') {
                const { state } = view!
                if (state.selection.ranges.length === 0) return
                const { from, to } = state.selection
                const selectedText = state.doc.slice(from, to)
                reponse.current!.setContent(selectedText)
                e.preventDefault();
            }
        }


        window.addEventListener('keydown', handleKeyDown);

        return () => {
            switchPageFormat(view!, store, true)
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [])

    useEffect(() => {
        fetch('/api/flashcard').then(res => res.json()).then(json => {
            if (json.ok) {
                setDir(json.files)
            }
        })
    }, [])

    const closeHandler = () => {
        dispatch(setWindowName(''))
    }

    const handler = () => {
        const { from, to } = view!.state.selection
        const selectedText = view!.state.doc.slice(from, to)
        const fragment = DOMSerializer.fromSchema(view!.state.schema).serializeFragment(selectedText.content)
        const div = document.createElement("div")
        div.appendChild(fragment)
        setData(div.innerHTML)
    }

    const handlerForme = async () => {
        const body = {
            context: data,
            q: question.current!.getDocDom(),
            r: reponse.current!.getDocDom(),
        }

        const res = await fetch('/api/mep-flashcard', {
            method: 'POST',
            body: JSON.stringify(body)
        })

        const json = await res.json()

        console.log(json)
        if (json.ok) {
            reponse.current!.setContentHtml(json.r)
            question.current!.setContentHtml(json.q)
        }
    }
    const handlerApi = async () => {
        const body = {
            context: data,
            q: question.current!.getDocDom(),
            r: reponse.current!.getDocDom(),
        }

        const res = await fetch('/api/generate-flashcard', {
            method: 'POST',
            body: JSON.stringify(body)
        })

        const json = await res.json()

        console.log(json)
        if (json.ok) {
            reponse.current!.setContentHtml(json.r)
            question.current!.setContentHtml(json.q)
        }
    }

    const handlerSave = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        const form = new FormData(e.target as HTMLFormElement);
        const selectedDir = form.get('dir');

        const body = {
            dir: selectedDir,
            q: question.current!.getDocDom(),
            r: reponse.current!.getDocDom(),
        }

        fetch('/api/flashcard', {
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(json => {
            if (json.ok) {
                alert('Saved')
                question.current!.clear()
                reponse.current!.clear()
            } else {
                alert('Error: ' + json.error)
            }
        })
    }

    return (
        <div style={{ width: "330px" }} className={styleFromCorrection.global}>
            <div className={styleFromCorrection.topName}>
                Génération de flashcards
                <button onClick={closeHandler}>
                    <ArrowIcon orientation='left' height={9} color='#D41818' />
                    Fermer
                </button>
            </div>
            <div>
                <TextBox ref={question} />
                <div>
                    <button onClick={handlerApi}>regen</button>
                    <button onClick={switchQnR}>switch</button>
                    <button onClick={handlerForme}>forme</button>
                </div>
                <TextBox ref={reponse} />
                <button onClick={handler}></button>

                <form onSubmit={handlerSave}>
                    <select name="dir" id="" required>
                        {dir.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <button type='submit'>Save</button>
                </form>
            </div>
        </div>
    )
}
