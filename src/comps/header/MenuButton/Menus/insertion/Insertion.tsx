"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from '../../MenuButton.module.css'
import Template from '../Template'
import InsererHtml from './insererHtml'

type Props = {  enterInOther: string, setInterInOther: React.Dispatch<React.SetStateAction<string>> }



export default function ({ enterInOther, setInterInOther }: Props) {
    const name = "Insertion"
    const [isDeploy, setIsDeploy] = useState(false)
    const ref = useRef(null);
    const refHtml = useRef<any>(null)


    const htmlHandler = () => {
        refHtml.current.open()
    }


    useEffect(() => {
        if (enterInOther !== name) {
            setIsDeploy(false)
        }
    }, [enterInOther])

    const activate = () => {
        if (isDeploy) {
            setInterInOther('')
        } else {
            setIsDeploy(true)
            setInterInOther(name)
        }
    }

    useOnClickOutside(ref, () => setInterInOther(""))

    return (<>
        <button
            className={styles.btn}
            onMouseEnter={() => {
                if (enterInOther != '' && name != enterInOther) activate()
            }}
            onClick={activate}
        >
            {name}{
                isDeploy && <div ref={ref} >
                    <Template>
                        <div>Insertiona</div>
                        <div onClick={htmlHandler}>Insérer un text html</div>
                    </Template>
                </div>
            }
        </button>
        <InsererHtml ref={refHtml} />
    </>)
}


function useOnClickOutside(ref: React.RefObject<any>, handler: () => void) {
    useEffect(() => {
        function listener(event: any) {
            // Si on clique sur l'élément ou un de ses enfants => ne rien faire
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(); // Clic à l'extérieur
        }

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener); // Mobile

        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}
