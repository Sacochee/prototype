import Image from "next/image"
import styles from './styles.module.css'

export default function ({ref} : {ref : React.RefObject<HTMLDivElement>}) {
    return (
        <div className={`${styles.checkPopUp} ${styles.slideEnter}`} ref={ref}>
            <Image
            src={"/soon/coches.png"}
            width={30}
            height={30}
            alt=""
            />
            <strong>Requête envoyée au serveur</strong>
        </div>
    )
}