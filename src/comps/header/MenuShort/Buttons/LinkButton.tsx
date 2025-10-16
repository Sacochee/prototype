import React, { useEffect, useRef, useState } from 'react'
import styles from './Template.module.css'
import { useEditor } from '@/comps/editeur/Context'
import { EditorView } from 'prosemirror-view'
import { toogleLinkCommand } from '@/comps/editeur/commands'
import Image from 'next/image'
import FonctionaliteIndisp from '@/comps/soon/FonctionaliteIndisp'
import HoverSpan from '../HoverSpan'
import PlatformKey from '@/comps/editeur/PlatformKey'

export default function () {
    const { view } = useEditor()
    const containerRef = useRef<HTMLDivElement>(null)

    const hoverRef = useRef<any>(null)
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

    const troncLink = (rawLink: string): string => {
        if ((rawLink.toLocaleLowerCase()).startsWith('https://') || (rawLink.toLocaleLowerCase()).startsWith('http://')) return rawLink
        else return "http://" + rawLink
    }

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
                        if (!deploy) hoverRef.current.open();
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
                        src={"/header/shortCutMenu/lien.png"}
                        width={25}
                        height={25}
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
                txt={`Insérer un lien (${PlatformKey('Mod')}+K)`}
            />
        </div>


    )
}
