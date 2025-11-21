'use client'
import React, { useCallback, useEffect, useRef } from 'react'
import styles from '@/comps/header/MenuShort/Buttons/Template.module.css'
import { changeStyle, TitleStyleType, useAppDispatch } from '@/comps/store/store'
import HoverSpan from '@/comps/header/MenuShort/HoverSpan'
import PlatformKey from '@/comps/editeur/PlatformKey'

export default function ({ title }: { title: TitleStyleType }) {
    const dispatch = useAppDispatch()
    const isItalic = useCallback(() => title.style.italic, [title])
    const hoverRef = useRef<any>(null)
    const handler = () => {
        dispatch(changeStyle({ style: { italic: !isItalic() }, name: title.name }))
        hoverRef.current.close()
    }
    useEffect(() => {
        const handleKeyDown = (e: any) => {

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
                e.preventDefault();
                e.stopPropagation();
                // Exemple de dispatch Redux ou autre action
                dispatch(changeStyle({ style: { italic: !isItalic() }, name: title.name }))
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [title]);
    return (
        <div className={styles.hoverContainer}>
            <button className={`${styles.button} ${isItalic() && styles.active}`} onClick={handler}
                onMouseEnter={() => hoverRef.current.open()}
                onMouseLeave={() => hoverRef.current.close()}
            >
                <span
                    style={{
                        fontWeight: 600,
                        // lineHeight: '20px',
                        fontStyle: 'italic',
                        fontSize: '20px',
                        fontFamily: 'var(--font-rokkitt)',

                        position: 'relative',
                        right: "1.5px"
                    }}>
                    I
                </span>
            </button>
            <HoverSpan
                ref={hoverRef}
                txt={`Italique (${PlatformKey('Mod')}+I)`}
            />
        </div>

    )
}
