import React, { useEffect, useRef, useState } from 'react'
import styles from './Template.module.css'
import { useEditor } from '@/comps/editeur/Context'
import { EditorView } from 'prosemirror-view'
import fontsColor from '@/comps/editeur/fontsColors.json'
import { useAppSelector } from '@/comps/store/store'
import { enumTextAlign, TextAlignCommand } from '@/comps/editeur/commands/AlignText'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'
import HoverSpan from '../HoverSpan'
import PlatformKey from '@/comps/editeur/PlatformKey'

export default function () {
    const { view } = useEditor()
    const containerRef = useRef<HTMLDivElement>(null)
    const textAlign = useAppSelector(s => s.data.textAlign)
    const [deploy, setDeploy] = useState(false)
    const hoverRef = useRef<any>(null);
    const justifyRef = useRef<any>(null);
    const endRef = useRef<any>(null);
    const centerRef = useRef<any>(null);
    const startRef = useRef<any>(null);


    const handler = () => {
        setDeploy(s => !s)
        view?.dom.focus()
        hoverRef.current.close();
    }

    const handlerLi = (position: enumTextAlign) => {
        console.log(position)
        TextAlignCommand(view as EditorView, position);
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
            <div ref={containerRef} className={styles.colorBtn}>
                <button onClick={handler}
                    onMouseEnter={() => { if (!deploy) hoverRef.current.open() }}
                    onMouseLeave={() => hoverRef.current.close()}
                    className={`${styles.button} `}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        position: "relative"
                    }}
                >
                    <Image
                        src={`/header/shortCutMenu/Text-${textAlign ? textAlign : "start"}.svg`}
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

                        <ul className={styles.textAlignUl} style={{zIndex:9}}>
                            <li className={`${textAlign === 'start' ? styles.TextAlignActive : undefined} ${styles.hoverContainer}`}
                                onClick={() => { handlerLi("start"); startRef.current.open() }}
                                onMouseEnter={() => startRef.current.open()}
                                onMouseLeave={() => startRef.current.close()}
                            >
                                <Image
                                    src={'/header/shortCutMenu/Text-start.svg'}
                                    width={20}
                                    height={20}
                                    alt=''
                                />
                                <HoverSpan
                                    ref={startRef}
                                    txt={`Aligner à gauche (${PlatformKey('Mod')}+${PlatformKey('Shift')}+L)`}
                                />
                            </li>
                            <li className={`${textAlign === 'center' ? styles.TextAlignActive : undefined} ${styles.hoverContainer}`}
                                onClick={() => { handlerLi("center"); centerRef.current.open() }}
                                onMouseEnter={() => centerRef.current.open()}
                                onMouseLeave={() => centerRef.current.close()}
                            >
                                <Image
                                    src={'/header/shortCutMenu/Text-center.svg'}
                                    width={20}
                                    height={20}
                                    alt=''
                                />
                                <HoverSpan
                                    ref={centerRef}
                                    txt={`Aligner au centre (${PlatformKey('Mod')}+${PlatformKey('Shift')}+E)`}
                                />
                            </li>
                            <li className={
                                `${textAlign === 'end' ? styles.TextAlignActive : undefined} ${styles.hoverContainer}`
                            }
                                onClick={() => { handlerLi("end"); endRef.current.close() }}
                                onMouseEnter={() => endRef.current.open()}
                                onMouseLeave={() => endRef.current.close()}
                            >
                                <Image
                                    src={'/header/shortCutMenu/Text-end.svg'}
                                    width={20}
                                    height={20}
                                    alt=''
                                />
                                <HoverSpan
                                    ref={endRef}
                                    txt={`Aligner à droit (${PlatformKey('Mod')}+${PlatformKey('Shift')}+R)`}
                                />
                            </li>
                            <li className={
                                `${textAlign === 'justify' ? styles.TextAlignActive : ''} ${styles.hoverContainer}`
                            }
                                onClick={() => { handlerLi("justify"); justifyRef.current.close() }}
                                onMouseEnter={() => justifyRef.current.open()}
                                onMouseLeave={() => justifyRef.current.close()}
                            >
                                <Image
                                    src={'/header/shortCutMenu/Text-justify.svg'}
                                    width={20}
                                    height={20}
                                    alt=''
                                />
                                <HoverSpan
                                    ref={justifyRef}
                                    txt={`Justifier (${PlatformKey('Mod')}+${PlatformKey('Shift')}+J)`}
                                />
                            </li>
                        </ul>


                    )
                }
            </div>
            <HoverSpan
                ref={hoverRef}
                txt='Aligner le texte'
            />
        </div>

    )
}
