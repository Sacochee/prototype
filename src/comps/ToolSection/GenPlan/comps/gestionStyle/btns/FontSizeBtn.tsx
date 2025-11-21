'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from '@/comps/header/MenuShort/Buttons/Template.module.css'
import { changeStyle, TitleStyleType, useAppDispatch } from '@/comps/store/store'
import HoverSpan from '@/comps/header/MenuShort/HoverSpan'
import PlatformKey from '@/comps/editeur/PlatformKey'


export default function ({ title }: { title: TitleStyleType }) {
    const dispatch = useAppDispatch()
    const valueSize = useCallback(() => title.style.fontSize.slice(0, -2), [title])
    const [deploy, setDeploy] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)

    const matcher = (value: number, str?: string): string => {
        if (str) {
            const base = parseInt(str) || 0;
            return (base + value).toString() + "pt";
        } else {
            return value.toString() + "pt";
        }
    };

    const handler = (c: -1 | 1) => {
        dispatch(changeStyle(
            { style: { fontSize: matcher(c, valueSize()) }, name: title.name }))
        //disptach
    }


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

    const handlerClic = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => { e.preventDefault(); setDeploy(s => !s) }

    const handlerFix = (size: number) => {
        //dispatch
        dispatch(changeStyle({ style: { fontSize: matcher(size) }, name: title.name }))
        setDeploy(false)
    }


    return (
        <div ref={containerRef} className={styles.fontSizeBtn}>
            <button onClick={() => handler(-1)}>−</button>
            <div onClick={handlerClic} className={styles.fontSizeInput} > {valueSize() ? valueSize() : "-"} </div>
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
