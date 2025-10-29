import { NextResponse } from "next/server";
import Together from "together-ai";
import fs from "fs";
import path from "path";
import { Console } from "console";

export async function POST(req: Request) {
  async function api(arg: any[]) {
    const together = new Together({
      apiKey:
        "acedc05c0c0d15f97d330657e48b7cfc991cd96d0f75a7de4a69af7e4f132a41", // sécurise la clé
    });

    const response = await together.chat.completions.create({
      messages: arg,
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    });

    if (response.choices[0].message) {
      return response.choices[0].message.content;
    } else {
      throw new Error("No response from API");
    }
  }
  try {
    const body = await req.json();
    const { context, q, r, prompt: PromptUser, history } = body;
    //TODO check raw et si raw pas trop grand.

    // const filePath = path.join(process.cwd(), "src", "prompts", "P1.md");
    // const prompt = fs.readFileSync(filePath, "utf-8");
    // const promptTxt = prompt.replace("{texte}", raw);
    // const html = await api(promptTxt);

    //passe 1

    const messages = [];

    if (history && history.lenght > 0) {
      console.log(history)
      messages.push(...history); // sa rend message = [{}, {}] ??
    } else {
      messages.push({
        role: "system",
        content: `<role>
Tu es un assistant pédagogique spécialisé dans la création de flashcards claires et efficaces qui répond toujours en JSON {q, r}.  
Ton objectif est de transformer un texte de cours en une carte recto-verso simple à mémoriser.
</role>

<instructions>
1. À partir du contenu fourni dans <context>, crée une **flashcard** avec :
   - une **question** courte et claire (recto),
   - une **réponse** synthétique et complète (verso).
2. Si <question> et <reponse> contiennent déjà du contenu, utilise-les pour définir le niveau de précision attendu, mais reformule pour améliorer la concision et la lisibilité.
3. Le texte doit être formaté avec du **HTML minimal et propre**, compatible avec Anki :
   - Balises autorisées : <p>, <ul>, <ol>, <li>, <span>, <b>, <i>.
   - Préserve toute balise existante.
   - Tu peux ajouter du style inline avec uniquement : **font-weight**, **color**, **padding**, **text-decoration** pour mettre en évidence les éléments clés.
4. Sois fidèle au sens du texte, sans ajout d’opinion ni d’interprétation.
5. Priorise la **clarté** et la **mémorisation** : une idée principale par carte.
6. Si une **instruction personnalisée de l’utilisateur** est fournie dans la balise <user_instruction>, **suis-la avec priorité** (par exemple : “reformule la question en plus concis” ou “mets la réponse sous forme de liste <ul>”).
</instructions>

<response_format>
- Réponds **uniquement** en JSON valide (aucun texte avant ou après).
- Le format exact doit être :

{
  "q": "<html du recto (question)>",
  "r": "<html du verso (réponse)>"
}

- Le JSON doit être **directement parsable** avec "JSON.parse()" sans modification.
- Tous les guillemets dans le HTML doivent être **échappés correctement** (ex. " devient \").
- **Ne pas** inclure de \`\`\`json\`\`\` ou d’autres délimitations.
- Vérifie que ton JSON est bien formé avant de le renvoyer.
</response_format>`,
      });
    }

    // const filePath = path.join(process.cwd(), "src", "prompts", "flashcard.md");
    // const prompt = fs.readFileSync(filePath, "utf-8");
    messages.push({
      role: "user",
      content: `<task>
<context>${context}</context>
<question>${q}</question>
<reponse>${r}</reponse>
<user_instruction>${PromptUser}</user_instruction></task>`,
    });


  console.log(messages)
    const p = await api(messages);

    console.log("response", p);
    const json = JSON.parse(p || "{}");

    messages.push({
      role: "assistant",
      content: json,
    });

    return NextResponse.json({ ...json, ok: true, history: messages });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
