import { MarkSpec } from "prosemirror-model";

export const AddMark : MarkSpec = {
    parseDOM :  [
        {tag : 'add'},
        { tag: 'span[class=add]' }
    ],
    toDOM : () => ["span", {class : "add"}, 0]
}
