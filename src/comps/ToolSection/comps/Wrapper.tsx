'use client'
import { useEditor } from '@/comps/editeur/Context';
import React, { useImperativeHandle, useState } from 'react'
import style from './style.module.css'

export default function Wrapper({
    children,
    title, callback, ref,
}: { children: React.ReactNode, title: string, callback: (() => void), ref?: React.RefObject<any> }) {
    const [deloy, setdeploy] = useState(true);
    const { view } = useEditor()

    useImperativeHandle(ref, () => ({
        close: () => setdeploy(false)
    }))

    return (
        <>
            <article
                className={`${style.head}`}
                onClick={() => { setdeploy(true); view?.dom.focus(); callback() }}>
                <div style={{ fontSize: '13pt', fontWeight:700 }}>
                    {title}
                </div>
            </article>
            <div style={{ margin: "10px 15px" }}>
                {deloy && children}
            </div>

        </>

    )
}
