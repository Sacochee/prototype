'use client'
import React, { useImperativeHandle, useState, useRef } from 'react'
import styles from './Buttons/Template.module.css'

export default function ({ ref, txt }: { ref: React.RefObject<any>, txt: string }) {
    const [hover, setHover] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const close = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setHover(false);
    }

    const open = () => {
        // On s'assure de ne pas créer plusieurs timeouts
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setHover(true);
            timeoutRef.current = null;
        }, 500)
    }

    useImperativeHandle(ref, () => ({ close, open }));

    if (!hover) return null;

    return (
        <span className={styles.hover}>
            {txt}
        </span>
    )
}
