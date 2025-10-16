'use client'
import { useRouter } from 'next/navigation'
import React from 'react'


export default function ButtonLink({ children, path, blank }: { children: React.ReactNode, path: string, blank?:true }) {
    const router = useRouter()
    let handler;

    if (blank) handler = () => window.open(path, "_blank")
    else handler = () => router.push(path)

    return (
        <button onClick={handler}>
            {children}
        </button>
    )
}
