<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.7071 8.07112C16.0976 7.6806 16.0976 7.04743 15.7071 6.65691L9.34315 0.292946C8.95262 -0.0975784 8.31946 -0.0975784 7.92893 0.292946C7.53841 0.68347 7.53841 1.31664 7.92893 1.70716L13.5858 7.36401L7.92893 13.0209C7.53841 13.4114 7.53841 14.0446 7.92893 14.4351C8.31946 14.8256 8.95262 14.8256 9.34315 14.4351L15.7071 8.07112ZM0 7.36401V8.36401H15V7.36401V6.36401H0V7.36401Z" fill="black" />
</svg>
import React from 'react'

type Props = {
    height: number,
    color: string,
    orientation?: "left" | "right" | "top" | "bottom"
}

export default function ({ height, color, orientation }: Props) {

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
        <svg style={{ rotate: getOrientation() }} width={width} height={height} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.7071 8.07112C16.0976 7.6806 16.0976 7.04743 15.7071 6.65691L9.34315 0.292946C8.95262 -0.0975784 8.31946 -0.0975784 7.92893 0.292946C7.53841 0.68347 7.53841 1.31664 7.92893 1.70716L13.5858 7.36401L7.92893 13.0209C7.53841 13.4114 7.53841 14.0446 7.92893 14.4351C8.31946 14.8256 8.95262 14.8256 9.34315 14.4351L15.7071 8.07112ZM0 7.36401V8.36401H15V7.36401V6.36401H0V7.36401Z" fill={color} />
        </svg>
    )
}
