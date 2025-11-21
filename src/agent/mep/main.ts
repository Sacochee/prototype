import MainBuilder from "./loader/MainLoader";
import cleanHTML from "./utils/CleanHtml";
import cleanParagraph from "./utils/CleanParagraph";
import TokenCount from "./utils/TokenCount";

export default async function AgentIaMiseEnPage(raw: string) {
  const TokenCounter = new TokenCount();
  const response = {
    def: await MainBuilder("def", cleanHTML(raw), TokenCounter),
    enonce: await MainBuilder("enonce", cleanHTML(raw), TokenCounter),
    exemple: await MainBuilder("exemple", cleanHTML(raw), TokenCounter),
    question: await MainBuilder("question", cleanHTML(raw), TokenCounter),
    auteur: await MainBuilder("auteur", cleanHTML(raw), TokenCounter),
    date: await MainBuilder("date", cleanHTML(raw), TokenCounter),
    notion: await MainBuilder("notion", cleanHTML(raw), TokenCounter),
    cle: await MainBuilder("cle", cleanParagraph(raw), TokenCounter),
  };

  const { input, output } = TokenCounter.getToken();
  console.log(`
    Ce prompt a pris : 
    Input : ${input}
    Output : ${output}

    Soit : $${((input + output) / 1_000_000) * 0.88}
    `);
  TokenCounter.saveToken();
  return response;
}
