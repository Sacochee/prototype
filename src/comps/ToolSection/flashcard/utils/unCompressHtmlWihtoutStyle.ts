export default function decompressHtml(html: string, dictionnaire: Record<string, string>): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const root = doc.body;

  function recurse(el: HTMLElement) {
    ["data-id", "class"].forEach((attr) => {
      const val = el.getAttribute(attr);
      if (val && dictionnaire[val]) {
        el.setAttribute(attr, dictionnaire[val]);
      }
    });

    for (const child of el.children) {
      if (child instanceof HTMLElement) {
        recurse(child);
      }
    }
  }

  recurse(root);

  return root.innerHTML;
}

