import React, { useEffect, useRef, useState } from 'react'
import { RulePrompt, useMEP } from '../Context'
import TextBox from '@/comps/TextBox/TextBox'
import Exemple, { ExempleHandle } from './Exemple'
import style from './style.module.css'
import { v4 as uuidV4 } from 'uuid'

export default function EditRule({ rule, close }: { rule?: RulePrompt, close: () => void }) {
    const [examples, setExamples] = useState(rule?.exemple || [])
    const [name, setName] = useState(rule?.name || "")
    const [desc, setDesc] = useState(rule?.desc || "")
    const [m, setM] = useState(rule?.miseEnForme || "")
    const { MEP, setMEP } = useMEP()
    const refs = useRef<(ExempleHandle | null)[]>([])

    const addExample = () => {
        setExamples([...examples, { input: '', output: '' }])
    }

    const getValueSave = () => {
        const values = []

        for (const r of refs.current) {
            if (r)
                values.push(r.getContent() || "")

        }

        return values
    }

    const removeExample = (index: number) => {
        console.log(index)
        console.log(getValueSave())
        console.log(getValueSave().filter((_, i) => i !== index))

        setExamples(getValueSave()?.filter((_, i) => i !== index) as any || [])

        refs.current = []
    }

    const saveOnLocalStorage = (prompt: any) => {
        localStorage.setItem("PROMPT", JSON.stringify(prompt))
    }

    const handlerSave = () => {

        const item: RulePrompt = {
            id: rule?.id || uuidV4(),
            name,
            desc,
            miseEnForme: m,
            exemple: getValueSave() as any
        }

        const lst: RulePrompt[] = []
        let edit = false

        for (const r of MEP.prompt) {
            if (r.id === item.id) {
                lst.push(item)
                edit = true
            } else lst.push(r)
        }

        if (!edit) lst.push(item)

        setMEP(s => ({ ...s, prompt: lst }))
        saveOnLocalStorage(lst)
        close()
    }

    return (
        <div className={style.main}>
            <div className={style.box}>
                <label>Nom de la règle</label>
                <input type="text" value={name || ""} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className={style.corps}>
                <div className={style.box}>
                    <label>Cibler quoi ? </label>
                    <textarea value={desc || ""} onChange={(e) => setDesc(e.target.value)} />
                </div>
                <div className={style.box}>
                    <label>Faire quoi sur la cible ? </label>
                    <textarea value={m || ""} onChange={(e) => setM(e.target.value)} />
                </div>
            </div>

            <div style={{ alignSelf: 'center', display: 'flex', flexDirection: 'column', width: 700 }} className={style.exempleContainer}>
                <label style={{ alignSelf: 'center' }}>Exemples</label>
                <div >
                    {examples.map((ex, i) => (
                        <div key={i}>
                            <hr />
                            <div className={style.exemple}>

                                <Exemple
                                    ex={ex}
                                    ref={(el: any) => (refs.current[i] = el)}
                                />
                                <button onClick={() => removeExample(i)}>Supprimer</button>

                            </div>
                        </div>

                    ))}
                </div>

                <button style={{ alignSelf: 'center' }} onClick={addExample}>Ajouter Exemple</button>
            </div>
            <button onClick={handlerSave}>Save</button>
        </div>
    )
}
