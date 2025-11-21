import { useState } from "react"
import { PlanTitle } from "@/types/plan/types"
import style from './style.module.css'
import ArrowIcon from "@/comps/Icons/svg/ArrowIcon"

const Titres = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10
]

export default function ({title, setLvl} : {title : PlanTitle, setLvl : (lvl: number | null) => void}) {
    const [deploy, setDeploy] = useState(false)
    return <div className={style.select}>
        <div className={style.selectMain} onClick={() => setDeploy(s => !s)}>
        {title.level ? `Titre ${title.level}` : `Titre ?`} <ArrowIcon height={15} color="#99a1a9" orientation={deploy ? "top" : "bottom"}/>
        </div>
        {deploy && <div className={style.selectOptions}>
            <div onClick={()=>setLvl(null)}>
                Titre ?
            </div>
            {Titres.map(i => <div key={i} onClick={()=>setLvl(i)}>Titre {i}</div>)}
        </div>}
    </div>
}