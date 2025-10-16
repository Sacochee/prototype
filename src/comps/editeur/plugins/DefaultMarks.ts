import { Schema } from "prosemirror-model";
import defaultFontSizePlugin from "./DefautlsMarks/DefaultFontSize";
import defaultFontFamilyPlugin from "./DefautlsMarks/DefaultFontFamily";
import defaultFontColorPlugin from "./DefautlsMarks/DefaultFontColor";

export default function(schema : Schema){
    return [
        defaultFontSizePlugin(schema),
        defaultFontFamilyPlugin(schema),
        defaultFontColorPlugin(schema)
    ]
}