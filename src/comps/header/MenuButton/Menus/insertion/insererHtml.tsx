'use client'
import { useEditor } from '@/comps/editeur/Context'
import insertHtml from '@/comps/editeur/exec/insertHtml'
import BackgroundPopup from '@/comps/popup/BackgroundPopup'
import { init } from 'next/dist/compiled/webpack/webpack'
import { EditorView } from 'prosemirror-view'
import React, { useImperativeHandle, useState } from 'react'
import { createPortal } from 'react-dom'

export default function ({ ref }: { ref: React.RefObject<any> }) {
    const [deploy, setDeploy] = useState(false)
    const { view } = useEditor()


    const handlerForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const html = formData.get('html') as string
        if (html) {
            insertHtml(view as EditorView, html) // appelle ta fonction définie plus haut
        }
    }

    useImperativeHandle(ref, () => ({
        open: () => setDeploy(true)
    }), [])

    if (!deploy) return null;

    return createPortal(
        <BackgroundPopup>
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '10px',
                }}
            >
                <div
                    onClick={() => setDeploy(false)}
                >
                    close
                </div>
                <form onSubmit={handlerForm}>
                    <textarea style={{
                        width: '400px',
                        height: '300px',
                    }} name='html' />
                    <input type="submit" value="Insérer" />
                </form>

            </div>
        </BackgroundPopup>,
        document.body
    )
}
