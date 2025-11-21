import React from 'react'
import style from './loading.module.css'

export default function LoadingComps({ size }: { size: number }) {
    return (
        <div className={style.loader} style={{ width: size, borderWidth : (size * 8)/50 }} />
    )
}
