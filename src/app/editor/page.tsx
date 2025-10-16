"use client"
import React from 'react'
import Header from '@/comps/header/header'
import Editeur from '@/comps/editeur/Editeur'
import { EditorProvider } from '@/comps/editeur/Context'
import styles from './page.module.css'
import { Provider } from "react-redux";
import { store } from '@/comps/store/store'
import ToolSection from '@/comps/ToolSection/ToolSection'
import ToolsWrapper from '@/comps/ToolSection/ToolsWrapper'
import NotificationCenter from '@/comps/notificationCenter/NotificationCenter'

export default function () {

  return (
    <>
      <Provider store={store}>
        <EditorProvider>
          <div style={{ height: '120px' }}>
            {/* Sert a garder la place de l'element fixed */}
            <Header />
          </div>
          <main className={styles.main}>
            <div style={{width:'350px'}}>
              {/* Sert a garder la place de l'element fixed */}
              <ToolsWrapper>
                <ToolSection />
              </ToolsWrapper>
            </div>
            <Editeur />
          </main>
           <NotificationCenter/>
        </EditorProvider>
      </Provider>
    </>

  )
}
