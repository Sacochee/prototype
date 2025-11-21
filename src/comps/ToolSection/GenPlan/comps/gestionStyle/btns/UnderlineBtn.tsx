'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import styles from '@/comps/header/MenuShort/Buttons/Template.module.css'
import { changeStyle, TitleStyleType, useAppDispatch } from '@/comps/store/store'
import HoverSpan from '@/comps/header/MenuShort/HoverSpan'
import PlatformKey from '@/comps/editeur/PlatformKey'


export default function ({ title }: { title: TitleStyleType }) {
    const dispatch = useAppDispatch()
    const isUnderline = useCallback(() => title.style.underline, [title])
    const hoverRef = useRef<any>(null)
    const handler = () => {
        //dispatch
        console.log("la")
        dispatch(changeStyle({ style: { underline: !isUnderline() }, name: title.name }))
        hoverRef.current.close()
    }
    //add le use Effet
    useEffect(() => {
        const handleKeyDown = (e: any) => {

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'u') {
                e.preventDefault();
                e.stopPropagation();
                // Exemple de dispatch Redux ou autre action
                dispatch(changeStyle({ style: { underline: !isUnderline() }, name: title.name }))
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [title]);

    return (
        <div className={styles.hoverContainer}>
            <button className={`${styles.button} ${isUnderline() && styles.active}`} onClick={handler}
                onMouseEnter={() => hoverRef.current.open()}
                onMouseLeave={() => hoverRef.current.close()}
            >
                <span
                    style={{
                        position: 'relative',
                        bottom: '1px',

                        fontWeight: 600,
                        textDecoration: 'underline',
                        fontSize: '14px',
                        textAlign: 'center'
                        , lineHeight: '20px',
                        alignmentBaseline: 'central',

                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    U
                </span>
            </button>
            <HoverSpan
                ref={hoverRef}
                txt={`Souligner (${PlatformKey('Mod')}+U)`}
            />
        </div>

    )
}
