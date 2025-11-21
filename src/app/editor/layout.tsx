'use client'

import { DataProvider } from "../../comps/ToolSection/ToolsContexte"

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflow: 'hidden' }}>
      <DataProvider>
        {children}
      </DataProvider>
    </div>

  )
}
