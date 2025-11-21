import { useEditor } from '@/comps/editeur/Context'
import ApplyStyleAndText from '../../../../editeur/commands/titles/ApplyStyleAndText'
import style from './style.module.css'
import { TitleProps } from '@/types/plan/types'
import { setWindowName, TitleStyleType, useAppDispatch } from '@/comps/store/store'


export default function ({ configStyle, titles, titleStyleType, order }: { configStyle: () => void, titles: TitleProps["titles"], titleStyleType: TitleStyleType[], order: () => void }) {
    const dispatch = useAppDispatch()
    const { view } = useEditor()

    const handlerDone = () => {
        ApplyStyleAndText(view!, titles, titleStyleType)
        dispatch(setWindowName("MEP"))
    }
    return <div className={style.main}>
        <button className={style.H} onClick={order}>
            Réorganiser les titres
        </button>
        <button className={style.S} onClick={configStyle}>
            Gérer les styles
        </button>
        <button className={style.Done} onClick={handlerDone}>Terminé</button>
    </div>
}