'use client'
import { useEffect, useRef } from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import schema from './schemas/schema'
import { placeCursorCommand } from './commands'
import KeyMap from './plugins/KeyMap'
import { useAppDispatch } from '../store/store'
import { useEditor } from './Context'
import SelectionPlugin from './plugins/SelectionPlugin'
import DefaultMarks from './plugins/DefaultMarks'
import PagesBreak from './plugins/PagesBreak'
import { decoPlugin } from './plugins/dynamicDeco'
import { lockNodeAreaDeletionPlugin } from './plugins/temporary/LockFullDelNodeArea'
import { lockWhenLoadingPlugin } from './plugins/temporary/LockWhenLoading'
import ensureNodeIds from './plugins/forceId'
import SelectionGetter from './plugins/SelectionGetter'
import { store } from '../store/store'



export default function () {
  const editorRef = useRef<HTMLDivElement>(null);
  const { setView } = useEditor()
  const dispach = useAppDispatch()

  useEffect(() => {
    const view = new EditorView(editorRef.current, {
      state: EditorState.create({
        schema: schema,
        plugins: [
          KeyMap,
          SelectionPlugin(dispach),
          ...DefaultMarks(schema),
          PagesBreak(document),
          decoPlugin,
          lockNodeAreaDeletionPlugin(store),
          ensureNodeIds(),
          SelectionGetter(store),
          lockWhenLoadingPlugin(store)
        ]
      }),
    })
    placeCursorCommand(view)
    setView(view)
    return () => { view.destroy(); setView(null) }
  }, [])

  return <div ref={editorRef}
    style={{ overflowX: 'auto' }}
  // style={{ width: '606px', border: '1px solid black', height: '1123px', padding: '94', fontFamily: 'Arial' }} 
  />
}


