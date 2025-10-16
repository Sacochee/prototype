import TextBox, { TextBoxHandle } from '@/comps/TextBox/TextBox'
import React, { useEffect, useImperativeHandle, useRef } from 'react'
import style from './style.module.css'

export type ExempleHandle = {
    getContent: () => { input: string | undefined, output: string | undefined }
}

export default function Exemple({ ref, ex }: {
    ref: any, ex: {
        input: string;
        output: string;
    }
}) {

    const input = useRef<TextBoxHandle>(null)
    const output = useRef<TextBoxHandle>(null)

    useEffect(() => {
        input.current?.setContentHtml(ex.input)
        output.current?.setContentHtml(ex.output)
    }, [ex])

    useImperativeHandle(ref, () => {
        return {
            getContent: () => {
                return { input: input.current?.getDocDom(), output: output.current?.getDocDom() }
            }
        }
    })
    return (
        <div className={style.textBox}>
           
            <div className={style.rowTextBox}>
                <label>Entré</label>
                <TextBox ref={input} />
            </div>
            <div className={style.rowTextBox}>
                <label>Sortie</label>
                <TextBox ref={output} />
            </div>
            
        </div>
    )
}
