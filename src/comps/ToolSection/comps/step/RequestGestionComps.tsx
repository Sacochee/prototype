'use client'
import ReloadIcon from "@/comps/Icons/svg/Reload"
import Wrapper from "../Wrapper"
import style from './steps.module.css'
import ArrowIcon from "@/comps/Icons/svg/ArrowIcon"
import Button from "../../correction/comps/Button"
import EyesIcon from "@/comps/Icons/svg/EyesIcon"

type Props = {
    nextHandler: () => void;
    backHandler: () => void;
    reloadHandler: () => void;
    toggle: boolean;
    switchHandler: () => void;
}

export default function ({ nextHandler, backHandler, reloadHandler, toggle, switchHandler }: Props) {
    return (
        <Wrapper title='3. Relecture' callback={() => { }}>
            <div className={style.main}>
                <div className={style.reload}>
                    <span>
                        Ça ne correspond pas tout à fait ?
                    </span>
                    <button onClick={reloadHandler} >Régénérer le texte
                        <ReloadIcon height={15} color='#001429' />
                    </button>
                </div>
                <div className={style.reload}>
                    <button onClick={switchHandler}>
                        <EyesIcon height={15} color="#001429" />
                        {toggle ? ("Afficher l'ancien texte") : ("Afficher le texte corrigé")}
                    </button>
                </div>
                <div className={style.line}>
                    <button className={style.back} onClick={backHandler}>
                        <ArrowIcon height={15} color='#001429' orientation='left' />
                        Précédent
                    </button>
                    <Button onClick={nextHandler} />
                </div>

            </div></Wrapper>
    )
}
