import React, { useEffect, useState } from 'react'
import styles from './Template.module.css'
import Image from 'next/image'

import { useEditor } from '@/comps/editeur/Context'
import { ChangeBlockType, enumType } from '@/comps/editeur/commands/ChangeBlockType'
import { useAppSelector } from '@/comps/store/store'

const typeData: { name: string, type: enumType }[] = [
    { name: "Normal", type: "p" },
    { name: "Titre 1", type: "h1" },
    { name: "Titre 2", type: "h2" },
    { name: "Titre 3", type: "h3" },
    { name: "Titre 4", type: "h4" },
    { name: "Titre 5", type: "h5" },
    { name: "Titre 6", type: "h6" },
]

export default function () {
    const { view } = useEditor()
    const [deploy, setDeploy] = useState(false)

    const nodeType = useAppSelector(s => s.data.nodeType)
    const [type, setType] = useState(" - ")

    useEffect(() => {
        console.log(nodeType)
        const lst = typeData.filter(s => s.type == nodeType)
        if (lst.length > 0) setType(lst[0].name)
        else setType(" - ")
    }, [nodeType])


    return (
        <button className={styles.button} style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center'
        }} onClick={() => setDeploy(s => !s)}>
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
                <ul>
                    {typeData.map(item => <li key={item.name + item.type} onClick={(e) => { e.preventDefault(); ChangeBlockType(view!, item.type as any) }}> {item.name} </li>)}
                </ul>
            )}
        </button>
    )
}
