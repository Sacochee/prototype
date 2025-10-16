import React from 'react'

export default function BackgroundPopup({ children }: { children: React.ReactNode }) {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.1)',
                zIndex: 100,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            {children}
        </div>
    )
}
