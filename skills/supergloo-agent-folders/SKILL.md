---
name: supergloo-agent-folders
description: Build, review, or fix a "folder agent" for the user — a specialized assistant defined by files (AGENTS.md, skills, templates, memory) in a folder on their Mac that SuperGloo works as on request. Load when the user wants to create an assistant or agent for their own work, set up an agent folder, write or improve an AGENTS.md, turn a procedure they repeat into something reusable, or asks why an existing folder agent isn't behaving.
---

# Folder agents for SuperGloo

A folder agent is a set of files on the user's Mac that describe a job: what it's for, the steps, the output, and what to remember. When the user asks for that job, you read the folder's `AGENTS.md` and work by it. You are the runtime; the folder is the definition.

Folder agents are for **the user's own work**. If several people need the same help, if it should run on a schedule or react to events, or if the team should share its memory, recommend a **Public Agent** instead and suggest the workspace's Agent Builder agent.

## Files in this skill

| File | Use it for |
|---|---|
| `references/interview.md` | Building a new folder agent: questions to ask and how answers map to files. |
| `references/templates.md` | The folder layout and templates for `README.md`, `AGENTS.md`, a skill, memory, and the Personalization snippet. |
| `references/review.md` | Reviewing or fixing an existing folder agent: checklist and common problems. |

## Before you start any build, review, or fix

1. Call `list_local_folders`.
2. If no folder is listed:
   - On desktop, ask the user to select their agents folder with the folder control in the SuperGloo message box, or choose **Add folder…** there to grant and select one.
   - If they don't have one yet, ask them to create an empty folder (for example `Documents/Agents`), then grant and select it the same way.
   - If the folder is listed but its Mac is offline, say so and stop. Don't invent file contents.
3. Use one top-level agents folder with one subfolder per agent. Paths in `local_*` tools are relative to the granted folder, and writing a file creates any subfolders it needs.

## How to work

- **Build:** follow `references/interview.md`, then draft every file from `references/templates.md`.
- **Review or fix:** follow `references/review.md`.
- **Show before writing.** Present the full list of files to create or change, with their contents, in one message. Ask for one approval that names every path. Then call `local_write_file` or `local_edit_file` with `confirm: true` for exactly those files. If the user changes anything, show the change and ask again.
- **Prefer `local_edit_file` for small changes** to an existing file. Use `local_write_file` for new files or full rewrites.
- **You can't change Mission Control settings.** For the Personalization snippet, give the user the text and tell them where to paste it: Settings › Agent › Personalization › Custom instructions. Remind them those instructions apply to every agent run they start, and that the field holds 4,000 characters.
- **Keep files small and plain.** `AGENTS.md` should fit on a page or two. Move long procedures into `skills/<name>/SKILL.md` and examples into `reference/`, and say in `AGENTS.md` when to read each.
- **Write steps you can actually do.** Name sources the way you'd find them: "my tasks on my board", "my calendar this week", "my Gmail" (only if that account is connected), "files in reference/". Don't write steps that need tools you don't have: the workspace wiki, Linear, browser automation, scheduled runs, or transcription.
- **No secrets in folder files.** API keys belong in SuperGloo's Manage › Secrets.

## After a build or fix

1. Tell the user what you wrote and where.
2. Give them the Personalization snippet if they haven't added it yet.
3. Give a test request that should use the agent, for example "Do my weekly update", and say what a good result looks like.
4. Suggest they ask "Which files did you read?" after the test if the result looks off.
