'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from '@/comps/header/MenuShort/Buttons/Template.module.css'
import { changeStyle, TitleStyleType, useAppDispatch } from '@/comps/store/store'
import HoverSpan from '@/comps/header/MenuShort/HoverSpan'
import fontsColor from '@/comps/editeur/fontsColors.json'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'


export default function ({ title }: { title: TitleStyleType }) {
    const dispatch = useAppDispatch()
    const containerRef = useRef<HTMLDivElement>(null)
    const hoverRef = useRef<any>(null)
    const BgColor = useCallback(() => title.style.backgroundColor, [title])
    const [deploy, setDeploy] = useState(false)

    const handler = () => {
        setDeploy(true)
        hoverRef.current.close()
    }

    const handlerLi = (color: string | undefined) => {
        dispatch(changeStyle({ style: { backgroundColor: color || 'transparent' }, name: title.name }))
        setDeploy(false);
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
                        flexDirection: 'column'
                    }}
                    onMouseEnter={() => {
                        if (!deploy) hoverRef.current.open()
                    }}
                    onMouseLeave={() => hoverRef.current.close()}
                >
                    S
                    <span
                        style={{
                            width: '20px',
                            height: '5px',
                            backgroundColor: BgColor()
                        }}
                    >
                        {/* Rectangle de la couteur selectonée */}
                    </span>

                </button>
                {
                    deploy && (
                        <div className={styles.fontColor}>
                            <button
                                onClick={(e) => { e.stopPropagation(); handlerLi(undefined) }}
                            >
                                <Image
                                    src={"/header/shortCutMenu/hightlight.png"}
                                    width={10}
                                    height={10}
                                    alt=''
                                />
                                Aucune
                            </button>

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
            </div>
            <HoverSpan
                ref={hoverRef}
                txt='Couleur de Surlignage'
            />
        </div>

    )
}
