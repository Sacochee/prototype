import React, { useEffect, useRef, useState } from 'react'
import Template from '../Template'
import styles from '../../MenuButton.module.css'

import { setMessage, setWindowName, useAppDispatch } from '@/comps/store/store'
import { handler } from 'next/dist/build/templates/app-page'

type Props = { enterInOther: string, setInterInOther: React.Dispatch<React.SetStateAction<string>> }



export default function ({ enterInOther, setInterInOther }: Props) {
    const name = "Outils"
    const [isDeploy, setIsDeploy] = useState(false)
    const ref = useRef(null);
    const refCorriger = useRef<any>(null)
    const dispatch = useAppDispatch();

    const handlerCorriger = () => {
        // refCorriger.current.open()
        dispatch(setWindowName('correction'))
    }

    const handlerPlan = () => {
dispatch(setWindowName('plan'))
    }

    const handlerMEP = () => {
        dispatch(setWindowName('MEP'))
    }

     const handlerFlashcard = () => {
        dispatch(setWindowName('flashcard'))
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
                        <div onClick={handlerPlan}>Outils</div>
                        <div onClick={handlerCorriger}>Corriger le texte</div>
                        <div onClick={handlerPlan}>Générer un plan de cours</div>
                        <div onClick={handlerMEP}>Mettre en page le texte</div>
                        <div onClick={handlerFlashcard}>faire des flashcards</div>
                    </Template>
                </div>
            }
        </button>
        {/* <CorrigerText ref={refCorriger} /> */}
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

