import React from 'react'
import styles from './Menus.module.css'
import Template from './Template'
import { store, useAppSelector } from '@/comps/store/store'
import switchPageFormat from '@/comps/editeur/commands/switchPageFormat'
import { useEditor } from '@/comps/editeur/Context'

export default function () {
    const pages = useAppSelector(s =>s.data.pages)
    const editor = useEditor()
    return (
        <Template>
            <div  onClick={()=>switchPageFormat(editor.view!, store)}>Passer au mode {pages? "sans page" : "page"}</div>
        </Template>
    )
}
