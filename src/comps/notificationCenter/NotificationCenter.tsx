'use client'
import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAppDispatch, useAppSelector, setMessage } from '@/comps/store/store'
import style from './style.module.css'

export default function () {

    const message = useAppSelector(s => s.notifications.message)
    const dispatch = useAppDispatch()

    // timerRef holds the numeric id returned by window.setTimeout in browsers
    const timerRef = useRef<number | null>(null)
    const [visible, setVisible] = useState(false)

    const clean = () => {
        setVisible(false)
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current)
            timerRef.current = null
        }

        if(message){
            dispatch(setMessage())
        }
    }

    useEffect(() => {
 
        if (!message) {
            clean()
            return
        }

        // show notification and reset timer
        setVisible(true)
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current)
        }

        timerRef.current = window.setTimeout(() => {
            setVisible(false)
            // clear message in store. prefer action clearMessage() if disponible.
            dispatch(setMessage())
            timerRef.current = null
        }, 5000)

        // cleanup on unmount or message change
        return () => {
            if (timerRef.current !== null) {
                window.clearTimeout(timerRef.current)
                timerRef.current = null
            }
        }
    }, [message])

    if (!visible || !message) return null

    // portal dans document.body (assurer que we're client)
    return createPortal(
        <div
            role="status"
            aria-live="polite"
            className={style.container}
        >
            <section>
                <span>{message}</span>
                <div>
                    <button onClick={clean}>Fermer</button>
                </div>
            </section>
        </div>,
        document.body
    )
}
