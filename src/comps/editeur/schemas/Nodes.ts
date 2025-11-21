import { DOMOutputSpec, NodeSpec } from "prosemirror-model";
import { Paragraph, ParagraphNode } from "./nodes/paragraph";
import { listItemNode, listItem } from "./nodes/listItem";
import { BulletList, BulletListNode } from "./nodes/bulletList";
import { OrderedList, OrderedListNode } from "./nodes/orderedList";
import { NodeArea } from "./nodes/temporary/NodeArea";
import { NodeHeading } from "./nodes/title";

const pDOM = ["p", 0] as DOMOutputSpec,
  blockquoteDOM = ["blockquote", 0] as DOMOutputSpec,
  hrDOM = ["hr"] as DOMOutputSpec,
  preDOM = ["pre", ["code", 0]] as DOMOutputSpec,
  brDOM = ["br"] as DOMOutputSpec;

/**
[Specs](https://prosemirror.net/docs/ref/#model.NodeSpec) for the nodes defined in this schema.
*/
interface nodes {
  /**
    NodeSpec The top level document node.
    */
  doc: NodeSpec;
  /**
    A plain paragraph textblock. Represented in the DOM
    as a `<p>` element.
    */
  paragraph: ParagraphNode;
  /**
    A blockquote (`<blockquote>`) wrapping one or more blocks.
    */
  blockquote: NodeSpec;
  /**
    A horizontal rule (`<hr>`).
    */
  horizontal_rule: NodeSpec;
  /**
    A heading textblock, with a `level` attribute that
    should hold the number 1 to 6. Parsed and serialized as `<h1>` to
    `<h6>` elements.
    */
  heading: NodeSpec;
  /**
    A code listing. Disallows marks or non-text inline
    nodes by default. Represented as a `<pre>` element with a
    `<code>` element inside of it.
    */
  code_block: NodeSpec;
  /**
    The text node.
    */
  text: NodeSpec;
  /**
    An inline image (`<img>`) node. Supports `src`,
    `alt`, and `href` attributes. The latter two default to the empty
    string.
    */
  image: NodeSpec;
  /**
    A hard line break, represented in the DOM as `<br>`.
    */
  hard_break: NodeSpec;

  orderedList: NodeSpec;

  bulletList: NodeSpec;

  listItem: NodeSpec;

  nodeArea: NodeSpec;
}

export const nodes: nodes = {
  /**
    NodeSpec The top level document node.
    */
  doc: {
    content: "block+",
  },
  /**
    A plain paragraph textblock. Represented in the DOM
    as a `<p>` element.
    */
  paragraph: Paragraph,
  /*
    A blockquote (`<blockquote>`) wrapping one or more blocks.
    */
  blockquote: {
    content: "block+",
    group: "block",
    defining: true,
    parseDOM: [{ tag: "blockquote" }],
    toDOM() {
      return blockquoteDOM;
    },
  },
  /**
    A horizontal rule (`<hr>`).
    */
  horizontal_rule: {
    group: "block",
    parseDOM: [{ tag: "hr" }],
    toDOM() {
      return hrDOM;
    },
  },
  /**
    A heading textblock, with a `level` attribute that
    should hold the number 1 to 6. Parsed and serialized as `<h1>` to
    `<h6>` elements.
    */
  heading: NodeHeading,
  /**
    A code listing. Disallows marks or non-text inline
    nodes by default. Represented as a `<pre>` element with a
    `<code>` element inside of it.
    */
  code_block: {
    content: "text*",
    marks: "",
    group: "block",
    code: true,
    defining: true,
    parseDOM: [{ tag: "pre", preserveWhitespace: "full" }],
    toDOM() {
      return preDOM;
    },
  },
  /**
    The text node.
    */
  text: {
    group: "inline",
  },
  /**
    An inline image (`<img>`) node. Supports `src`,
    `alt`, and `href` attributes. The latter two default to the empty
    string.
    */
  image: {
    inline: true,
    attrs: {
      src: { validate: "string" },
      alt: { default: null, validate: "string|null" },
      title: { default: null, validate: "string|null" },
    },
    group: "inline",
    draggable: true,
    parseDOM: [
      {
        tag: "img[src]",
        getAttrs(dom) {
          return {
            src: dom.getAttribute("src"),
            title: dom.getAttribute("title"),
            alt: dom.getAttribute("alt"),
          };
        },
      },
    ],
    toDOM(node) {
      let { src, alt, title } = node.attrs;
      return ["img", { src, alt, title }];
    },
  },
  /**
    A hard line break, represented in the DOM as `<br>`.
    */
  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{ tag: "br" }],
    toDOM() {
      return brDOM;
    },
  },

  orderedList: OrderedList,

  bulletList: BulletList,

  listItem: listItem,

  /**{ tag: 'div[data-autorize="true"]' }, pour les zone d'édition AI*/
  nodeArea: NodeArea,
};
