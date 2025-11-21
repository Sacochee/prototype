'use client'
import React, { useEffect, useRef, useState } from 'react'
import style from './loginForm.module.css'
import { useSearchParams } from 'next/navigation'
import LoadingComps from './loading/LoadingComps'
import PasswordInput from './PasswordInput'
import { signIn } from 'next-auth/react'
import { encodeBase64 } from '@/lib/fncAuth'


export const tokenTime = 60 * 60 * 1000 // 1 heure

export default function LoginForm() {
  const searchParams = useSearchParams()
  const err = searchParams.get('error');
  const userNameRef = useRef<HTMLInputElement>(null)
  const passwdRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (err) setError(true)
  })

  const loginHandler = () => {
    if (userNameRef.current && passwdRef.current) {
      setError(false)
      let name = userNameRef.current.value
      let passwd = passwdRef.current.value

      if (name && passwd) {
        setLoading(true)
        signIn("credentials", {
          redirect: true,
          callbackUrl: process.env.NEXT_PUBLIC_URL,
          username: name,
          password: passwd,
        }).then(res => {

          if (res?.error) {
            setError(true)
            setLoading(false)
          } else {
            localStorage.setItem(
              "c",
              JSON.stringify({
                a: encodeBase64(name),
                b: encodeBase64(passwd),
              })
            );

          }

        })
      }
    }
  }


  return (
    <form className={style.box}>
      <input type="text" ref={userNameRef} placeholder='Identifiant ou e-mail' className={`${error && style.inputError}`} />
      <PasswordInput ref={passwdRef} error={error} />
      {error ? <div className={style.error}>Mot de passe ou identifiant incorrecte.</div> : <div className={style.error}></div>}
      <div style={{ height: 40 }} className={style.center}>
        {loading ? <LoadingComps size={20} /> : <button onClick={loginHandler}>Se connecter</button>}
      </div>
    </form>
  )
}
