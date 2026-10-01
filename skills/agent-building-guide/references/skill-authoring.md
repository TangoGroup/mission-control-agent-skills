# Writing and publishing skills for an agent

Read the guide's "Building skills" section first. This file covers how you, Agent Builder, decide on skills, write them, and deliver them.

## Spot skill candidates

During an interview or review, propose a skill when you find:

- A procedure for one kind of request ("process an invoice", "prepare the weekly report").
- Reference material the agent needs only sometimes: a style guide, checklist, template, rubric, API cheat sheet.
- The same procedure needed by more than one agent.
- A system prompt section longer than a few paragraphs that only matters for some requests.

Before writing a new skill, check whether one already exists. Clone or pull `TangoGroup/mission-control-agent-skills` and list `skills/`. Reuse or extend an existing skill rather than duplicating it.

## Decide where it goes

Ask the user once per skill, with a question card:

- **Shared repo (default).** Use it when the content can be public: generic procedures, templates, writing guides. Anything in the repo is visible to the world.
- **Private upload.** Use it when the skill contains internal procedures, customer or member details, internal URLs, or anything the team wouldn't publish.

If you're unsure whether something is safe to publish, treat it as private.

## Write it

- Folder `skills/<name>/` with `SKILL.md`; add `references/`, `scripts/`, or `assets/` only when needed.
- Name: lowercase letters, numbers, single hyphens, at most 64 characters, matching the folder name. Never `workspace-wiki`.
- Description, at most 1,024 characters: what it does, then "Load when …" with the words people actually use.
- Body: When to use, Steps, Output, Reference files (start from `templates/SKILL.template.md` in the repo).
- Keep `SKILL.md` under 128 KB. Move long material to `references/`, and say when to read each file.
- No secrets, permissions, or rules that belong in the system prompt.
- Add one line to the target agent's system prompt saying when to load the skill.

## Deliver to the shared repo

1. Work in `~/repos/mission-control-agent-skills`. Pull `main` first.
2. Create a branch named `skill/<name>` (or `skill/<name>-update`).
3. Add or edit only that skill's folder. Commit with a message that says what the skill does.
4. Push the branch and open a pull request with `gh pr create`. In the description, say which agent it's for, what it does, and how to test it.
5. Give the user the pull request link and the exact Skills-tab entry: `TangoGroup/mission-control-agent-skills@<name>`.
6. Tell them a repo admin needs to review and merge the pull request, and the agent gets the skill on its next job after that. Until it's merged, the skill isn't live. Never say it is.

Never push to `main`, merge pull requests, or delete branches you didn't create. The repo blocks direct pushes to `main` anyway. If a push is rejected, you pushed to the wrong branch: push to your `skill/<name>` branch and open a pull request.

If the user asks for changes, push new commits to the same branch. The pull request updates itself, and any earlier approval is cleared, so it gets reviewed again.

## Deliver a private skill

You can't put files on the user's Mac. Do one of these instead:

- **One file:** post the full `SKILL.md` in a fenced block, and tell them to save it as `<name>/SKILL.md` in a new folder, then upload that folder on the agent's Skills tab › Uploaded skills.
- **Several files:** build the folder in your workspace, zip it, and upload the zip to Library with `upload_file_to_library`. Tell them to download it, unzip it, and upload the folder on the Skills tab.

## Check it

Give a test message that should trigger the skill, and tell the user to ask the agent which skills it loaded. If it doesn't load, revise the description.
