import React, { useEffect, useRef, useState } from 'react'
import styles from './Template.module.css'
import { useEditor } from '@/comps/editeur/Context'
import { EditorView } from 'prosemirror-view'
import { useAppSelector } from '@/comps/store/store'
import { LineHeightCommand, ToggleSpaceAfterNodeCommand, ToggleSpaceBeforeNodeCommand } from '@/comps/editeur/commands/EspacementInterligneCommand'

import Image from 'next/image'
import FonctionaliteIndisp from '@/comps/soon/FonctionaliteIndisp'
import HoverSpan from '../HoverSpan'

export default function () {
    const { view } = useEditor()
    const containerRef = useRef<HTMLDivElement>(null)
    const lineHeight = useAppSelector(s => s.data.lineHeight)
    const marginTop = useAppSelector(s => s.data.marginTop)
    const marginBottom = useAppSelector(s => s.data.marginBottom)
    const [deploy, setDeploy] = useState(false)
    const [perso, setPerso] = useState(false)
    const hoverRef = useRef<any>(null)

    const handler = () => {
        setDeploy(s => !s)
        view?.dom.focus()
        hoverRef.current.close();
    }

    const lineHeightCommand = (value: number) => {
        LineHeightCommand(view as EditorView, value);
        setDeploy(false);
        view?.dom.focus();
    }

    const handlerInterPerso = () => {
        setPerso(true)
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
        <div className={styles.hoverContainer}>
            <div ref={containerRef} className={styles.colorBtn}>
                <button onClick={handler}
                    className={`${styles.button} `}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        position: "relative"
                    }}
                    onMouseEnter={() => {
                        if (!deploy) hoverRef.current.open()
                    }}
                    onMouseLeave={() => hoverRef.current.close()}
                >
                    <Image
                        src={'/header/shortCutMenu/interligne.png'}
                        width={20}
                        height={20}
                        alt=''
                    />
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

                        <ul className={styles.interligne}>
                            <li onClick={() => lineHeightCommand(1)}> <Rond b={lineHeight == 1} /> Simple</li>
                            <li onClick={() => lineHeightCommand(1.15)}> <Rond b={lineHeight == 1.15} />1,15</li>
                            <li onClick={() => lineHeightCommand(1.5)}><Rond b={lineHeight == 1.5} />1,5</li>
                            <li onClick={() => lineHeightCommand(2)}><Rond b={lineHeight == 2} />Double</li>
                            <hr></hr>
                            <li onClick={() => ToggleSpaceBeforeNodeCommand(view as any)}>
                                {(marginTop == 0 || marginTop == undefined) ? "Insérer un " : "Supprimer l'"}espacement avant l’élément
                            </li>
                            <li onClick={() => ToggleSpaceAfterNodeCommand(view as any)}>
                                {(marginBottom == 0 || marginBottom == undefined) ? "Insérer un " : "Supprimer l'"}espacement après l’élément
                            </li>
                            <hr />
                            <li onClick={handlerInterPerso}><Rond b={false} />Interligne personnalisé</li>
                        </ul>


                    )
                }
                <FonctionaliteIndisp open={perso} onClose={() => { setPerso(false); setDeploy(false) }} />
            </div>
            <HoverSpan
                ref={hoverRef}
                txt='Interligne et espace entre les paragraphes'
            />
        </div>

    )
}


function Rond({ b }: { b: boolean }) {
    const style = {
        width: '5px',
        height: '5px',
        borderRadius: '5px',
    }

    if (b) Object.assign(style, { backgroundColor: 'var(--corporateBlue)' })

    return <div
        style={style}
    />
}