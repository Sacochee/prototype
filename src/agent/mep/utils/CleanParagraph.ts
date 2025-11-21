import { JSDOM } from "jsdom";

export default function cleanParagraph(html: string, size = 200) {
  const doc = new JSDOM(html).window.document;
  let str = "";

  for (const element of doc.body.children) {
    if (element.tagName === "P") {
      if (element.textContent && element.textContent?.length > size) {
        str += element.textContent + "\n";
      }
    }
  }

  return str;
}
