'use client'

import React from "react"
import BackgroundPopup from "./BackgroundPopup"
import { createPortal } from "react-dom"

type Props = { children: React.ReactNode, state: boolean, close: () => void }

export default function PopUp({ children, state, close }: Props) {

    if (state) return createPortal(
        <BackgroundPopup>
            {children}
        </BackgroundPopup>, document.body
    );
    
    else return null
}
