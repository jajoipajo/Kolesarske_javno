#!/usr/bin/env python
"""
Generate a Phyphox QR code for a .phyphox file hosted on GitHub.

Default behavior:
- Builds a raw.githubusercontent.com URL from the git remote + current branch
- Encodes as: phyphox://raw.githubusercontent.com/<user>/<repo>/<branch>/<path>

Requires:
  pip install qrcode[pil]
"""

from __future__ import annotations

import argparse
import os
import subprocess
from pathlib import Path


def run_git(args: list[str]) -> str | None:
    try:
        result = subprocess.run(
            ["git", *args],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
        return result.stdout.strip()
    except Exception:
        return None


def infer_repo_root() -> Path | None:
    root = run_git(["rev-parse", "--show-toplevel"])
    return Path(root) if root else None


def infer_branch() -> str | None:
    return run_git(["symbolic-ref", "--short", "HEAD"])


def infer_github_repo() -> str | None:
    remote = run_git(["remote", "get-url", "origin"])
    if not remote:
        return None
    remote = remote.strip()
    if remote.startswith("https://github.com/") and remote.endswith(".git"):
        return remote[len("https://github.com/") : -len(".git")]
    if remote.startswith("git@github.com:") and remote.endswith(".git"):
        return remote[len("git@github.com:") : -len(".git")]
    return None


def build_raw_url(path: Path, raw_base: str | None) -> str:
    if raw_base:
        return raw_base.rstrip("/") + "/" + path.as_posix()
    repo = infer_github_repo()
    branch = infer_branch()
    if not repo or not branch:
        raise RuntimeError(
            "Cannot infer GitHub repo/branch. Provide --raw-base or --url."
        )
    return f"https://raw.githubusercontent.com/{repo}/{branch}/{path.as_posix()}"


def to_phyphox_url(raw_url: str) -> str:
    if raw_url.startswith("https://"):
        return "phyphox://" + raw_url[len("https://") :]
    if raw_url.startswith("http://"):
        return "phyphox://" + raw_url[len("http://") :]
    if raw_url.startswith("phyphox://"):
        return raw_url
    return "phyphox://" + raw_url.lstrip("/")


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate a Phyphox QR code.")
    parser.add_argument(
        "file",
        help="Path to .phyphox file in the repo",
    )
    parser.add_argument(
        "output",
        help="Output PNG path for QR image",
    )
    parser.add_argument(
        "--raw-base",
        help="Base raw URL, e.g. https://raw.githubusercontent.com/user/repo/main",
    )
    parser.add_argument(
        "--url",
        help="Use exact URL instead of building from file path",
    )
    args = parser.parse_args()

    file_path = Path(args.file).resolve()
    if not file_path.exists():
        raise SystemExit(f"Input file not found: {file_path}")

    if args.url:
        raw_url = args.url
    else:
        repo_root = infer_repo_root()
        if repo_root is None:
            raise SystemExit("Cannot determine repo root. Run inside a git repo.")
        try:
            rel = file_path.relative_to(repo_root)
        except Exception as exc:
            raise SystemExit(
                f"Input file is not inside repo root: {repo_root}"
            ) from exc
        raw_url = build_raw_url(rel, args.raw_base)

    phyphox_url = to_phyphox_url(raw_url)

    try:
        import qrcode
    except Exception as exc:
        raise SystemExit(
            "Missing dependency. Install with: pip install qrcode[pil]"
        ) from exc

    img = qrcode.make(phyphox_url)
    out_path = Path(args.output).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path)
    print(phyphox_url)
    print(out_path)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
