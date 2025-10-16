"use client";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet, EditorView } from "prosemirror-view";
import { DOMSerializer, Node } from "prosemirror-model";

const key = new PluginKey("pagination");

const WIDTH_EXT = 794;
const WIDTH_INT = 594;
const PADDING = 96;
const HEIGHT_EXT = 1123;
const HEIGHT_INT = 931;

export default function createPaginationPlugin(
  document: Document,
  pageHeight = HEIGHT_INT
) {
  return new Plugin({
    key,
    state: {
      init: () => ({ active: false }), //TODO change for true in prod
      apply(tr, pluginState) {
        const meta = tr.getMeta(key);
        if (meta?.active !== undefined) {
          return { active: meta.active };
        }
        return pluginState;
      },
    },
    props: {
      attributes: (state) => {
        return {
          style: `outline: none !important; width:${
            key.getState(state).active ? WIDTH_EXT : WIDTH_INT
          }px; ${
            key.getState(state).active ? "" : "padding : " + PADDING + "px"
          }`,
        };
      },
      decorations(state) {
        const pluginState = key.getState(state);
        //Mode sans page.
        if (!pluginState.active) return null;

        const decorations: Decoration[] = [];

        const temp = document.createElement("div");
        temp.id = "hey";
        temp.style.position = "absolute";
        temp.style.visibility = "visible";
        temp.style.wordBreak = "break-word";
        temp.style.width = WIDTH_EXT + "px";
        document.body.appendChild(temp);

        const serializer = DOMSerializer.fromSchema(state.schema);

        const items: {
          pos: number;
          end: number;
          el: HTMLElement;
          attrs: Node["attrs"];
        }[] = [];

        state.doc.forEach((node, pos) => {
          if (!node.isBlock) return;
          const el = document.createElement("div");
          el.style.paddingLeft = `${(node.attrs.paddingLeft || 0) + 72}pt`;
          el.style.paddingRight = `${(node.attrs.paddingRight || 0) + 72}pt`;
          el.style.borderLeft = "1px solid transparent";
          el.style.borderRight = "1px solid transparent";
          const child = serializer.serializeNode(node);

          if (node.textContent == "") {
            child.textContent = "\u00A0";
          }
          el.appendChild(child);

          temp.appendChild(el);
          items.push({ pos, end: pos + node.nodeSize, el, attrs: node.attrs });
        });

        let currentHeight = 0;
        let pageStart: number | null = null;

        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const h = item.el.getBoundingClientRect().height || 0;

          if (pageStart === null) {
            pageStart = item.pos;
            // widget de début de page
            decorations.push(
              Decoration.widget(item.pos, () => {
                const div = document.createElement("div");
                div.className = "page-start";
                return div;
              })
            );
          }

          if (currentHeight + h > pageHeight) {
            const heightWidget = HEIGHT_INT - currentHeight;
            decorations.push(
              Decoration.widget(item.pos, () => {
                const div = document.createElement("div");
                div.className = "page-widget";
                div.style.height = `${heightWidget}px`;
                return div;
              })
            );
            pageStart = null;
            currentHeight = 0;
            i = --i;

            continue;
          }

          decorations.push(
            Decoration.node(item.pos, item.end, {
              class: "page-node",
              style: `
              padding-left : ${(item.attrs.paddingLeft || 0) + 72}pt;
              padding-right: ${(item.attrs.paddingRight || 0) + 72}pt;`,
            })
          );

          currentHeight += h;

          if (i == items.length - 1) {
            // combler la page
            decorations.push(
              Decoration.widget(item.end, () => {
                const div = document.createElement("div");
                div.className = "page-widget";
                const heightWidget = HEIGHT_INT - currentHeight;
                div.style.height = `${heightWidget}px`;
                return div;
              })
            );
          }
        }
        temp.remove();
        return DecorationSet.create(state.doc, decorations);
      },
    },
  });
}
// Pour activer/désactiver
export const togglePagePlugin = (view: EditorView, active: boolean) => {
  // view.dispatch(view.state.tr.setMeta(key, { active }));
  view.dispatch(view.state.tr.setMeta(key, { active : false })); //TODO del 
};
