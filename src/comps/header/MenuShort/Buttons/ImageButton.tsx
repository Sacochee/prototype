import React, { useEffect, useRef, useState } from 'react'
import styles from './Template.module.css'
import { useEditor } from '@/comps/editeur/Context'
import { EditorView } from 'prosemirror-view'
import fontsColor from '@/comps/editeur/fontsColors.json'
import { useAppSelector } from '@/comps/store/store'
import { FontColorCommand, toogleLinkCommand } from '@/comps/editeur/commands'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'
import FonctionaliteIndisp from '@/comps/soon/FonctionaliteIndisp'
import HoverSpan from '../HoverSpan'

export default function () {
    const { view } = useEditor()
    const containerRef = useRef<HTMLDivElement>(null)
    const hoverRef = useRef<any>(null)
    // const fontColor = useAppSelector(s => s.data.fontColor) //TODO faire le store pour. 
    const [deploy, setDeploy] = useState(false)

    const handler = () => {
        setDeploy(true)
        hoverRef.current.close()
        // view?.dom.focus()
    }

    const handlerSave = () => {
        // FontColorCommand(view as EditorView, color)
        toogleLinkCommand(view as EditorView, 'https://app.flashquizz.fr')
        setDeploy(false);
        view?.dom.focus();
    }

    //Off 
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                // setDeploy(false)
            }
        }
        if (deploy) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [deploy])

    return (
        <div className={styles.hoverContainer}>
            <div ref={containerRef} style={{ position: 'relative' }}>
                <button onClick={handler}
                    onMouseEnter={() => {
                        if (!deploy) hoverRef.current.open()
                    }}
                    onMouseLeave={() => hoverRef.current.close()}
                    className={`${styles.button} ${styles.colorBtn}`}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'column'
                    }}
                >
                    <Image
                        src={"/header/shortCutMenu/image.png"}
                        width={20}
                        height={20}
                        alt=''
                    />
                </button>
                <FonctionaliteIndisp open={deploy} onClose={() => setDeploy(false)} />
                {/* {
                deploy && (
                    <div className={styles.linkPop}>
                        <input type="text"
                            placeholder='https://'
                        />
                        <button
                            onClick={handlerSave}
                        >
                            Appliquer
                        </button>
                    </div>

                )
            } */}
            </div>
            <HoverSpan
                ref={hoverRef}
                txt={`Insérer une image`}
            />
        </div>

    )
}
