import React from 'react'
import MainMenuTop from './MenuButton/MainMenuTop'
import MenuShort from './MenuShort/MenuShort'
import Image from 'next/image'
import style from './style.module.css'
import TitleInput from './titleComps/TitleInput'

export default function header() {
    return (
        
 <header className={style.header}>
            <div className={style.top} >
                <Image
                    src={"/Eclair_light.svg"}
                    width={60}
                    height={60}
                    alt=''
                />
                <div>
                    <TitleInput />
                    <MainMenuTop />
                </div>
            </div>
            <div>
                <MenuShort />
            </div>
        </header>
    
       
    )
}
