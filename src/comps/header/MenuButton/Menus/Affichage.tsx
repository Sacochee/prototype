'use client'
import React from 'react'
import styles from './Menus.module.css'
import Template from './Template'
import { useEditor } from '@/comps/editeur/Context'

export default function () {
    const {view} = useEditor()

    const handler = () => {
        console.log(view?.state.doc.toJSON()
        )
    }
    return (
        <Template>
            <div onClick={handler}>Affichage</div>
        </Template>
    )
}
