const fs  = require('fs')
const htmlDocx =  require("html-docx-js")

const data = {
  title: "Site de citations juridiques",
  html: `
  <!doctype html>
  <html lang="fr">
  <head>
    <meta charset="utf-8">
    <title>Site de citations juridiques - Plan</title>
  </head>
  <body>
    <h1>Site de citations juridiques</h1>
    <p>Objectif: Aider les étudiants en droit à amorcer leurs dissertations et résumer des citations, monétisation par pub.</p>
    <h2>Structure</h2>
    <ul>
      <li>Page d'accueil: moteur de recherche</li>
      <li>Catégories: droit civil, pénal, constitutionnel</li>
      <li>Fiches citation: texte, source, explication, tags SEO</li>
    </ul>
  </body>
  </html>
  `
};

// Conversion HTML → DOCX
const docxBuffer = htmlDocx.asBuffer(data.html);

// Écrit le Buffer directement
fs.writeFileSync("site_plan.docx", docxBuffer);

console.log("✅ site_plan.docx généré");
