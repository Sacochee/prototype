import React from 'react'
import styles from './Template.module.css'
import Image from 'next/image'

export default function () {
  return (
    <button className={styles.button}>
        <Image
        src={'/header/shortCutMenu/arr.png'}
        height={20}
        width={20}
        alt='dessin d"une flèche retour arrière.'
        />
    </button>
  )
}
