import { Node as PMNode, Schema, DOMSerializer, Node } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import compressHtml from "./compressHtml";

export type Chunk = {
  raw: string;
  pos: { startId: string; endId: string };
  res?: string;
  size: number;
  dictionnaire: Record<string, string>;
};

export function nodesToHtml(nodes: PMNode[], schema: Schema): string {
  const serializer = DOMSerializer.fromSchema(schema);
  const container =
    typeof document !== "undefined"
      ? document.createElement("div")
      : ({ appendChild: () => {}, innerHTML: "" } as any);
  nodes.forEach((n) => container.appendChild(serializer.serializeNode(n)));
  return container.innerHTML;
}

export function sliceToChunk(
  doc: EditorState["doc"],
  start: number,
  sizeOfNodeArea: number,
  schema: Schema,
  next: boolean,
  maxSize = 1000
): Chunk {
  const lst: PMNode[] = [];

  // parcourir proprement en pouvant break
  let runningOffset = 0;
  for (let i = 0; i < doc.childCount; i++) {
    const node = doc.child(i);
    const offset = runningOffset;
    runningOffset += node.nodeSize;

    if (next) {
      if (offset >= start + sizeOfNodeArea) {
        lst.push(node);
        if (lst.reduce((s, n) => s + n.nodeSize, 0) > maxSize) break;
      }
    } else {
      if (offset < start) {
        lst.push(node);
      } else break;
    }
  }

  if (lst.length === 0) throw new Error("Aucun nœud trouvé pour chunk");

  if (next) return forwardChunk(lst, schema, maxSize);
  else return backwardChunk(lst, schema, maxSize);
}

function forwardChunk(lst: Node[], schema: Schema, maxSize: number) {
  let currentNodesSize = 0;
  const buffer: string[] = [];
  let startId: string | undefined;
  let endId: string | undefined;
  let result: Chunk | undefined;

  for (const node of lst) {
    if (node.isText)
      throw new Error("Il y a un node text dans la liste de node Top level"); // ou throw selon ta logique

    const html = nodesToHtml([node], schema);
    const htmlLenght = html.length;

    if (!startId) startId = node.attrs?.id;

    if (currentNodesSize + htmlLenght > maxSize) {
      // si buffer vide, on prend ce node seul, sinon on termine avec buffer courant
      const source = buffer.length === 0 ? html : buffer.join("");

      const { html: compressed, dictionnaire } = new compressHtml(source).get();
      result = {
        raw: compressed,

        pos: {
          startId: startId!,
          endId: endId ? endId : startId!,
        },
        size: currentNodesSize || htmlLenght,
        dictionnaire,
      };
      return result;
    }

    endId = node.attrs?.id;

    buffer.push(html);
    currentNodesSize += htmlLenght;
  }

  if (result) return result;

  // si pas encore de chunk, retourner le contenu accumulé
  const { html: finalHtml, dictionnaire } = new compressHtml(
    buffer.join("")
  ).get();
  return {
    raw: finalHtml,
    pos: {
      startId: startId!,
      endId: endId!,
    },
    size: currentNodesSize,
    dictionnaire,
  };
}

function backwardChunk(lst: Node[], schema: Schema, maxSize: number) {
  lst.reverse();
  let currentNodesSize = 0;
  const buffer: string[] = [];
  let startId: string | undefined;
  let endId: string | undefined;
  let result: Chunk | undefined;

  for (const node of lst) {
    if (node.isText)
      throw new Error("Il y a un node text dans la liste de node Top level"); // ou throw selon ta logique

    const html = nodesToHtml([node], schema);
    const htmlLenght = html.length;

    if (!startId) startId = node.attrs?.id;

    if (currentNodesSize + htmlLenght > maxSize) {
      // si buffer vide, on prend ce node seul, sinon on termine avec buffer courant
      const source = buffer.length === 0 ? html : buffer.reverse().join("");

      const { html: compressed, dictionnaire } = new compressHtml(source).get();
      result = {
        raw: compressed,

        pos: {
          endId: startId!,
          startId: endId ? endId : startId!,
        },
        size: currentNodesSize || htmlLenght,
        dictionnaire,
      };
      return result;
    }

    endId = node.attrs?.id;

    buffer.push(html);
    currentNodesSize += htmlLenght;
  }

  if (result) return result;

  // si pas encore de chunk, retourner le contenu accumulé
  const { html: finalHtml, dictionnaire } = new compressHtml(
    buffer.reverse().join("")
  ).get();
  return {
    raw: finalHtml,
    pos: {
      endId: startId!,
      startId: endId!,
    },
    size: currentNodesSize,
    dictionnaire,
  };
}
