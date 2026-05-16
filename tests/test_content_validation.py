from __future__ import annotations

from pathlib import Path

from blogtools.content import validate_post, validate_posts


def write_post(path: Path, frontmatter: str = "") -> None:
    path.write_text(
        frontmatter
        or """---
title: Valid Post
description: A good technical note.
pubDate: 2026-05-09
tags: ["python", "astro"]
draft: false
---

Body.
""",
        encoding="utf-8",
    )


def test_valid_post_passes(tmp_path: Path) -> None:
    post = tmp_path / "valid-post.mdx"
    write_post(post)

    assert validate_post(post) == []


def test_validate_posts_includes_markdown_and_mdx(tmp_path: Path) -> None:
    write_post(tmp_path / "valid-markdown.md")
    write_post(tmp_path / "valid-mdx.mdx")

    assert validate_posts(tmp_path) == []


def test_invalid_slug_is_reported(tmp_path: Path) -> None:
    post = tmp_path / "Invalid Slug.mdx"
    write_post(post)

    errors = validate_post(post)

    assert any("slug" in error.message for error in errors)


def test_missing_required_field_is_reported(tmp_path: Path) -> None:
    post = tmp_path / "missing-field.mdx"
    write_post(
        post,
        """---
title: Missing Field
description: No tags here.
pubDate: 2026-05-09
draft: false
---

Body.
""",
    )

    errors = validate_post(post)

    assert any("missing required field: tags" == error.message for error in errors)


def test_validate_posts_reports_missing_directory(tmp_path: Path) -> None:
    errors = validate_posts(tmp_path / "missing")

    assert len(errors) == 1
    assert "does not exist" in errors[0].message
