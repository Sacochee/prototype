'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from './MenuShort.module.css'
import LoupeButton from './Buttons/LoupeButton'
import RetourArrButton from './Buttons/RetourArrButton'
import RetourAvaButton from './Buttons/RetourAvaButton'
import PrintButton from './Buttons/PrintButton'
import OrthoButton from './Buttons/OrthoButton'
import ZoomButton from './Buttons/ZoomButton'
import FormatTexte from './Buttons/FormatTexte'
import BoldButton from './Buttons/BoldButton'
import Underline from './Buttons/Underline'
import ItalicButton from './Buttons/ItalicButton'
import FontSizeButton from './Buttons/FontSizeButton'
import FontFamilyButton from './Buttons/FontFamilyButton'
import FontColorButton from './Buttons/FontColorButton'
import HightlightButton from './Buttons/HightlightButton'
import LinkButton from './Buttons/LinkButton'
import ImageButton from './Buttons/ImageButton'
import TextAlignButton from './Buttons/TextAlignButton'
import InterligneButton from './Buttons/InterligneButton'
import UncrementLeftMarginButton from './Buttons/UncrementLeftMarginButton'
import IncrementLeftMarginButton from './Buttons/IncrementLeftMarginButton'
import UnorderedListButton from './Buttons/UnorderedListButton'
import OrderedListButton from './Buttons/OrderedListButton'
import SupprimerLaMiseEnFormeButton from './Buttons/SupprimerLaMiseEnFormeButton'
import Button from './DeployButton/Button'
import { useMediaQuery } from 'react-responsive'

const BREAKPOINT_1440 = 1440


export default function () {
    const refMenu = useRef<HTMLMenuElement>(null)

    const largeLaptop = useMediaQuery({ minWidth: 1439 })
    const Laptop = useMediaQuery({ minWidth: 1023 })

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return <menu className={styles.menu} />



    return (
        <div className={styles.menu}>
            <menu ref={refMenu}>
                <LoupeButton />
                <RetourArrButton />
                <RetourAvaButton />
                <PrintButton />
                <OrthoButton />
                <ZoomButton />
                <BreakLine />
                <FormatTexte />
                <BreakLine />
                <FontFamilyButton />
                <BreakLine />
                <FontSizeButton />
                <BreakLine />
                {Laptop && <>
                    <BoldButton />
                    <Underline />
                    <ItalicButton />
                    <FontColorButton />
                    <HightlightButton />
                    <BreakLine />
                    <LinkButton />
                    <ImageButton />
                    <BreakLine />
                </>}
                {largeLaptop && <>
                    <TextAlignButton />
                    <InterligneButton />
                    <UnorderedListButton />
                    <OrderedListButton />
                    <IncrementLeftMarginButton />
                    <UncrementLeftMarginButton />
                    <SupprimerLaMiseEnFormeButton />
                </>}

            </menu>
            <Button>
                {!Laptop && <>
                    <BoldButton />
                    <Underline />
                    <ItalicButton />
                    <FontColorButton />
                    <HightlightButton />
                    <BreakLine />
                    <LinkButton />
                    <ImageButton />
                    <BreakLine />
                </>}
                {!largeLaptop && <>
                    <TextAlignButton />
                    <InterligneButton />
                    <UnorderedListButton />
                    <OrderedListButton />
                    <IncrementLeftMarginButton />
                    <UncrementLeftMarginButton />
                    <SupprimerLaMiseEnFormeButton />
                </>}
            </Button>
        </div>

    )
}

function BreakLine() {
    return <span style={{ width: '1px', height: "30px", backgroundColor: '#D9D9D9', borderRadius: '2px' }} />
}