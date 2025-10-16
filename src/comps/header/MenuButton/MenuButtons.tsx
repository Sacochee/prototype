"use client"
import React, { useEffect, useRef, useState } from 'react'
import styles from './MenuButton.module.css'

type Props = { name: string, children: React.ReactNode, enterInOther: string, setInterInOther: React.Dispatch<React.SetStateAction<string>> }



export default function ({ name, children, enterInOther, setInterInOther }: Props) {

    const [isDeploy, setIsDeploy] = useState(false)
    const ref = useRef(null);


    useEffect(() => {
        if (enterInOther !== name) {
            setIsDeploy(false)
        }
    }, [enterInOther])

    const activate = () => {
        if (isDeploy && name != enterInOther) {
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
                console.log(enterInOther)
                console.log(name)
                
                if (enterInOther != '' && enterInOther != name) activate()
            }}
            onClick={activate}
        >
            {name}{
                isDeploy && <div ref={ref} >
                    {children}
                </div>
            }
        </button>

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