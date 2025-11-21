"use client"
import React, { useState } from 'react'
import Header from '@/comps/header/header'
import Editeur from '@/comps/editeur/Editeur'
import { EditorProvider } from '@/comps/editeur/Context'
import styles from './page.module.css'
import { Provider } from "react-redux";
import { store } from '@/comps/store/store'
import ToolSection from '@/comps/ToolSection/ToolSection'
import ToolsWrapper from '@/comps/ToolSection/ToolsWrapper'
import NotificationCenter from '@/comps/notificationCenter/NotificationCenter'
import ChoseFileStart from '@/comps/userGuide/ChoseFileStart/ChoseFileStart'

export default function () {

  const [show, setShow] = useState(false)

  return (
    <>
      <Provider store={store}>
        <EditorProvider>
          <div style={{ height: '140px' }}>
            {/* Sert a garder la place de l'element fixed */}
            <Header />
          </div>
          <main className={styles.main}>
            <div style={{ width: '350px' }}>
              {/* Sert a garder la place de l'element fixed */}
              <ToolsWrapper>
                <ToolSection />
              </ToolsWrapper>
            </div>
            <div>
              <span style={{ display: show ? "block" : "none" }}>
                <Editeur />
              </span>
              <ChoseFileStart show={show} close={() => { console.log("icici"); setShow(true) }} />
            </div>
          </main>
          <NotificationCenter />
        </EditorProvider>
      </Provider>
    </>

  )
}
