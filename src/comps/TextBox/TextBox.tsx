import DefaultMarks from '@/comps/editeur/plugins/DefaultMarks';
import { decoPlugin } from '@/comps/editeur/plugins/dynamicDeco';
import KeyMap from '@/comps/editeur/plugins/KeyMap';
import schema from '@/comps/editeur/schemas/schema';
import { DOMParser as DOMParserProse, DOMSerializer, Node, Slice } from 'prosemirror-model';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import StylePlugin from './Plugins/StylePlugin';
import MaxHeightPlugin from './Plugins/MaxHeightPlugin';
import { cp } from 'fs';
import { BoldCommand, FontColorCommand, ItalicCommand } from '../editeur/commands';
import ItalicButton from '../header/MenuShort/Buttons/ItalicButton';


export type TextBoxHandle = {
    setContentHtml: (html: string) => void,
    setContent: (slice: Slice) => void,
    getDoc: () => Node | undefined,
    getDocDom: () => string | undefined,
    replaceDoc: (doc: Node) => void
    clear: () => void
}

export default function TextBox({ ref }: { ref: any }) {

    const editorRef = useRef<HTMLDivElement>(null);
    const [menu, setMenu] = useState(true)
    const view = useRef<EditorView | null>(null);

    useImperativeHandle(ref, () => {
        return {
            setContentHtml: (html: string) => {
                const parser = new DOMParser()
                const dom = parser.parseFromString(html, "text/html")
                const doc = DOMParserProse.fromSchema(schema).parse(dom.body)
                const newState = EditorState.create({
                    doc: doc,
                    schema: view.current!.state.schema,
                    plugins: view.current!.state.plugins,
                })
                view.current!.updateState(newState)
            },
            setContent: (slice: Slice) => {
                if (view.current) {
                    const { state, dispatch } = view.current;
                    const { doc, tr, schema } = state;
                    const end = doc.content.size;
                    const lastChar = end > 0 ? doc.textBetween(end - 1, end) : "";

                    // Ajouter un espace si le dernier caractère n’en est pas un
                    if (lastChar !== " ") {
                        tr.insertText(" ", end);
                    }

                    // Ajouter le slice à la fin
                    tr.replace(tr.doc.content.size, tr.doc.content.size, slice);

                    dispatch(tr);
                }
            },
            replaceDoc: (doc: Node) => {
                const newState = EditorState.create({
                    doc: doc,
                    schema: view.current!.state.schema,
                    plugins: view.current!.state.plugins,
                })
                view.current!.updateState(newState)
            },
            getDoc: () => {
                return view.current?.state.doc
            },
            getDocDom: () => {
                const fragment = DOMSerializer.fromSchema(schema).serializeFragment(view.current!.state.doc.content)
                const div = document.createElement("div")
                div.appendChild(fragment)
                return div.innerHTML
            }, clear: () => {
                const newState = EditorState.create({
                    schema: view.current!.state.schema,
                    plugins: view.current!.state.plugins,
                })
                view.current!.updateState(newState)
            }
        }
    }, [])

    useEffect(() => {
        if (view.current) return;
        view.current = new EditorView(editorRef.current, {
            state: EditorState.create({
                schema: schema,
                plugins: [
                    KeyMap,
                    ...DefaultMarks(schema),
                    decoPlugin,
                    StylePlugin(),
                    MaxHeightPlugin(400)
                ]
            }),
            // handleDOMEvents: {
            //     focus: () => {
            //         setMenu(true)
            //         return false; // allow default behavior
            //     },
            //     blur: () => {
            //         setMenu(false)
            //         return false;
            //     }
            // }
        })
    }, [])


    const boldHandler = () => {
        console.log("here")
        view.current?.dom.focus()
        BoldCommand(view.current!)
    }

    return (
        <div>
            <div>
                {/* {menu} */}
                {
                    menu ? <div onClick={(e)=>e.preventDefault()}>
                        <button onClick={boldHandler}>B</button>
                        <button onClick={() => ItalicCommand(view.current!)}>I</button>
                        <button onClick={() => FontColorCommand(view.current!, "red")}>Red</button>
                        <button onClick={() => FontColorCommand(view.current!, "green")}>green</button>
                        <button onClick={() => FontColorCommand(view.current!, "black")}>black</button>
                    </div> : <div></div>
                }
            </div>
            <div ref={editorRef} style={{
                boxShadow: "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
                borderRadius: "5px"
            }}>

            </div>
        </div>

    )
}
