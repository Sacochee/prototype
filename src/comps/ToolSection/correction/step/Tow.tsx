import React, { useEffect, useRef, useState } from 'react'
import Wrapper from '../../comps/Wrapper'
import { useCorrection } from '../Context'
import Switch from '../comps/Switch'
import Button from '../comps/Button'
import style from '../../comps/step/steps.module.css'

export default function One({ nextHandler, open }: { nextHandler: () => void, open: () => void }) {

    const wraper = useRef<any>(null)
    const { setCorrection } = useCorrection()

    const [orthographe, setOrthographe] = useState(true)
    const [grammaire, setGrammaire] = useState(true)
    const [syntaxe, setSyntaxe] = useState(true)
    const [ponctuation, setPonctuation] = useState(true)

    const [error, setError] = useState(false)

    const langueRef = useRef<HTMLSelectElement>(null)

    useEffect(() => {
        if (orthographe || grammaire || syntaxe || ponctuation)
            setError(false)
    }, [orthographe, grammaire, syntaxe, ponctuation])

    const handler = () => {

        if (orthographe || grammaire || syntaxe || ponctuation) {
            wraper.current.close();
            const props = { // à remplir si tu ajoutes un champ textarea ou input texte
                orthographe: orthographe,
                grammaire: grammaire,
                syntaxe: syntaxe,
                ponctuation: ponctuation,
                langue: langueRef.current?.value || "fr"
            }
            setCorrection(state => ({ ...state, prompt: props }))

            nextHandler()
        } else setError(true)
    }


    return (
        <Wrapper title='2. Paramètre' ref={wraper} callback={open}>
            <div className={style.tow}>
                <div>
                    Doit etre corrigé :
                </div>
                <form >
                    <div>
                        <label >Corriger l'orthographe</label>
                        <Switch boolean={orthographe} setBoolean={setOrthographe} />
                    </div>
                    <div>
                        <label >Corriger la grammaire</label>
                        <Switch boolean={grammaire} setBoolean={setGrammaire} />
                    </div>
                    <div>
                        <label >Corriger la syntaxe</label>
                        <Switch boolean={syntaxe} setBoolean={setSyntaxe} />
                    </div>
                    <div>
                        <label >Corriger la ponctuation</label>
                        <Switch boolean={ponctuation} setBoolean={setPonctuation} />
                    </div>

                    <div>
                        <label >Langue du texte</label>
                        <select ref={langueRef} name="langue" defaultValue={"fr"}>
                            <option value="fr">Français</option>
                            <option value="en">Anglais</option>
                            <option value="es">Espagnol</option>
                            <option value="de">Allemand</option>
                        </select>
                    </div>

                </form>
                <div>
                    {error ? (<div className={style.error}>
                        Attention, il est nécessaire de sélectionner au moins une correction.
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
