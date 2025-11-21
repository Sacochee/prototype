'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from '@/comps/header/MenuShort/Buttons/Template.module.css'
import { changeStyle, TitleStyleType, useAppDispatch } from '@/comps/store/store'
import HoverSpan from '@/comps/header/MenuShort/HoverSpan'
import fontsColor from '@/comps/editeur/fontsColors.json'
import { v4 as uuidv4 } from 'uuid'


export default function ({ title }: { title: TitleStyleType }) {
    const dispatch = useAppDispatch()
    const containerRef = useRef<HTMLButtonElement>(null)
    const fontColor = useCallback(() => title.style.color, [title])
    const [deploy, setDeploy] = useState(false)
    const hoverRef = useRef<any>(null)

    const handler = () => {
        setDeploy(true)

        hoverRef.current.close()
    }

    const handlerLi = (color: string) => {
        dispatch(changeStyle({ style: { color }, name: title.name }))
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
                        backgroundColor: fontColor()
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
