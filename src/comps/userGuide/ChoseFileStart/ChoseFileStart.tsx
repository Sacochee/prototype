"use client"
import { useEditor } from "@/comps/editeur/Context";
import LoadDocx from "@/comps/header/MenuButton/Menus/ficher/LoadDocx";
import FileLoading from "@/comps/loading/FileLoading/FileLoading";
import { ChangeEvent, useRef, useState } from "react";
import style from './style.module.css'
import { setWindowName, useAppDispatch } from "@/comps/store/store";

type Props = { show: boolean, close: () => void }
export default function ({ show, close }: Props) {
    const { view } = useEditor()
    const fileInputRef = useRef<any>(null);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<string | undefined>(undefined)
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setLoading(e.target.files?.[0].name || undefined)
        await LoadDocx(e, view!)
        setLoading(undefined)
        close()
        dispatch(setWindowName("plan"))
    };
    return (
        <div
            className={style.main}
            style={{ display: show ? "none" : "flex" }}>
            <div>
                <button onClick={handleClick}>Charger un ficher</button>
                <input
                    type="file"
                    accept=".docx"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
                <button onClick={() => close()}>Créer un document</button>
            </div>
            <FileLoading state={loading} close={() => setLoading(undefined)} />
        </div>)
}