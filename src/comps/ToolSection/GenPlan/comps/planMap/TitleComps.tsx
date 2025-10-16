import React, { useState } from 'react'
import { Title, TitleProps } from '../../PlanGenerator'
import ArrowIcon from '@/comps/Icons/svg/ArrowIcon';

export default function ({title, setTitles} : {title : Title, setTitles : React.Dispatch<React.SetStateAction<TitleProps>>}) {

    

    const increment = () => {
        setTitles(t =>({
            selection : t.selection,
            titles : t.titles.map(tt => tt.id === title.id ? {...tt, level : (tt.level || 1) > 6 ? 6 : (tt.level||1) + 1} : tt)
        }) )
    }
    const decrement = () => {
        setTitles(t =>({
            selection : t.selection,
            titles : t.titles.map(tt => tt.id === title.id ? {...tt, level : (tt.level || 1) < 2 ? 1 : (tt.level||2) - 1} : tt)
        }) )
    }


    console.log(title.level, "levle -----------")
  return (
    <li style={{margin : "10px 0",marginLeft: ((title.level || 0) * 20)+"px", display: 'flex', alignItems : 'center', justifyContent : 'flex-start', gap : '5px'}}>
        <div style={{display : "flex", flexDirection : 'column'}}>
            <button onClick={decrement}>
                <ArrowIcon orientation='top' height={9} color='#000146'/>
            </button>
            <button onClick={increment}>
                <ArrowIcon orientation='bottom' height={9} color='#000146'/>
            </button>
        </div>
        {title.text}
    </li>
  )
}
