'use client'
import React from 'react'
import styles from './Menus.module.css'

export default function ({children} : {children : React.ReactNode}) {
  return (
    <div className={styles.window}>
        {children}
    </div>
  )
}
