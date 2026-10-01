# Interview: building a folder agent

Ask 3–5 questions at a time. Skip anything the user already told you. Restate what you understood in two or three lines before drafting.

## 1. The job

1. What should this agent do for you, in one sentence?
2. What will you say when you want it? Collect two or three phrasings. These become the trigger line in `AGENTS.md` and the entry in `README.md`.
3. How often, and on which device? If it's mostly from your phone or by voice, the Mac with the folder must be on.

If the job is really for a team, needs to run on a schedule, or should keep memory others can read, stop and recommend a Public Agent built with Agent Builder.

## 2. Inputs

1. Where does the information come from? Your board and tasks, calendar, messages, Library documents, a connected account (Gmail, Drive, Slack, Notion), or files in the folder?
2. Is there a template, checklist, policy, or past example to follow? Ask them to put it in the folder, or paste it so you can save it to `reference/`.

Check that each source is reachable: call `list_integrations` for connected accounts.

## 3. Output

1. What does a great result look like? Ask for an example, and save it as `reference/example.md`.
2. Format and length.
3. Where it goes: shown in chat, saved to `outbox/`, a Library document, a message, a task.
4. What needs your OK first? Anything that sends, posts, or changes something other people see always does.

## 4. Memory

1. Is there anything it should remember between runs, such as priorities, people, preferences, or past decisions?
2. Where should it live?
   - **SuperGloo's own notes:** no confirmation, works when the Mac is off.
   - **`memory/notes.md` in the folder:** you can read and edit it, but each change needs your OK.

   A good default: SuperGloo's notes for everyday facts, and `memory/notes.md` for things you want to curate, with additions proposed at the end of each run.

## 5. Limits

1. What should it never do?
2. When should it stop and ask you?

## Mapping answers to files

| Answer | Goes in |
|---|---|
| Job, trigger phrasings | `AGENTS.md` (title, purpose, "Use this agent when") and a line in `README.md` |
| Inputs and steps | `AGENTS.md` › Steps |
| Long or occasional procedures | `skills/<name>/SKILL.md`, referenced from Steps |
| Templates, examples, policies | `reference/` |
| Output format and destination | `AGENTS.md` › Output |
| Approvals | `AGENTS.md` › Ask me before |
| Hard limits | `AGENTS.md` › Never |
| Memory | `memory/notes.md` and `AGENTS.md` › Before you start / At the end |
| "Open the right agent folder" | The Personalization snippet (once, for all folder agents) |

If `README.md` doesn't exist yet in the agents folder, create it in the same approval.
