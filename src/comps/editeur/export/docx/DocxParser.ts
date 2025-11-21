import { EditorState } from "prosemirror-state";
import { Document, Packer, Paragraph } from "docx";
import { Node } from "prosemirror-model";
import Title from "./comps/Title";
import ParagraphBuilder from "./comps/Paragraph";


export default async function (doc: EditorState["doc"]) {
  const paragraphs: Paragraph[] = [];

  function buildNode(node: Node): Paragraph | null {
    if (!node) return null;
    switch (node.type.name) {
      case "paragraph":
        return ParagraphBuilder(node);
      case "heading":
        return Title(node);
      default:
        return null;
    }
  }

  for (const item of doc.children) {
    console.log(item)
    const node = buildNode(item);
    node && paragraphs.push(node);
  }

  const document = new Document({
    sections: [{ children: paragraphs }],
    // numbering : ListeStyleDefault()
  });

  // Used to export the file into a .docx file
  const buffer = await Packer.toBuffer(document);

  return new Uint8Array(buffer);
}
