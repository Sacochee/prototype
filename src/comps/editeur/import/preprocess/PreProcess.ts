export default function PreProcess(html: Document): Document {
  const body = html.body;

  // On convertit en tableau pour éviter les effets de mutation du NodeList
  const paragraphs = Array.from(body.getElementsByTagName("p"));

  for (const p of paragraphs) {
    const brs = Array.from(p.getElementsByTagName("br"));

    // 1. Si le paragraphe contient uniquement un ou plusieurs <br> → on les supprime
    const onlyBrs =
      Array.from(p.childNodes).every(
        (node) =>
          node.nodeName === "BR" ||
          (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim())
      );

    if (onlyBrs && brs.length > 0) {
      brs.forEach((br) => br.remove());
      continue; // on passe au suivant
    }

    // 2. S'il y a 2 <br> ou plus, on découpe en deux paragraphes
    if (brs.length >= 2) {
      const secondBr = brs[1];
      const newP = html.createElement("p");

      // Déplace les nœuds après le 2ᵉ <br> dans un nouveau <p>
      let node = secondBr.nextSibling;
      while (node) {
        const next = node.nextSibling;
        newP.appendChild(node);
        node = next;
      }

      // Supprime le 2ᵉ <br> utilisé comme séparateur
      secondBr.remove();

      // Insère le nouveau paragraphe après l’actuel
      if (p.parentNode) {
        p.parentNode.insertBefore(newP, p.nextSibling);
      }
    }
  }

  return html;
}
