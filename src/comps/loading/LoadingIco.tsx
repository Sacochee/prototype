import Image from 'next/image'
import React from 'react'
import style from './style.module.css'

export default function LoadingIco() {
  return (
    <div className={style.main}>
 <div className={style.container}>
        <div className={style.loader}></div>
        <Image
        style={{position:'absolute'}}
        src={'/eclairAnimer.gif'}
        width={50}
        height={50}
        alt=''
        priority
        />
    </div>
   
    </div>
   
  )
}
