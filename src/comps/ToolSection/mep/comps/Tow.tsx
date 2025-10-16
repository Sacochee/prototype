import React, { useEffect, useRef, useState } from 'react'
import Wrapper from '../../comps/Wrapper'
import { useMEP } from '../Context'

import style from '../../comps/step/steps.module.css'
import Button from '../../correction/comps/Button'
import RuleComps from './RuleComps'
import PopUp from '@/comps/popup/PopUp'
import EditRule from './EditRule'

export default function One({ nextHandler, open }: { nextHandler: () => void, open: () => void }) {

    const wraper = useRef<any>(null)
    const { MEP, setMEP } = useMEP()

    const [newRule, setNewRule] = useState(false)

    const close = () => { setNewRule(false) }
    const openRule = () => { setNewRule(true) }


    const [error, setError] = useState(false)

    const langueRef = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        const lst = JSON.parse(localStorage.getItem("PROMPT") || "[]")
        setMEP(s => ({ ...s, prompt: lst }))
    }, [])

    const handler = () => {

        wraper.current.close();
        nextHandler()

    }

    const dlHandler = async () => {
        const res = await fetch('/api/mep/download/prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: MEP.prompt }),
        })

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'prompt.json'
        a.click()
        URL.revokeObjectURL(url)
    }

    const loadHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                localStorage.setItem("PROMPT", event.target?.result as string)
                const json = JSON.parse(event.target?.result as string)
                setMEP(s => ({ ...s, prompt: json }))
                // ici tu peux set ton state, ex :
                // setData(json)
            } catch {
                console.error('Fichier invalide')
            }
        }
        reader.readAsText(file)
    }

    const handlerClear = () => { localStorage.removeItem("PROMPT") }

    return (
        <Wrapper title='2. Paramètre' ref={wraper} callback={open}>
            <div className={style.tow}>
                <div>
                    <button onClick={dlHandler}>
                        Save
                    </button>
                    <input type="file" accept="application/json" onChange={loadHandler} />
                    <button onClick={handlerClear}>
                        clear DATA
                    </button>
                </div>
                <div>
                    Règles de mise en forme :
                </div>
                <ul style={{maxHeight : 200, overflowY : "scroll"}}>
                    {
                        MEP.prompt && MEP.prompt.map((el, i) => (
                            <RuleComps key={i} rule={el} />
                        ))
                    }
                    <PopUp state={newRule} close={close}>
                        <EditRule close={close} />
                    </PopUp>
                </ul>
                <button onClick={openRule}>
                    Nouvelle règle
                </button>
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <Button onClick={handler} disabled={error} />
                </div>
            </div>
        </Wrapper>
    )
}
