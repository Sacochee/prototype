import React, { useEffect, useRef, useState } from 'react'
import styles from './Template.module.css'
import { useEditor } from '@/comps/editeur/Context'
import { EditorView } from 'prosemirror-view'
import fontsColor from '@/comps/editeur/fontsColors.json'
import { useAppSelector } from '@/comps/store/store'
import { FontColorCommand } from '@/comps/editeur/commands'
import { v4 as uuidv4 } from 'uuid'
import HoverSpan from '../HoverSpan'

export default function () {
    const { view } = useEditor()
    const containerRef = useRef<HTMLButtonElement>(null)
    const fontColor = useAppSelector(s => s.data.fontColor)
    const [deploy, setDeploy] = useState(false)
    const hoverRef = useRef<any>(null)

    const handler = () => {
        setDeploy(true)
        view?.dom.focus()
        hoverRef.current.close()
    }

    const handlerLi = (color: string) => {
        FontColorCommand(view as EditorView, color)
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
        <div className={styles.hoverContainer}>
            <button ref={containerRef} onClick={handler}
                className={`${styles.button} ${styles.colorBtn}`}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}
                onMouseEnter={() => {
                    if (!deploy) hoverRef.current.open();
                }}
                onMouseLeave={() => hoverRef.current.close()}
            >
                A
                <span
                    style={{
                        width: '20px',
                        height: '5px',
                        backgroundColor: fontColor
                    }}
                >
                    {/* Rectangle de la couteur selectonée */}
                </span>


                {
                    deploy && (
                        <div className={styles.fontColor}>
                            <ul className={styles.fontColorList}>
                                {fontsColor.map(item =>
                                (<li
                                    style={{ backgroundColor: item }}
                                    key={uuidv4()}
                                    onClick={(e) => { e.stopPropagation(); handlerLi(item) }}
                                >
                                </li>))}
                            </ul>
                        </div>

                    )
                }

            </button>
            <HoverSpan
                ref={hoverRef}
                txt='Couleur du texte'
            />
        </div>

    )
}
