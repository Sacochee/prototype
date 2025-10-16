import React, { useRef } from 'react'
import styles from './Template.module.css'
import { useEditor } from '@/comps/editeur/Context'
import { useAppSelector } from '@/comps/store/store'
import { ItalicCommand } from '@/comps/editeur/commands'
import HoverSpan from '../HoverSpan'
import PlatformKey from '@/comps/editeur/PlatformKey'

export default function () {
  const { view } = useEditor()
  const isItalic = useAppSelector(s => s.data.italic)
  const hoverRef = useRef<any>(null)
  const handler = () => { ItalicCommand(view); hoverRef.current.close() }
  return (
    <div className={styles.hoverContainer}>
      <button className={`${styles.button} ${isItalic && styles.active}`} onClick={handler}
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
