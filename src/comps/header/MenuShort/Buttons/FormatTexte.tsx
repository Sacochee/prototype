import React from 'react'
import styles from './Template.module.css'
import Image from 'next/image'

export default function () {
    return (
        <button className={styles.button} style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center'
        }}>
            Normal
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
    )
}
