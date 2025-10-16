import React, { useRef } from 'react'
import styles from './Template.module.css'
import { useEditor } from '@/comps/editeur/Context'
import { useAppSelector } from '@/comps/store/store'
import { UnderlineCommand } from '@/comps/editeur/commands'
import HoverSpan from '../HoverSpan'
import PlatformKey from '@/comps/editeur/PlatformKey'

export default function () {
  const { view } = useEditor()
  const isUnderline = useAppSelector(s => s.data.underline)
  const hoverRef = useRef<any>(null)
  const handler = () => { UnderlineCommand(view); hoverRef.current.close() }
  return (
    <div className={styles.hoverContainer}>
      <button className={`${styles.button} ${isUnderline && styles.active}`} onClick={handler}
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
