"use client"
import { useEditor } from '@/comps/editeur/Context'
import Image from 'next/image'
import React, { useRef, useState } from 'react'
import styles from './Template.module.css'
import { ToggleOlCommand } from '@/comps/editeur/commands/ListesCommands'
import { EditorView } from 'prosemirror-view'
import HoverSpan from '../HoverSpan'
import PlatformKey from '@/comps/editeur/PlatformKey'

export default function () {
    const { view } = useEditor()
    const [deploy, setDeploy] = useState(false)
    const hoverRef = useRef<any>(null)
    const btnRef = useRef<any>(null)

    const handler = () => {
        ToggleOlCommand(view);
        view?.dom.focus();
        btnRef.current.close();
    }

    const handlerDeploy = () => {
        view?.dom.focus();
        btnRef.current.close();
    }
    return (
        <div className={styles.hoverContainer}>
            <div className={styles.list}>
                <button onClick={handler}
                    onMouseEnter={() => {
                        if (!deploy) btnRef.current.open()
                    }}
                    onMouseLeave={() => btnRef.current.close()}
                >
                    <Image
                        src={"/header/shortCutMenu/Ol.svg"}
                        width={20}
                        height={20}
                        alt='' />
                </button>
                <button
                    onClick={handlerDeploy}
                    onMouseEnter={() => {
                        if (!deploy) hoverRef.current.open()
                    }}
                    onMouseLeave={() => hoverRef.current.close()}
                >
                    <span style={{
                        width: 0,
                        height: 0,
                        display: 'inline-block',
                        borderLeft: `${8 / 2}px solid transparent`,
                        borderRight: `${8 / 2}px solid transparent`,
                        borderTop: `${(8 * Math.sqrt(3)) / 2}px solid ${"var(--corporateBlue)"}`,
                    }}>
                        {/* triangle */}
                    </span>
                </button>
            </div>
            <HoverSpan
                ref={btnRef}
                txt={`Liste numérotée (${PlatformKey('Mod')}+${PlatformKey('Shift')}+7)`}
            />
            <HoverSpan
                ref={hoverRef}
                txt={`Liste numérotée`}
            />
        </div>

    )
}
