'use client'
import { useEditor } from '@/comps/editeur/Context'
import Image from 'next/image'
import React, { useRef } from 'react'
import styles from './Template.module.css'
import { ClearFormattingCommand } from '@/comps/editeur/commands/DelMiseEnForme'
import HoverSpan from '../HoverSpan'
import PlatformKey from '@/comps/editeur/PlatformKey'

export default function SupprimerLaMiseEnFormeButton() {
    const { view } = useEditor()
    const hoverRef = useRef<any>(null)

    const handler = () => {
        ClearFormattingCommand(view!.state, view!.dispatch)
        view?.dom.focus();
hoverRef.current.close()
    }
    return (

        <div className={styles.hoverContainer}>
            <button className={styles.button} style={{ padding: '7px' }}
            onMouseEnter={()=>hoverRef.current.open()}
            onMouseLeave={()=>hoverRef.current.close()}
            onClick={handler}
            >
                <Image
                    src={"/header/shortCutMenu/SuppMiseEnForme.png"}
                    width={16}
                    height={16}
                    alt=''
                />
            </button>
            <HoverSpan
            ref={hoverRef}
            txt={`Supprimer la mise en forme (${PlatformKey('Mod')}+\\)`}
            />
        </div>


    )
}
