import React, { useEffect, useRef, useState } from 'react'
import style from './style.module.css'

export default function () {

    const [change, setChange] = useState('Droit des contrats') //TODO change

    const mirrorRef = useRef<HTMLSpanElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    //TODO add la save dans le serveur
    const handler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length > 50 && e.target.value.length > change.length) {
            //print error 
        } else {
            const val = e.target.value || ''
            setChange(val)
        }


    }

    return (

        <div className={style.wrap}>
            <input type='text' name='DocTitle' value={change} onChange={handler} className={style.input} ref={inputRef} />
        </div>

    )
}
