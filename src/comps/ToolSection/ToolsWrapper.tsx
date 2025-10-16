'use client'
import React, { useEffect, useState } from 'react'
import NotificationCenter from '../notificationCenter/NotificationCenter'

export default function ToolsWrapper({ children }: { children: React.ReactNode }) {

  const [fixed, setFixed] = useState(false)

  useEffect(() => {

  }, [])

  return (
    <div style={{ width:"350px", position:'fixed', display:'flex', justifyContent:'center' }}>
      {children}
     
    </div>
  )
}
