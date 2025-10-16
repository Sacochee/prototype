'use client'
import React, { useRef } from 'react'
import styles from './Template.module.css'
import { BoldCommand } from '@/comps/editeur/commands'

import { useAppSelector } from '@/comps/store/store'
import { useEditor } from '@/comps/editeur/Context'
import { EditorView } from 'prosemirror-view'
import HoverSpan from '../HoverSpan'
import PlatformKey from '@/comps/editeur/PlatformKey'

export default function () {
  const { view } = useEditor()
  const isBold = useAppSelector(s => s.data.bold)
  const hoverRef = useRef<any>(null)
  const handler = () => {
    view?.dom.focus();
    BoldCommand(view as EditorView)
    hoverRef.current.close()
  }
  return (
    <div className={styles.hoverContainer}>
      <button
        onMouseEnter={() => hoverRef.current.open()}
        onMouseLeave={() => hoverRef.current.close()}
        className={`${styles.button} ${isBold && styles.active}`} onClick={handler}>
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
