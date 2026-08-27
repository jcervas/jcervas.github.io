#!/usr/bin/env python3
"""Do the ?v= cache-busting stamps still match the files they stamp?

Assets on this site are linked with a stamp that is the first hex digits of the
file's SHA-256:

    <script src="{{ '/maps/x/x.js' | relative_url }}?v=cfdbd8a6" defer></script>

The stamp is what makes a changed file a new URL, so a returning visitor stops
being served the copy they cached. Nothing generates it -- it is typed by hand
-- so editing an asset and forgetting its stamp is silent, and its effect is
invisible to whoever made the change: their own browser has no cache entry, so
the page looks right to them and stale to everybody else. Four data files had
drifted this way before this check existed.

Only the `| relative_url }}?v=` form is matched. That is the site's one
convention for stamps, and matching '?v=' loosely finds it inside minified
vendor bundles instead.

    python3 _bin/check-asset-stamps.py           # report, exit 1 if any stale
    python3 _bin/check-asset-stamps.py --fix     # rewrite them, exit 0
    python3 _bin/check-asset-stamps.py --staged  # only what this commit touches

--staged is what the pre-commit hook runs: a stamp is in scope if the file
carrying it is staged, or if the asset it points at is staged. Changing an
asset therefore fails the commit even when the page linking it was not touched,
which is exactly the case that goes unnoticed.
"""
import hashlib
import io
import os
import re
import subprocess
import sys

STAMP = re.compile(r"'(/[^']+)'\s*\|\s*relative_url\s*\}\}\?v=([0-9a-f]{6,12})")


def tracked(patterns):
    out = subprocess.run(["git", "ls-files", "-z"] + patterns,
                         capture_output=True, text=True).stdout
    return [p for p in out.split("\0") if p]


def staged():
    out = subprocess.run(["git", "diff", "--cached", "--name-only", "-z"],
                         capture_output=True, text=True).stdout
    return {p for p in out.split("\0") if p}


def digest(path, n):
    with open(path, "rb") as fh:
        return hashlib.sha256(fh.read()).hexdigest()[:n]


def main(argv):
    fix = "--fix" in argv
    only_staged = "--staged" in argv
    root = subprocess.run(["git", "rev-parse", "--show-toplevel"],
                          capture_output=True, text=True).stdout.strip()
    os.chdir(root)
    scope = staged() if only_staged else None

    stale, missing, checked, fixed = [], [], 0, 0
    for page in tracked(["*.html", "*.md", "*.markdown"]):
        if page.startswith("_site/"):
            continue
        try:
            text = io.open(page, encoding="utf-8").read()
        except (OSError, UnicodeDecodeError):
            continue
        out = text
        for m in STAMP.finditer(text):
            asset = m.group(1).lstrip("/")
            if scope is not None and page not in scope and asset not in scope:
                continue
            checked += 1
            if not os.path.exists(asset):
                missing.append((page, asset))
                continue
            want = digest(asset, len(m.group(2)))
            if want == m.group(2):
                continue
            stale.append((page, asset, m.group(2), want))
            if fix:
                out = out.replace(m.group(0),
                                  m.group(0)[:-len(m.group(2))] + want)
                fixed += 1
        if fix and out != text:
            io.open(page, "w", encoding="utf-8").write(out)

    for page, asset in missing:
        print("  no such asset  %s  (linked from %s)" % (asset, page))
    for page, asset, was, want in stale:
        print("  %-8s %s  %s -> %s" % ("fixed" if fix else "STALE",
                                       asset, was, want))
    scope_note = " (staged only)" if only_staged else ""
    if fix:
        print("%d stamp(s) checked%s, %d rewritten" % (checked, scope_note, fixed))
        if fixed:
            print("re-stage the pages above, then commit again")
        return 1 if missing else 0
    if stale or missing:
        print("%d stamp(s) checked%s, %d stale, %d unresolvable"
              % (checked, scope_note, len(stale), len(missing)))
        print("fix with:  python3 _bin/check-asset-stamps.py --fix")
        return 1
    print("%d stamp(s) checked%s, all current" % (checked, scope_note))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
