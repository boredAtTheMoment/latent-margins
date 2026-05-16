from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import date, datetime
from pathlib import Path
from typing import TypeGuard, cast

import frontmatter

SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
POST_EXTENSIONS = (".md", ".mdx")
REQUIRED_FIELDS = ("title", "description", "pubDate", "tags", "draft")


@dataclass(frozen=True)
class ValidationError:
    path: Path
    message: str


def is_string_list(value: object) -> TypeGuard[list[str]]:
    if not isinstance(value, list):
        return False

    items = cast(list[object], value)
    return all(isinstance(item, str) for item in items)


def validate_posts(content_dir: Path) -> list[ValidationError]:
    errors: list[ValidationError] = []

    if not content_dir.exists():
        return [ValidationError(content_dir, "content directory does not exist")]

    for path in sorted(
        item for item in content_dir.iterdir() if item.is_file() and item.suffix in POST_EXTENSIONS
    ):
        errors.extend(validate_post(path))

    return errors


def validate_post(path: Path) -> list[ValidationError]:
    errors: list[ValidationError] = []

    if not SLUG_RE.match(path.stem):
        errors.append(ValidationError(path, "slug must be lowercase kebab-case"))

    post = frontmatter.load(str(path))
    metadata = post.metadata

    for field in REQUIRED_FIELDS:
        if field not in metadata:
            errors.append(ValidationError(path, f"missing required field: {field}"))

    if "title" in metadata and not isinstance(metadata["title"], str):
        errors.append(ValidationError(path, "title must be a string"))

    if "description" in metadata and not isinstance(metadata["description"], str):
        errors.append(ValidationError(path, "description must be a string"))

    pub_date = metadata.get("pubDate")
    if pub_date is not None and not isinstance(pub_date, date | datetime):
        errors.append(ValidationError(path, "pubDate must be a date"))

    tags = metadata.get("tags")
    if tags is not None and not is_string_list(tags):
        errors.append(ValidationError(path, "tags must be a list of strings"))

    draft = metadata.get("draft")
    if draft is not None and not isinstance(draft, bool):
        errors.append(ValidationError(path, "draft must be a boolean"))

    return errors
