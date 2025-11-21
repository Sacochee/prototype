
import { useEffect, useState } from "react"
import { PlanTitle, TitleProps } from "@/types/plan/types"
import TitleComps from "../Title/TitleComps"
import style from './style.module.css'
import Bar from "../bottomBar/Bar"
import GestionaireTitre from "../gestionStyle/GestionaireTitre"
import { useAppSelector } from "@/comps/store/store"
import EclairLoading from "@/comps/loading/eclairLoading/EclairLoading"

type Props = { titles: PlanTitle[], setTitles: React.Dispatch<React.SetStateAction<TitleProps>>, setPopup: React.Dispatch<React.SetStateAction<boolean>> }

//POPUP map.
export default function PlanMap({ titles, setTitles, setPopup }: Props) {
  const titleStyleType = useAppSelector(s => s.titleStyle)
  const [styleTargetGestionaire, setStyleTargetGestionaire] = useState<number | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.documentElement.style.overflowY = 'hidden'
    return () => { document.documentElement.style.overflowY = 'auto' }
  }, [])


  const orderHandler = async () => {
    setLoading(true)
    const res = await fetch('/api/plan/ordered', {
      method: 'POST',
      body: JSON.stringify({ titles }),
      headers: {
        'Content-Type': 'application/json'
      },
    })

    if (res.ok) {
      const lst = (await res.json()).res
      setTitles(s => ({ ...s, titles: lst }))
    }

    setLoading(false)
  }

  return (
    <div className={style.planMap}>
      <button onClick={() => setPopup(s => !s)} className={style.closeBtn}>
        <span className={style.triangle}></span>
        Retour
      </button>
      {loading ? 
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf:'center', width:'100vw' }}>
        <EclairLoading />
      </div> : <ul className={style.ul} >
        {titles.map((t) => (
          <TitleComps key={t.id} title={t} setTitles={setTitles} />
        ))}
      </ul>}

      <Bar configStyle={() => setStyleTargetGestionaire(-1)} titleStyleType={titleStyleType} titles={titles} order={orderHandler} />
      <GestionaireTitre target={styleTargetGestionaire} close={() => setStyleTargetGestionaire(undefined)} />
    </div>
  )
}
