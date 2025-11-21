import React, { useEffect, useState } from 'react'
import template from '../Template.module.css'
import style from './style.module.css'

import { useEditor } from '@/comps/editeur/Context'
import { ChangeBlockType, enumType } from '@/comps/editeur/commands/titles/ChangeBlockType'
import { selectTitleStyleByTarget, useAppSelector } from '@/comps/store/store'
import ClassNameMerge from '@/utils/css/ClassNameMerge'
import GestionaireTitre from '@/comps/ToolSection/GenPlan/comps/gestionStyle/GestionaireTitre'

const typeData: { name: string, type: enumType }[] = [
    { name: "Normal", type: "p" },
    { name: "Titre 1", type: "h1" },
    { name: "Titre 2", type: "h2" },
    { name: "Titre 3", type: "h3" },
    { name: "Titre 4", type: "h4" },
    { name: "Titre 5", type: "h5" },
    { name: "Titre 6", type: "h6" },
    { name: "Titre 7", type: "h7" },
    { name: "Titre 8", type: "h8" },
    { name: "Titre 9", type: "h9" },
    { name: "Titre 10", type: "h10" },
]

export default function () {
    const { view } = useEditor()
    const [deploy, setDeploy] = useState(false)

    const [gestionStyle, setGestionStyle] = useState<number | undefined>(undefined)

    const nodeType = useAppSelector(s => s.data.nodeType)
    const [type, setType] = useState(" - ")

    const stylesTitles = useAppSelector(s => s.titleStyle)

    useEffect(() => {
        console.log(nodeType)
        const lst = typeData.filter(s => s.type == nodeType)
        if (lst.length > 0) setType(lst[0].name)
        else setType(" - ")
    }, [nodeType])


    return (
        <>
            <button className={ClassNameMerge([template.button, style.btn])}
                onClick={() => setDeploy(s => !s)}>
                {type}
                <span style={{
                    // position: 'relative',
                    // top: '-2px',
                    width: 0,
                    height: 0,
                    display: 'inline-block',
                    borderLeft: `${8 / 2}px solid transparent`,
                    borderRight: `${8 / 2}px solid transparent`,
                    borderTop: `${(8 * Math.sqrt(3)) / 2}px solid ${"var(--corporateBlue)"}`,
                }}></span>
                {deploy && (
                    <ul className={template.fontFamilyList}>
                        <li onClick={() => setGestionStyle(-1)}>
                            Modfier les styles
                        </li>
                        <li>
                            <hr />
                        </li>
                        {typeData.map(item => <li key={item.name + item.type} onClick={(e) => { e.preventDefault(); ChangeBlockType(view!, item.type as any, stylesTitles) }}> {item.name} </li>)}
                    </ul>
                )}

            </button>
            <GestionaireTitre target={gestionStyle} close={() => { setGestionStyle(undefined) }} />

        </>

    )
}
