"use client"
import { createPortal } from "react-dom";
import style from './style.module.css'
import { useEffect, useState } from "react";

type Props = { state: string | undefined, close: () => void }
export default function ({ state, close }: Props) {
    if (!state) return null;

    return createPortal(<div className={style.bg}>
        <div className={style.main}>
            <div>
                Chargement de {state} ...
            </div>
            <span className={style.loadingBar}>
                <div className={style.fill}></div>
            </span>
        </div>

    </div>, document.body)
}