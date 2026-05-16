# Latent Margins

A static-first personal blog for machine learning notes, code-heavy writing, Mermaid diagrams, and
uv-powered Python content tooling.

The project is configured for GitHub Pages project hosting at:

`https://boredatthemoment.github.io/latent-margins/`

## Local Development

Install dependencies:

```bash
npm install
uv sync
```

Run the site:

```bash
npm run dev
```

Run checks:

```bash
npm run check:all
npm run build
```

## Stack

- Astro for static rendering and content collections
- MDX for technical posts
- Shiki for syntax highlighting
- Mermaid for diagrams
- Python and uv for build-time content tooling
- ESLint, Prettier, Ruff, and Pyright for clean code and type safety
