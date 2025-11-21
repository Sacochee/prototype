"use client"
import React, { useState } from 'react'
import MenuButtons from './MenuButtons'
import Ficher from './Menus/ficher/Ficher'
import Edition from './Menus/Edition'
import Affichage from './Menus/Affichage'
import Insertion from './Menus/insertion/Insertion'
import Format from './Menus/Format'
import Outils from './Menus/outils/Outils'
import style from './style.module.css'


export default function MainMenuTop() {
    const [running, setRunning] = useState('')
    return (
        <><menu className={style.menu}>
            <MenuButtons name='Ficher' enterInOther={running} setInterInOther={setRunning} >
                <Ficher />
            </MenuButtons>
            <MenuButtons name='Édition' enterInOther={running} setInterInOther={setRunning} >
                <Edition />
            </MenuButtons>
            <MenuButtons name='Affichage' enterInOther={running} setInterInOther={setRunning} >
                <Affichage />
            </MenuButtons>

            <Insertion setInterInOther={setRunning} enterInOther={running} />

            <MenuButtons name='Format' enterInOther={running} setInterInOther={setRunning} >
                <Format />
            </MenuButtons>

            <Outils enterInOther={running} setInterInOther={setRunning} />

        </menu>


        </>

    )
}

