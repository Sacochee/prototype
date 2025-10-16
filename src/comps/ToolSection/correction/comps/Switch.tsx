'use client'
import React from 'react'
import style from './style.module.css'

export default function Switch({
    boolean, setBoolean
}: {
    boolean: boolean,
    setBoolean: React.Dispatch<React.SetStateAction<boolean>>
}) {
    return (
        <div onClick={() => setBoolean(s => !s)} className={`${style.switch} ${boolean && style.active}`} />
    )
}
