import React, { useEffect, useRef, useState } from 'react'
import styles from './Template.module.css'
import Image from 'next/image'
import { FontFamilyCommand } from '@/comps/editeur/commands'
import { useEditor } from '@/comps/editeur/Context'
import { EditorView } from 'prosemirror-view'
import fonts from '@/comps/editeur/FontsFamily.json'
import { useAppSelector } from '@/comps/store/store'
import HoverSpan from '../HoverSpan'

export default function () {
    const { view } = useEditor()
    const containerRef = useRef<HTMLDivElement>(null)
    const FontFamily = useAppSelector(s => s.data.fontFamily)
    const [deploy, setDeploy] = useState(false)
    const hoverRef = useRef<any>(null)

    const handler = () => {
        setDeploy(true)
        view?.dom.focus()
        hoverRef.current.close()
    }

    const handlerLi = (name: string) => {
        FontFamilyCommand(view as EditorView, name)
        setDeploy(false);
        view?.dom.focus();
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

    return (
        <div ref={containerRef} className={styles.hoverContainer}>
            <button
                onClick={handler}
                className={`${styles.button} ${styles.fontBtn}`}
                style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'center'
                }}
                onMouseEnter={() => {
                    if (!deploy) hoverRef.current.open()
                }}
                onMouseLeave={() => hoverRef.current.close()}
            >
                <span className={styles.fontText}>
                    {FontFamily ? FontFamily : "-"}
                </span>

                <span style={{
                    // position: 'relative',
                    // top: '-2px',
                    width: 0,
                    height: 0,
                    display: 'inline-block',
                    borderLeft: `${8 / 2}px solid transparent`,
                    borderRight: `${8 / 2}px solid transparent`,
                    borderTop: `${(8 * Math.sqrt(3)) / 2}px solid ${"var(--corporateBlue)"}`,
                }}></span>

            </button>
            {
                deploy && (
                    <ul className={styles.fontFamilyList}>
                        {fonts.map(item =>
                        (<li
                            key={item[0]}
                            onClick={(e) => { e.stopPropagation(); handlerLi(item[1]) }}
                        > {item[0]}
                        </li>))}
                    </ul>
                )
            }
            <HoverSpan
                ref={hoverRef}
                txt='Police'
            />
        </div>

    )
}
