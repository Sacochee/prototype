//TODO change jssoup. 
//@ts-ignore
import JSSoup from "jssoup";


export default function cleanHTML(html: string) {
  // Parse le HTML
  const soup = new JSSoup(html);
  // Extrait le texte brut
  let text = soup.text;
  // Supprime les espaces multiples, retours de ligne et tabulations
  text = text.replace(/\s+/g, " ").trim();
  return text;
}
