'use client'
import React, { useRef } from 'react'
import styles from './Template.module.css'
import { IncrementBlockLeftSpacingCommand } from '@/comps/editeur/commands/RetraitCommand'
import { useEditor } from '@/comps/editeur/Context'
import { EditorView } from 'prosemirror-view'
import Image from 'next/image'
import HoverSpan from '../HoverSpan'
import PlatformKey from '@/comps/editeur/PlatformKey'

export default function () {
    const { view } = useEditor()
    const hoverRef = useRef<any>(null)

    const handler = () => {
        view?.dom.focus();
        IncrementBlockLeftSpacingCommand(view as EditorView)
        hoverRef.current.close()
    }
    return (
        <div className={styles.hoverContainer}>
            <button className={`${styles.button}`} onClick={handler}
                onMouseEnter={() => hoverRef.current.open()}
                onMouseLeave={() => hoverRef.current.close()}
            >
                <Image
                    src={"/header/shortCutMenu/marginMore.svg"}
                    width={20}
                    height={20}
                    alt=''
                />
            </button>
            <HoverSpan
                ref={hoverRef}
                txt={`Augmenter le retrait (${PlatformKey('Mod')}+])`}
            />
        </div>

    )
}
