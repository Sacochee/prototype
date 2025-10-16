'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from './Template.module.css'
import { FontSizeCommand } from '@/comps/editeur/commands'

import { useAppSelector } from '@/comps/store/store'
import { useEditor } from '@/comps/editeur/Context'
import { EditorView } from 'prosemirror-view'

export default function () {
    const { view } = useEditor()
    const [value, setValue] = useState<number | undefined>(undefined)
    const [deploy, setDeploy] = useState(false)
    const valueStore = useAppSelector(s => s.data.fontSize)
    const containerRef = useRef<HTMLDivElement>(null)

    const handler = (c: -1 | 1) => {
        view?.dom.focus()
        FontSizeCommand(view as EditorView, c, value)
    }

    useEffect(() => {
        if (valueStore != value && valueStore !== null) {
            setValue(valueStore)
        }
    }, [valueStore, value])

    // useEffect(() => {
    //     const handleKey = (e: KeyboardEvent) => {
    //         e.preventDefault();

    //         console.log(e.key);
    //     };

    //     if (deploy) {
    //         document.addEventListener("keydown", handleKey);
    //     }

    //     return () => {
    //         document.removeEventListener("keydown", handleKey);
    //     };
    // }, [deploy]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setDeploy(false)
            }
        }
        if (deploy) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [deploy])

    const handlerClic = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        e.preventDefault()
        view?.dom.focus()
        setDeploy(s => !s)
    }

    const handlerFix = (size: number) => {
        view?.dom.focus()
        FontSizeCommand(view as EditorView, size)
        setDeploy(false)
    }


    return (
        <div ref={containerRef} className={styles.fontSizeBtn}>
            <button onClick={() => handler(-1)}>−</button>
            <div onClick={handlerClic} className={styles.fontSizeInput} > {value ? value : "-"} </div>
            {deploy && <ul className={styles.fontSizeList}>
                <li onClick={() => handlerFix(8)}>8</li>
                <li onClick={() => handlerFix(9)}>9</li>
                <li onClick={() => handlerFix(10)}>10</li>
                <li onClick={() => handlerFix(11)}>11</li>
                <li onClick={() => handlerFix(12)}>12</li>
                <li onClick={() => handlerFix(14)}>14</li>
                <li onClick={() => handlerFix(18)}>18</li>
                <li onClick={() => handlerFix(24)}>24</li>
                <li onClick={() => handlerFix(30)}>30</li>
                <li onClick={() => handlerFix(36)}>36</li>
                <li onClick={() => handlerFix(48)}>48</li>
                <li onClick={() => handlerFix(60)}>60</li>
                <li onClick={() => handlerFix(72)}>72</li>
                <li onClick={() => handlerFix(96)}>96</li>
            </ul>}
            <button onClick={() => handler(+1)}>+</button>
        </div>
    )
}
