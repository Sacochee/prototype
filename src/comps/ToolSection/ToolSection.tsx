import React from 'react'
import { useAppSelector } from '../store/store'
import CorrectionCours from './correction/CorrectionCours'
import { CorrectionProvider } from './correction/Context';
import { MEPProvider } from './mep/Context';
import MEP from './mep/MEP';
import FC from './flashcard/FC';
import PlanGenerator from './GenPlan/PlanGenerator';


export default function () {

    const name = useAppSelector(s => s.pages.windowName);

    switch (name) {
        case "correction":
            return (<CorrectionProvider>
                <CorrectionCours />
            </CorrectionProvider>)
        case "MEP":
            return (<MEPProvider>
                <MEP />
            </MEPProvider>)
        case "flashcard":
            return (<FC />)

        case "plan":
            return (
                <PlanGenerator></PlanGenerator>
            )
        default:
            return null
    }

}
