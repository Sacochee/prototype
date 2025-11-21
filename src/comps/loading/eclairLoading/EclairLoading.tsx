import Image from 'next/image'
import style from '../style.module.css'

export default function () {
    return (
        <div className={style.container}>
            <div className={style.loader}></div>
            <Image
                style={{ position: 'absolute' }}
                src={'/eclairAnimer.gif'}
                width={50}
                height={50}
                alt=''
                priority
            />
        </div>
    )
}