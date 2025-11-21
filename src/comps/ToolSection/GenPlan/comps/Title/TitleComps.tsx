import React, { useEffect, useRef, useState } from 'react'
import { PlanTitle, TitleProps } from '@/types/plan/types'
import style from './style.module.css'
import Points from './Points'
import TitreTexteBox from '../TitreTextBox/TitreTexteBox'
import Image from 'next/image'

export default function ({ title, setTitles }: { title: PlanTitle, setTitles: React.Dispatch<React.SetStateAction<TitleProps>> }) {
    const [isDown, setIsDown] = useState(false);
    const lastTriggerX = useRef(0);
    const TextBox = useRef<any>(null);

    const increment = () => {
        setTitles((t) => ({
            selection: t.selection,
            titles: t.titles.map((tt) =>
                tt.id === title.id
                    ? { ...tt, level: Math.min((tt.level || 0) + 1, 10) }
                    : tt
            ),
        }));
    };

    const decrement = () => {
        setTitles((t) => ({
            selection: t.selection,
            titles: t.titles.map((tt) =>
                tt.id === title.id
                    ? { ...tt, level: Math.max((tt.level || 0) - 1, 0) }
                    : tt
            ),
        }));
    };

    const handleMouseDown = (e: MouseEvent | any) => {
        setIsDown(true);
        lastTriggerX.current = e.clientX;
    };

    useEffect(() => {

        const handleMouseUp = () => setIsDown(false);
        window.addEventListener("mouseup", handleMouseUp);
        if (!isDown) return;

        const handleMouseMove = (e: MouseEvent) => {
            e.preventDefault();
            const deltaX = e.clientX - lastTriggerX.current;
            if (deltaX >= 20) {
                lastTriggerX.current = lastTriggerX.current + 20;
                increment();
            } else if (deltaX <= -20) {
                lastTriggerX.current = lastTriggerX.current - 20;
                decrement();
            }
        };


        window.addEventListener("mousemove", handleMouseMove);


        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDown]);

    const editHandler = () => TextBox.current.focus()

    return (
        <li
            style={{
                margin: "10px 0",

                marginLeft: ((title.level || 0) * 20) + "px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: "5px",
            }}
        >
            <div onMouseDown={handleMouseDown} style={{ userSelect: 'none', cursor: 'ew-resize' }}>
                <Points />
            </div>
            <TitreTexteBox moving={isDown} title={title} setTitle={setTitles} titreBoxRef={TextBox} />
            <div className={style.editIcon} onClick={editHandler}>
                <Image
                    src={"/plan/edit.png"}
                    height={15}
                    width={15}
                    alt='Icon de modification'
                />
            </div>
        </li>
    );
}
