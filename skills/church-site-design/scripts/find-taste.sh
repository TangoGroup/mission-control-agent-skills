#!/usr/bin/env bash
# Print the folder of taste-skill's design-taste-frontend skill, or an install hint (exit 1).
for c in "${TASTE_SKILL_DIR:-}" "$HOME/.claude/skills/design-taste-frontend" "$HOME/.agents/skills/design-taste-frontend" "$HOME/.codex/skills/design-taste-frontend"; do
  [[ -n "$c" && -f "$c/scripts/inspect.mjs" ]] && { (cd "$c" && pwd -P); exit 0; }
done
f="$(find "$HOME/.claude/plugins" -path '*design-taste-frontend/scripts/inspect.mjs' 2>/dev/null | head -1)"
[[ -n "$f" ]] && { dirname "$(dirname "$f")"; exit 0; }
echo "taste-skill not found. Install it: npx skills add https://github.com/Leonxlnx/taste-skill (or set TASTE_SKILL_DIR)" >&2
exit 1
