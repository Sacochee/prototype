import React from 'react'

export type PropsSvg = {
    width?: number, 
    height: number,
    stroke : string;
    
}

/**
 * 
 * Ratio w=9;h=10 ==> 9/10
 */
export default function TurnOff({width, height, stroke} : PropsSvg) {
    if(!width){
        width= height * 9 / 10
    }
    return (
        <svg width={width} height={height} viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.94613 2.85573C7.44941 3.35917 7.79211 4.00054 7.9309 4.69874C8.06969 5.39693 7.99834 6.12061 7.72587 6.77826C7.4534 7.43591 6.99204 7.998 6.40014 8.39346C5.80823 8.78892 5.11236 9 4.4005 9C3.68864 9 2.99277 8.78892 2.40086 8.39346C1.80896 7.998 1.3476 7.43591 1.07513 6.77826C0.802663 6.12061 0.731313 5.39693 0.870104 4.69874C1.0089 4.00054 1.3516 3.35917 1.85487 2.85573M4.4025 1V4.99942" stroke={stroke} stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    )
}
