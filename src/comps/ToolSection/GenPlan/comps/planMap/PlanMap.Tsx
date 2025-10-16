
import {Title, TitleProps} from "../../PlanGenerator"
import TitleComps from "./TitleComps"

type Props = {titles : Title[], setTitles : React.Dispatch<React.SetStateAction<TitleProps>>}

export default function PlanMap({titles, setTitles} : Props) {
    console.log(setTitles, "setTitles -------")
  return (
    <ul style={{listStyle : 'none', overflow : "scroll", maxHeight:'350px', padding : "0"}}>
        {titles.map((t, i) => (
            <TitleComps key={i} title={t} setTitles={setTitles}/>
        ))}
    </ul>
  )
}
