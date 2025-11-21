"use client"
import { setWindowName, useAppDispatch } from '@/comps/store/store'
import style from './style.module.css'

export default function () {
    const dispatch = useAppDispatch()

    const handler = () => dispatch(setWindowName("plan"))
    return (
        <div className={style.main}>
            <h5>Comencez par faire votre plan.</h5>
            <button onClick={handler}>
                Générer un Plan de cours
            </button>
        </div>
    )
}