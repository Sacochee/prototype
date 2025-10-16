import React, { useState } from 'react'
import { RulePrompt, useMEP } from '../Context'
import PopUp from '@/comps/popup/PopUp'
import EditRule from './EditRule'

export default function RuleComps({ rule }: { rule: RulePrompt }) {

  const {MEP, setMEP} = useMEP()
  const [edit, setEdit] = useState(false)

  const editHandler = () => {
    setEdit(true)
  }

  const delHandler = () => {
    setMEP(s => ({...s, prompt : s.prompt.filter(item => item.id !== rule.id) }))
  }

  return (
    <div>
      <div>
        {rule.name}
      </div>
      <div>
        <button onClick={editHandler}>
          edit
        </button>
        <button onClick={delHandler}>
          del
        </button>
      </div>
      <PopUp state={edit} close={() => setEdit(false)}>
        <EditRule rule={rule} close={() => setEdit(false)} />
      </PopUp>
    </div>
  )
}
