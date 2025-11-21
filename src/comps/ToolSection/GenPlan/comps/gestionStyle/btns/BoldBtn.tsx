'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import styles from '@/comps/header/MenuShort/Buttons/Template.module.css'
import { changeStyle, TitleStyleType, useAppDispatch} from '@/comps/store/store'
import HoverSpan from '@/comps/header/MenuShort/HoverSpan'
import PlatformKey from '@/comps/editeur/PlatformKey'


export default function ({  title }: { title: TitleStyleType }) {
    const dispatch = useAppDispatch()
    const isBold = useCallback(() => title.style.bold, [title])
    const hoverRef = useRef<any>(null)

    const handler = () => {
   
        //dispatch 
        dispatch(changeStyle({ style: { bold: !isBold() }, name: title.name }))
        hoverRef.current.close()
    }

    useEffect(() => {
        const handleKeyDown = (e: any) => {

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
                e.preventDefault();
                e.stopPropagation();
                // Exemple de dispatch Redux ou autre action
                dispatch(changeStyle({ style: { bold: !isBold() }, name: title.name }))
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [title]);


    return (
        <div className={styles.hoverContainer}>
            <button
                onMouseEnter={() => hoverRef.current.open()}
                onMouseLeave={() => hoverRef.current.close()}
                className={`${styles.button} ${isBold() && styles.active}`} onClick={handler}>
                <span
                    style={{
                        fontWeight: 600,
                        fontSize: '15px',
                        lineHeight: '20px',
                        alignmentBaseline: 'central',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                    B
                </span>
            </button>
            <HoverSpan
                ref={hoverRef}
                txt={`Gras (${PlatformKey('Mod')}+B)`}
            />
        </div>

    )
}
