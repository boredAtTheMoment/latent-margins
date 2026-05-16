# Latent Margins

Latent Margins is a static Astro site for technical writing, machine learning notes, code-heavy
posts, Mermaid diagrams, and a small interactive break page.

Production URL:

```text
https://boredatthemoment.github.io/latent-margins/
```

GitHub Pages hosts the built static site from the `dist` artifact produced by GitHub Actions.

## Quick Start

Install JavaScript dependencies:

```bash
npm install
```

Install Python tooling:

```bash
uv sync
```

Run the dev server:

```bash
npm run dev
```

Build the site:

```bash
npm run build
```

Run the full check suite:

```bash
npm run check:all
```

## Repository Map

- `src/pages`: Astro routes. `src/pages/blog/[...slug].astro` creates one route per published blog
  post.
- `src/content/blog`: Markdown and MDX blog posts.
- `src/content/resume`: Resume content.
- `src/content/config.ts`: Astro content collection schemas for blog and resume content.
- `src/layouts`: Shared page and article layouts.
- `src/components`: Reusable Astro components, including `SignalLabGame.astro`.
- `src/lib`: Site helpers for paths, post sorting, dates, tags, and reading time.
- `src/styles/global.css`: Global styling.
- `public`: Static assets copied directly into the build output.
- `tools/blogtools`: Python authoring and validation tools.
- `tests`: Python tests for the content tooling.
- `.github/workflows/deploy.yml`: GitHub Pages build and deploy workflow.

## Blog Posts

Add posts in `src/content/blog` as `.md` or `.mdx` files. The filename becomes the slug, so use
lowercase kebab-case:

```text
src/content/blog/my-new-post.md
```

That publishes at:

```text
/blog/my-new-post/
```

Each post needs frontmatter:

```md
---
title: "My New Post"
description: "A short summary for listings and metadata."
pubDate: 2026-05-15
tags: ["notes", "engineering"]
draft: false
---
```

Use `.mdx` only when a post needs MDX features. Regular posts should use `.md`.

More details are in `BLOG_POSTS.md`.

## Publishing Flow

The site is deployed by `.github/workflows/deploy.yml` on every push to `main`.

The workflow:

- Checks out the repository.
- Uses Node 22 with npm dependency caching.
- Builds with `npm run build`.
- Uploads the generated `dist` directory as a Pages artifact.
- Deploys the artifact to GitHub Pages.

The workflow is intentionally lean: it uses the hosted `ubuntu-24.04` runner, job-level minimal
permissions, a 10-minute timeout per job, and no extra language runtimes beyond Node for the Pages
build.

## Commands

```bash
npm run dev
```

Starts the Astro dev server.

```bash
npm run build
```

Runs `astro check` and builds the static site into `dist`.

```bash
npm run check
```

Runs TypeScript, ESLint, and Prettier checks.

```bash
npm run check:all
```

Runs the JavaScript checks plus Ruff, Pyright, Pytest, and blog content validation.

```bash
.venv/bin/blogtools validate
```

Validates blog frontmatter and filename slugs.

## Content Rules

Blog filenames must be lowercase kebab-case. Valid examples:

- `technical-blog-stack.mdx`
- `understanding-attention.md`
- `notes-on-evals.md`

Invalid examples:

- `My Post.md`
- `draft_post.md`
- `post-1!.mdx`

Required blog frontmatter fields are `title`, `description`, `pubDate`, `tags`, and `draft`.

Draft posts use `draft: true`; they are excluded from generated blog routes and listings.

## GitHub Pages Notes

The Astro config sets:

```js
site: "https://boredatthemoment.github.io",
base: "/latent-margins"
```

Keep both values aligned with the GitHub Pages project URL. If the repository or owner changes,
update `astro.config.mjs` before deploying.

In GitHub repository settings, Pages should use **GitHub Actions** as the source.

## Stack

- Astro for static rendering and content collections.
- MDX for posts that need component-level features.
- Shiki for syntax highlighting.
- Mermaid for diagrams.
- Python, uv, Typer, and python-frontmatter for content tooling.
- ESLint, Prettier, Ruff, Pyright, and Pytest for checks.
