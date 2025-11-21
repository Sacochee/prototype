'use client'
import React, { useState } from 'react'
import style from '../login/loginForm.module.css'
import Image from 'next/image'

export default function PasswordInput({ ref, error }: { ref: React.RefObject<HTMLInputElement | null>, error: boolean }) {
    const [type, setType] = useState<"text" | "password">("password")

    const changeHandler = () => {
        setType(t => t == 'password' ? 'text' : 'password')
    }

    return (
        <div className={style.pwdBox}>
            <input type={type} ref={ref} placeholder='Mot de passe' className={`${error && style.inputError} ${style.inputpwd}`} style={{margin : '0!important'}}/>
            <Image src={'/oeil.png'} width={25} height={25} alt='oeil' onClick={changeHandler} className={style.img} />
        </div>

    )
}
