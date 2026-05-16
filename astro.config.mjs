import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import { visit } from "unist-util-visit";

function textContent(node) {
  if (!node) {
    return "";
  }

  if (node.type === "text") {
    return node.value;
  }

  return (node.children ?? []).map(textContent).join("");
}

function rehypeMermaidCodeBlocks() {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (!parent || node.tagName !== "pre") {
        return;
      }

      const [code] = node.children ?? [];
      const classes = code?.properties?.className ?? [];
      const dataLanguage = node.properties?.dataLanguage;
      const isMermaid =
        dataLanguage === "mermaid" ||
        (code?.tagName === "code" && classes.includes("language-mermaid"));

      if (!isMermaid) {
        return;
      }

      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["mermaid"], "data-diagram": "mermaid" },
        children: [{ type: "text", value: textContent(node).trim() }]
      };
    });
  };
}

function rehypeCitationReferences() {
  const citationPattern = /\[@([A-Za-z0-9_-]+)\]/g;

  return (tree) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || typeof node.value !== "string" || !node.value.includes("[@")) {
        return;
      }

      const children = [];
      let cursor = 0;
      for (const match of node.value.matchAll(citationPattern)) {
        const matchIndex = match.index ?? 0;
        const citationId = match[1];

        if (matchIndex > cursor) {
          children.push({ type: "text", value: node.value.slice(cursor, matchIndex) });
        }

        children.push({
          type: "element",
          tagName: "sup",
          properties: { className: ["citation-ref-wrap"] },
          children: [
            {
              type: "element",
              tagName: "a",
              properties: {
                className: ["citation-ref"],
                href: `#cite-${citationId}`,
                dataCitationId: citationId
              },
              children: [{ type: "text", value: citationId }]
            }
          ]
        });
        cursor = matchIndex + match[0].length;
      }

      if (cursor < node.value.length) {
        children.push({ type: "text", value: node.value.slice(cursor) });
      }

      if (children.length) {
        parent.children.splice(index, 1, ...children);
      }
    });
  };
}

export default defineConfig({
  site: "https://boredatthemoment.github.io",
  base: "/latent-margins",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: "vitesse-light",
      wrap: true
    },
    rehypePlugins: [rehypeMermaidCodeBlocks, rehypeCitationReferences]
  }
});
