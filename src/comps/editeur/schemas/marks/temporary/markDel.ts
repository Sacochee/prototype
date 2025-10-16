import { MarkSpec } from "prosemirror-model";

export const DelMark : MarkSpec = {
    parseDOM :  [
        {tag : 'del'},
         { tag: 'span[class=del]' }
    ],
    toDOM : () => ["span", {class : "del"}, 0]
}
