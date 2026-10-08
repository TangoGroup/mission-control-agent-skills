# Troubleshooting an agent that isn't performing

## Gather evidence

You need three things: what the agent did, what the user wanted, and the agent's setup.

1. **What it did.** Best: the user @mentions you in the thread where the agent replied. You then see that thread's recent messages (about 30 messages or 24,000 characters). Use `read_thread` for the full thread and `search_messages` for earlier context. You can only read conversations you're a member of or channels in projects you can use. If the problem happened in someone's 1:1 DM with the agent, ask them to paste the exchange.
2. **What they wanted.** Ask for the ideal answer, written out or described. "Better" isn't enough.
3. **The setup.** Ask them to paste the system prompt and wiki instructions. Read space instructions yourself from `wiki/<space>/SCHEMA.md` when you have access. Ask for the Wiki tab settings, attached projects, MCP servers, and model.
4. **Pattern.** Every time, or only some people, some channels, some kinds of request?

Before diagnosing, check the playbook space for a matching known issue.

## Symptom → likely causes

| Symptom | Check first |
|---|---|
| Ignores an instruction | Is it only in wiki or space instructions (read only when the wiki is used, and ranked lower)? Does another instruction conflict? Is it buried in a very long prompt? |
| Doesn't use the wiki / says it doesn't know | No "when to use the wiki" line in the system prompt. Space not granted (`shared/` and named spaces need grants). Wiki access off. The fact was never written. |
| Writes wiki pages in the wrong place | Wiki instructions don't say where each kind of fact goes. Default space is the conversation, so DM facts stay in the DM's space. `people/` and restricted pages are pinned to the conversation by design. |
| Wiki writes fail | Lint errors; job has no writable space (own space off, read-only grants, no conversation or project). |
| Tool missing or not used | The requester lacks access to that MCP server, so its tools were dropped. The server failed to connect or its OAuth expired. Project-only MCP used outside the project. The prompt names the wrong tool (server renamed). The prompt never says when to use it. |
| Can't see a project's board, files, or channels | It isn't that project's agent (or, if workspace-wide, isn't attached there), or the requester isn't a project member. |
| Someone can't find or DM the agent | It's a project agent and they aren't a home-project member (admins included). |
| Can't attach the agent to another project or channel | Project agents stay in their home project. Create a project agent there, or use a workspace-wide agent. |
| Forgets something said earlier in a long thread | Only ~30 recent messages are visible. The prompt should tell it to use `search_messages` for older context, or the fact should be in the wiki. |
| Different answers for different people | MCP access differs by person. Different conversations have different wiki spaces. |
| Email or trigger didn't run | Filters don't all match. Agent paused. Trigger posts to a channel outside the agent's scope (paused with reason `scope`), or in a project it's no longer attached to. |
| A wiki save fails on a space with custom page types | Wrong folder for the type, missing sections or required fields, or an unknown `type:`. Check the space's SCHEMA.md. |
| Stopped while signing up for a service | CAPTCHA, phone check, single sign-on, payment, or terms that forbid automation. A person finishes that step. |
| A procedure isn't followed, or a skill is never used | The skill's description doesn't match how people phrase the request. Folder name and `name:` don't match. Repo skill not merged to `main`. Skill not on the agent's Skills tab. |
| Format, length, or tone is wrong | No output section, or no example of the desired output. |
| Overreaches (acts without asking) | No approval rule for write, send, or delete tools. |
| Shallow or sloppy reasoning | Model too small for the job; ask what model is set. |

## Diagnose

- Name the most likely cause and the evidence for it (quote the agent's output and the instruction involved). Give a second candidate if the evidence is mixed.
- Separate prompt problems from settings problems. A settings problem can't be fixed with more prompt text.
- Don't rewrite the whole prompt to fix one behavior. Make the smallest change that addresses the cause.

## Report format

1. What went wrong, in one or two sentences.
2. Cause, with evidence.
3. Fix: exact text changes (before → after, with character counts) and/or settings changes by tab.
4. Test: the message to resend and what a pass looks like.
5. If it's a pattern other agents could hit, record it in the playbook (see your wiki instructions).
