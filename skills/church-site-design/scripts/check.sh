#!/usr/bin/env bash
# Check a built church site: taste-skill lint + inspector on every page, plus church checks.
#   bash check.sh <site dir> [--direction NN] [--page file.html]
# Screenshots and reports land in <site dir>/../.church-check/<page>/
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE="${1:?usage: check.sh <site dir> [--direction NN] [--page file.html]}"; shift
DIR=""; PAGE=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --direction) DIR="$2"; shift ;;
    --page) PAGE="$2"; shift ;;
  esac; shift
done
SITE="$(cd "$SITE" && pwd)"
OUT="$(dirname "$SITE")/.church-check"; mkdir -p "$OUT"

# Rules church sites legitimately relax (see references/house-rules.md)
ALLOW="eyebrow,micro-label,card-rows,pill-nav,shadow,hairline,outlined-box,numbering,few-pictures,no-footage,still-page,size-count"
case "$DIR" in
  01|1) ALLOW="$ALLOW,gradient,palette-claude,palette-terracotta,palette-cream" ;;
  02|2) ALLOW="$ALLOW,mixed-font-headline" ;;
  03|3) ALLOW="$ALLOW,gradient,mixed-font-headline,palette-claude,palette-terracotta,palette-cream" ;;
  05|5) ALLOW="$ALLOW,mixed-font-headline" ;;
  06|6) ALLOW="$ALLOW,palette-cream,palette-terracotta,focal-point" ;;
  07|7) ALLOW="$ALLOW,palette-cream,mixed-font-headline" ;;
  08|8) ALLOW="$ALLOW,palette-cream,mixed-font-headline,focal-point" ;;
  09|9) ALLOW="$ALLOW,mixed-font-headline" ;;
  10) ALLOW="$ALLOW,palette-cream,focal-point" ;;
esac

TASTE="$(bash "$HERE/find-taste.sh")" || TASTE=""
pages=()
if [[ -n "$PAGE" ]]; then pages=("$SITE/$PAGE"); else for f in "$SITE"/*.html; do pages+=("$f"); done; fi

status=0
if [[ -n "$TASTE" ]]; then
  echo "== taste-skill lint (rules relaxed for this direction are listed as info)"
  (cd "$SITE" && node "$TASTE/scripts/lint.mjs" . --json) | ALLOW="$ALLOW" node -e '
    let s = ""; process.stdin.on("data", (d) => s += d).on("end", () => {
      const allow = new Set(process.env.ALLOW.split(",")); let fail = 0;
      for (const f of JSON.parse(s).findings) {
        const lvl = allow.has(f.id) ? "info" : f.level; if (lvl === "FAIL") fail++;
        console.log(`${lvl.padEnd(4)} [${f.id}] ${f.file}:${f.line}  ${f.match.trim().slice(0, 60)}  ${lvl === "info" ? "" : f.message}`);
      }
      console.log(`lint: ${fail} FAIL`); process.exit(fail ? 1 : 0);
    });' || status=1
  for p in "${pages[@]}"; do
    name="$(basename "$p" .html)"
    echo; echo "== inspect $name"
    (cd "$SITE" && node "$TASTE/scripts/inspect.mjs" "$p" --out "$OUT/$name" --allow "$ALLOW") | sed -n '/^MEASURED/,$p' | grep -v '^\s*$' || status=1
  done
else
  echo "taste-skill not found: skipping lint and inspector. Check with screenshots instead."
fi

echo; echo "== church checks"
node "$HERE/church-check.mjs" "$SITE" "${DIR:-00}" "${TASTE:-}" ${PAGE:+"$PAGE"} || status=1
echo; echo "Screenshots: $OUT/<page>/"
exit $status
