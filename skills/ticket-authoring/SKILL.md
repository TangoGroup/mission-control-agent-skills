---
name: ticket-authoring
description: Create and update well-formed Mission Control board tickets with specific titles, useful descriptions, explicit types, resolvable assignees, Fibonacci points, priority/sprint, and existing Project values. Load when asked to create a ticket, edit a task, clean up ticket fields, estimate points, or check ticket hygiene. Does not perform Linear sync, accounting classification, project creation/matching, or Completed On stamping.
---

# Ticket authoring

Use this focused procedure for ticket hygiene in Mission Control. It does not grant access or approval to change records; follow the invoking agent's authorization rules.

## When to use

- Create a board ticket, update its authoring fields, or check whether it is ready to progress.
- Estimate missing points from the ticket's title, description, and scope.
- Select an already-established Project value from existing board options.

This skill does **not** validate or write to Linear, set accounting labels or fields, create projects, decide project identity or cross-system matching, or read/write Completed On. Those operations belong exclusively to the Capitalization & Linear Sync agent. A status change into a completed state may signal downstream Completed-On stamping, but this procedure does not perform that work or trigger it with additional writes.

## Steps

### 1. Establish the target and current values

A hygiene check is read-only unless specific corrections are authorized. Report gaps without treating a request to check a ticket as permission to change it.

For a create, identify the intended board and project context. For an update, read the current ticket first. Use native Mission Control board tools, not database queries or external-system tools, for ticket operations.

Discover actual board statuses, tags, and custom-field options before setting them. Resolve an assignee against available member/agent identities rather than inventing an ID. Resolve sprint choices from the project's existing sprints when relevant. Do not assume that Points or Project has the same field ID or type on every board. If a needed field, option, or identity cannot be resolved, report the gap and ask for the missing choice rather than creating a substitute.

### 2. Check the seven authoring groups

1. **Title:** non-empty and specific. Name the problem or deliverable, not merely “Fix issue” or “New feature.”
2. **Description:** non-empty; state the problem and scope sufficiently for someone to understand the assignment. Do not fabricate missing requirements.
3. **Type:** exactly one explicit board tag: Feature, Bug, or Chore. Title text is not a type tag. Resolve the actual tag before writing. If the type is ambiguous, ask rather than silently inferring it from the title.
4. **Assignee:** a real, resolvable person or agent for anything expected to progress. A placeholder or unassigned value is a gap, not a completed assignment. Do not choose an arbitrary owner to fill the field.
5. **Points:** use the Fibonacci scale: 1, 2, 3, 5, 8, 13, and subsequent Fibonacci values. If missing and scope is sufficient, estimate from title, description, and scope. Explicitly note in the description or an authorized task comment that the estimate was agent-generated, rather than requester-provided. Preserve valid existing estimates unless asked to revise them.
   - 1–2: trivial or a few-hour fix.
   - 3: approximately half a day.
   - 5: approximately 1–2 days.
   - 8: approximately most of a week.
   - 13 or more: recommend breaking the work into smaller tickets; do not create children unless asked.
   These are estimation heuristics, not delivery promises. If scope is too unclear to estimate responsibly, ask for clarification.
6. **Priority and sprint:** priority is None, Low, Medium, High, or Urgent. Set the requested priority; do not invent urgency or a sprint commitment. Use an existing sprint when relevant and known. An omitted sprint does not mean “remove the current sprint.”
7. **Project:** select an existing Mission Control Project field value exactly, using its actual option ID when required. Use only an explicitly identified or already-established selection. If multiple values could apply or none matches, ask. Never invent a spelling, create an option, or decide project identity. Propose a new project only when explicitly asked; proposal is not creation.

### 3. Create or patch minimally

**Create:** populate all seven groups at creation time where known. Sprint is conditional. If essential details are unresolved, explain them before claiming the ticket is complete or ready to progress. If the user authorizes creating an incomplete draft, distinguish it clearly from a complete ticket.

**Update:** preserve existing valid values. Patch only what the request actually changes; do not blank or default title, description, assignee, points, priority, sprint, or Project merely because another field is being edited. Missing or invalid unrelated fields can be reported without silently changing them.

If changing Type requires replacing the tag list, preserve all unrelated tags and remove only the superseded type tags. Do not alter accounting tags. If the available operation cannot preserve unrelated values, stop and report the limitation rather than issuing a destructive replacement.

A description-only update must leave assignee, points, priority, sprint, Project, title, and type unchanged. Do not add a points estimate as a side effect of such an update.

### 4. Verify the saved record

Read back the created or updated ticket. Confirm the intended fields persisted, types and option references resolve, and untouched fields remain unchanged. Check the operation inputs for excluded fields or external calls. Do not call Linear or inspect accounting data to perform this verification.

## Output

Return the ticket reference, a short summary of fields created or changed, and any unresolved gaps. Identify agent-generated estimates explicitly. Distinguish proposed, saved, and verified results; do not claim verification if read-back failed.

## Reference files

- `references/acceptance-tests.md`: sanitized complete-ticket example and three acceptance scenarios. Read when testing installation or reviewing a change to this skill. Use a designated test board with authorization, not real operational tickets.
