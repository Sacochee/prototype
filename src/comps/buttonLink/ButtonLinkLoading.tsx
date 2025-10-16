'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import LoadingIco from '../loading/LoadingIco'


export default function ButtonLinkLoading({ children, path, blank }: { children: React.ReactNode, path: string, blank?: true }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    let handler;

    if (blank) handler = () => window.open(path, "_blank")
    else handler = () => { setLoading(true); router.push(path) }

    if (loading) return createPortal(<LoadingIco />, document.body)

    return (
        <button onClick={handler}>
            {children}
        </button>
    )
}
