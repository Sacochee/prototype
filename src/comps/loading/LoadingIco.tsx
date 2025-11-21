import Image from 'next/image'
import React from 'react'
import style from './style.module.css'
import EclairLoading from './eclairLoading/EclairLoading'

export default function LoadingIco() {
  return (
    <div className={style.main}>

      <EclairLoading />

    </div>

  )
}
