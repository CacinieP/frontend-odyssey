#!/usr/bin/env python3
"""
Sync generated wiki docs to GitHub Wiki repository.
"""
from __future__ import annotations
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WIKI_DIR = ROOT / '.wiki-docs'
REPO_SLUG = "CacinieP/frontend-odyssey"
WIKI_REMOTE = f"https://github.com/{REPO_SLUG}.wiki.git"


def run(cmd: list[str], cwd: Path | None = None, check: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, cwd=cwd, text=True, capture_output=True, check=check)


def get_auth_remote() -> str:
    # Try gh auth token first
    res = subprocess.run(["gh", "auth", "token"], text=True, capture_output=True)
    if res.returncode == 0 and res.stdout.strip():
        token = res.stdout.strip()
        return f"https://{token}@github.com/{REPO_SLUG}.wiki.git"
    return WIKI_REMOTE


def main():
    # 1. Ensure .wiki-docs are generated
    subprocess.run([sys.executable, str(ROOT / 'scripts' / 'prepare_wiki.py')], check=True)

    auth_remote = get_auth_remote()

    # 2. Check if the remote wiki repository is initialized
    print(f"🔍 Checking if GitHub Wiki for {REPO_SLUG} is initialized...")
    check_remote = subprocess.run(["git", "ls-remote", auth_remote], text=True, capture_output=True)
    if check_remote.returncode != 0:
        print("\n" + "=" * 60)
        print("⚠️  GitHub Wiki 仓库尚未在 GitHub 上初始化！")
        print("=" * 60)
        print(f"👉 原因：GitHub 要求首次使用 Wiki 时必须通过网页端创建第一个页面。")
        print(f"👉 步骤：")
        print(f"   1. 在浏览器中打开: https://github.com/{REPO_SLUG}/wiki")
        print(f"   2. 点击绿色按钮 'Create the first page' (或直接点 Save)")
        print(f"   3. 完成后再次运行此脚本: pnpm wiki:sync")
        print("=" * 60 + "\n")
        sys.exit(1)

    # 3. Clone and sync
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        print(f"📥 Cloning {WIKI_REMOTE}...")
        run(["git", "clone", auth_remote, "repo"], cwd=tmp_path)
        wiki_repo = tmp_path / "repo"

        # Copy all files from .wiki-docs to wiki_repo
        for item in WIKI_DIR.iterdir():
            if item.is_file():
                shutil.copy2(item, wiki_repo / item.name)

        # Check git status
        status = run(["git", "status", "--porcelain"], cwd=wiki_repo).stdout.strip()
        if not status:
            print("✨ Wiki is already up to date! Nothing to commit.")
            return

        run(["git", "add", "."], cwd=wiki_repo)
        run(["git", "commit", "-m", "docs: sync frontend-odyssey documentation to wiki"], cwd=wiki_repo)
        print("🚀 Pushing updates to GitHub Wiki...")
        run(["git", "push", "origin", "master"], cwd=wiki_repo)
        print(f"✅ Successfully updated GitHub Wiki: https://github.com/{REPO_SLUG}/wiki")


if __name__ == '__main__':
    main()
