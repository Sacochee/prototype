import React, { useEffect, useRef, useState } from 'react'
import Wrapper from '../../comps/Wrapper'
import { useMEP } from '../Context'

import style from '../../comps/step/steps.module.css'
import Button from '../../correction/comps/Button'

export default function One({ nextHandler, open }: { nextHandler: () => void, open: () => void }) {

    const wraper = useRef<any>(null)
    const { MEP, setMEP } = useMEP()
   

    const [error, setError] = useState(false)

    const langueRef = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        console.log(MEP.prompt, "prompt")
        if (MEP.prompt && MEP.prompt.length >= 30)
            setError(false)
    }, [MEP.prompt])

    const handler = () => {

        if (MEP.prompt && MEP.prompt.length >= 30) {
            wraper.current.close();
            nextHandler()
        } else setError(true)
    }


    return (
        <Wrapper title='2. Paramètre' ref={wraper} callback={open}>
            <div className={style.tow}>
                <div>
                    Doit etre Mis en forme :
                </div>
                <form >
                    <textarea value={MEP.prompt || ""} onChange={(e) => {
                        setMEP(s => ({...s, prompt : e.target.value}))
                    }}></textarea>
                </form>
                <div>
                    {error ? (<div className={style.error}>
                        Attention, il est nécessaire de faire un prompt un minimun complet. (30 caractères min.)
                    </div>) : (
                        <div className={style.error}>
                            {/* {combler le void} */}
                        </div>
                    )}
                </div>
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
