'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from '@/comps/header/MenuShort/Buttons/Template.module.css'
import { changeStyle, TitleStyleType, useAppDispatch } from '@/comps/store/store'
import HoverSpan from '@/comps/header/MenuShort/HoverSpan'
import fonts from '@/comps/editeur/FontsFamily.json'

export default function ({ title }: { title: TitleStyleType }) {
    const dispatch = useAppDispatch()
    const containerRef = useRef<HTMLDivElement>(null)
    const FontFamily = useCallback(() => title.style.police, [title])
    const [deploy, setDeploy] = useState(false)
    const hoverRef = useRef<any>(null)

    const handler = () => {
        setDeploy(true)

        hoverRef.current.close()
    }

    const handlerLi = (name: string) => {
        dispatch(changeStyle({ style: { police: name }, name: title.name }))
        setDeploy(false);
    }

    const NameOfFont = (font: string) => {
        for (const p of fonts) {
            if (p[1] === font)
                return p[0]
        }
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
                    {FontFamily() ? NameOfFont(FontFamily()) : "-"}
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
