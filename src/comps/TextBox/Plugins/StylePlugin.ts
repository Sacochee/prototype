"use client";
import { Plugin, PluginKey } from "prosemirror-state";


const key = new PluginKey("pagination");


export default function StylePlugin(

) {
  return new Plugin({
    key,
   
    props: {
      attributes: (state) => {
        return {
          style: `outline: none !important; padding : 10px; width : 330px; box-sizing : border-box;`,
        };
      },
  
    },
  });
}
