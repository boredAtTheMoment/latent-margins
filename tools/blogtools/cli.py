from __future__ import annotations

from pathlib import Path

import typer

from .content import validate_posts

app = typer.Typer(help="Blogstack authoring and validation tools.")


@app.callback()
def main() -> None:
    """Build-time helpers for the static blog."""


@app.command()
def validate(content_dir: Path = Path("src/content/blog")) -> None:
    """Validate blog post frontmatter and slugs."""
    errors = validate_posts(content_dir)
    if errors:
        for error in errors:
            typer.echo(f"{error.path}: {error.message}", err=True)
        raise typer.Exit(code=1)

    typer.echo("All posts are valid.")
