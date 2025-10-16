import ArrowIcon from '@/comps/Icons/svg/ArrowIcon'
import React from 'react'
import style from './style.module.css'

export default function Button({ onClick, disabled }: { onClick: () => void, disabled ?:boolean }) {
    return (
        <button className={style.btn} onClick={onClick} disabled={disabled || false}>
            Suivant
            <ArrowIcon orientation='right' height={13} color='#fff' />
        </button>
    )
}
