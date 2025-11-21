import { useEditor } from "@/comps/editeur/Context";
import { EditorState, Plugin } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import React, { CSSProperties, RefObject, useEffect, useImperativeHandle, useRef, useState } from "react";
import { PlanTitle, TitleProps, TitreStyle } from "@/types/plan/types";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { createPortal } from "react-dom";
import Menu from "./Menu";
import style from './style.module.css'
import { selectTitleStyleByTarget } from "@/comps/store/store";
import { useSelector } from "react-redux";

type Props = {
    title: PlanTitle,
    setTitle: React.Dispatch<React.SetStateAction<TitleProps>>,
    moving: boolean,
    titreBoxRef: React.RefObject<any>
}
export default function ({ title, setTitle, moving, titreBoxRef }: Props) {
    const containerRef = useRef(null);
    const viewRef = useRef<EditorView>(null);
    const MainEditor = useEditor();
    const styleTitreStore = useSelector(selectTitleStyleByTarget(title.level ? (title.level < 11 ? title.level : 10) : 0))

    const [menuVisible, setMenuVisible] = useState(false);

    const customKeys = keymap({
        "Mod-z": undo,
        "Mod-y": redo,
        "Shift-Mod-z": redo,
    });

    useEffect(() => {
        if (viewRef.current === null) return;
        if (moving) viewRef.current!.setProps({ editable: () => false });
        else viewRef.current!.setProps({ editable: () => true });
    }, [moving])

    useEffect(() => {
        if (!containerRef.current) return;

        const schema = MainEditor.view?.state.schema

        const autoDispatchPlugin = new Plugin({
            view(editorView) {
                return {
                    update(view, prevState) {

                        if (view.state.doc.eq(prevState.doc)) return;
                        console.log("ehre")
                        const text = view.state.doc.textBetween(0, view.state.doc.content.size, "\n");
                        setTitle(t => ({
                            ...t,
                            titles: t.titles.map(tt => tt.id === title.id ? { ...tt, titre: text } : tt)
                        }));
                    }
                };
            }
        });
        const doc = schema!.topNodeType.createAndFill(
            null,
            schema!.nodes.paragraph.create(null, schema!.text(title.titre || ""))
        );
        // init avec le str de title.titre
        const state = EditorState.create({
            doc: doc!,
            schema,
            plugins: [history(), keymap(baseKeymap), customKeys, autoDispatchPlugin],
        });



        const view = new EditorView(containerRef.current, {
            state,
            attributes: { spellcheck: "true", style: "outline:none;padding: 10px;" },

            handleDOMEvents: {
                focus: (view, event) => {
                    //Mettre le menu en spawn. 
                    setMenuVisible(true)
                    return false;
                },
                blur: (view, event) => {
                    setMenuVisible(false)
                    //enelver el menu
                    //Save les changement 
                    // si vide alors pas un titre. 
                    // sinon cahnger le style (sauf H0 )+ les fonts 
                    return false;
                },

            }
        });

        viewRef.current = view;

        return () => {
            view.destroy();
            viewRef.current = null;
        };
    }, [title]);

    useImperativeHandle(titreBoxRef, () => ({
        focus: () => {
            viewRef.current?.dom.focus()
        }
    }))


    const changeTitleLevel = (lvl: number | null) =>
        setTitle(t => ({
            selection: t.selection,
            titles: t.titles.map(tt => tt.id === title.id ? { ...tt, level: lvl || 0 } : tt)
        }))

    const StyleBuilder = (style: TitreStyle): CSSProperties =>
    ({
        color: style.color,
        fontFamily: style.police,
        backgroundColor: style.backgroundColor ? style.backgroundColor : "none",
        fontWeight: style.bold ? "bold" : "normal",
        fontSize: style.fontSize,
        fontStyle: style.italic ? "italic" : "normal",
        textDecoration: style.underline ? "underline" : "none",
    })


    const delHandler = (id: string): void =>
        setTitle(s => ({ ...s, titles: s.titles.filter(item => item.id !== id) }))


    return <>
        {(menuVisible || moving) && createPortal(<Menu title={title} changeTitleLevel={changeTitleLevel} ref={viewRef as RefObject<EditorView>} delTitle={delHandler} />, containerRef.current!)}
        <div
            className={style.main} ref={containerRef} style={{ display: "inline-block", ...StyleBuilder(styleTitreStore!.style) }} />
    </>
}