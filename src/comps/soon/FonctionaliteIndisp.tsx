"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from './styles.module.css'
import InfoBottom from "./InfoBottom";
import { trace } from "console";
import sendRequest from "./sendRequest";

export default function ({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState(true)
    const containerRef = useRef<HTMLDivElement>(null)
    const infoRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!step) {
            setTimeout(() => infoRef.current?.classList.add(styles.slideExit), 2_700)
            setTimeout(() => {
                onClose()
                setStep(true)
            }, 3_000);
        }
    }, [step])


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                onClose()
            }
        }
        if (mounted) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [mounted])

    const handler = () => {
        sendRequest('')//TODO implémente this
        setStep(false)
    }


    if (!mounted || !open) return null;



    return createPortal(<>
        {step ?
            <div className={styles.bg} >
                <div className={styles.pop} ref={containerRef}>
                    <h1
                    >Fonctionnalité indisponible</h1>
                    <section >
                        <article>
                            <p  >
                                Désolé, cette fonctionnalité n’est pas encore disponible.
                            </p>
                            <p >
                                Cliquez ci-dessous pour informer les développeurs que vous souhaitez cette fonctionnalité
                            </p>
                        </article>
                        <Image
                            src={"/soon/soon.gif"}
                            width={133}
                            height={133}
                            alt=""
                        />
                    </section>
                    <button onClick={handler}>Je veux cette fonctionnalité</button>
                </div>
            </div> : <InfoBottom ref={infoRef as any} />
        }

    </>,

        document.body
    );
}