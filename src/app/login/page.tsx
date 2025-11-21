import LoginForm from '@/comps/login/LoginForm'
import React, { Suspense } from 'react'
import style from './page.module.css'

export default function page() {
  return (
    <div className={style.main}>
        <div className={style.case}>
            <div className={style.title}>
                Se connecter à Flashquizz
            </div>
            <Suspense fallback={<div>Chargement...</div> }>
            <LoginForm/>
            </Suspense>
            
        </div>
    </div>
  )
}
