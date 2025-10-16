import React from 'react'

type Props = {
    height: number,
    color: string,
    orientation?: "left" | "right" | "top" | "bottom"
}

export default function ArrowIcon({ height, color, orientation }: Props) {

    const getOrientation = () => {
        switch (orientation) {
            case "bottom": return "90deg"
            case "top": return "-90deg"
            case "left": return "180deg"
            case "right": return "0deg"
            default: return "0deg"
        }
    }
    const width = height * 5 / 9
    return (
        <svg style={{ rotate: getOrientation() }} width={width} height={height} viewBox="0 0 5 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 4.50002L0.945946 8.55408L0 7.60813L3.10811 4.50002L0 1.39191L0.945946 0.445969L5 4.50002Z" fill={color} />
        </svg>

    )
}
