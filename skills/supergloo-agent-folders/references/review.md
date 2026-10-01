# Reviewing or fixing a folder agent

## Gather

1. Read the agents folder's `README.md` and the agent's `AGENTS.md`, plus any files it points to.
2. Ask what went wrong: what you produced, and what they wanted instead. Ask for an example of the result they wanted.
3. Ask whether the Personalization snippet is in Settings › Agent › Personalization › Custom instructions. You can't read settings, so ask them to paste it if unsure.

## Checklist

**Likely causing the problem**
- No Personalization snippet, or it names a different folder than the one granted. Without it, `AGENTS.md` is only information you may or may not use.
- The request didn't match the trigger phrasings in `AGENTS.md` or `README.md`. Add the words the user actually uses.
- The folder isn't selected in the desktop message box, or its Mac was offline.
- Steps are vague ("summarize my week") instead of naming sources ("tasks I completed on my board since last Friday").
- No example of good output. Add one to `reference/`.
- A step needs something SuperGloo doesn't have: the workspace wiki, Linear, browser automation, scheduled runs, transcription, or an account that isn't connected.
- No "Ask me before" rule for something that sends or posts.

**Making it fragile or slow**
- `AGENTS.md` longer than a page or two. Move procedures to `skills/` and examples to `reference/`.
- Files the agent must read on every run that are large or numerous. Each read counts against the 24 tool steps per turn.
- Memory written to the folder on every run, which means a confirmation every time. Keep everyday facts in SuperGloo's own notes.
- Secrets or API keys in the folder. Move them to SuperGloo's settings (Agents › ⋯ on the SuperGloo row › Secrets).

**Should it still be a folder agent?**
- Other people now want it, it should run on a schedule, or the team should see its memory. Recommend turning it into a Public Agent with Agent Builder; the folder's files are a good starting point.

## Fix

- Make the smallest change that addresses the cause. Quote the current text and show the replacement.
- Ask for approval naming each file, then use `local_edit_file` with `confirm: true`.
- Give a test request and what a pass looks like.
