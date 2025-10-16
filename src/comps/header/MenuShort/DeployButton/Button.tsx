'use client'
import React, { useRef, useState } from 'react'
import styles from './styles.module.css'
import ButtonStyle from '../Buttons/Template.module.css'
import Image from 'next/image';
import HoverSpan from '../HoverSpan';

export default function ({ children }: { children?: React.ReactNode }) {
    if (React.Children.toArray(children).length == 0) return null;

    const [deploy, setDeploy] = useState(false)
    const hoverRef = useRef<any>(null)
    const handler = () => {
        setDeploy(s => !s);

        hoverRef.current.close()
    }

    return (
        <div className={ButtonStyle.hoverContainer}>
            <div className={styles.btn}>
                <button
                    onMouseEnter={() => { if (!deploy) hoverRef.current?.open() }}
                    onMouseLeave={() => hoverRef.current?.close()}
                    onClick={handler}
                    className={ButtonStyle.button}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            src={"/header/shortCutMenu/more.png"}
                            width={15}
                            height={15}
                            alt=''

                        />
                    </div>
                </button>
                {
                    deploy &&
                    <div className={styles.items} >
                        {children}
                    </div>
                }

            </div>
            <HoverSpan
                ref={hoverRef}
                txt='Plus'
            />
        </div>

    )
}
