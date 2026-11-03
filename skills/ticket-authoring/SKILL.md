---
name: ticket-authoring
description: Create and update well-formed Linear issues with specific titles, useful descriptions, one Feature/Bug/Chore label, resolvable assignees, Fibonacci estimates, priority/cycle, and existing projects. Load when asked to create a ticket, edit a Linear issue, estimate points, clean up ticket fields, or check ticket hygiene. Hygiene checks are read-only. Does not perform board sync, accounting classification, project creation, or Completed On stamping.
---

# Ticket authoring

Use this focused procedure for ticket hygiene directly in Linear, the ticket system of record. It does not grant access or approval to change records; follow the invoking agent's authorization and tool-approval rules.

## When to use

- Create a Linear issue or update its authoring fields when requested.
- Check ticket hygiene without changing the issue.
- Estimate missing points from the issue's title, description, and scope.
- Select an explicitly identified or already-established existing Linear project.

This skill does **not** create or update Mission Control board tickets, mirror tickets between systems, set accounting labels or fields, create projects, decide project identity or cross-system matching, or read/write Completed On. Those exclusions remain even if another agent or sync workflow has been retired. Do not perform downstream stamping or accounting work as a side effect of authoring.

## Steps

### 1. Establish the target and current values

A request to **check ticket hygiene is read-only**: report gaps and proposed corrections, without writes, comments, transitions, or automatic repairs. A request to create or update an issue authorizes only the requested scope, subject to the invoking agent's approval rules.

Use the available Linear integration and its actual supported operations; do not invent tool names, field IDs, API payloads, or permissions. If the integration or a needed operation is unavailable, explain the blocker and provide a proposed issue or patch instead. Do not fall back to creating a Mission Control ticket or using a different account.

For a create, resolve the intended Linear team before selecting team-dependent fields. Use the workspace's approved routing configuration and resolve actual team IDs from Linear. In a multi-product team hierarchy:
- Route product-specific work to the appropriate product sub-team.
- Reserve the parent team for issues encompassing **all** products covered by that hierarchy, not merely more than one product.
- For ambiguous work or work spanning only some products, ask which product sub-team owns it; do not default to the parent or create duplicate issues.
- If routing configuration or team identity cannot be resolved, ask rather than inventing a team.

Keep private team names and IDs in the invoking agent's private configuration, not this public skill.

For an update or check, read the current issue first and confirm the target issue is unambiguous. Do not silently move an existing issue to a different team. Report a routing mismatch and ask before moving it.

Discover actual team-accessible labels, assignees, estimate settings, priorities, cycles, and projects before setting them. In this procedure, “sprint” means Linear's **Cycle**, “points” means its issue **estimate**, and Project means an existing native Linear **Project**, not a Mission Control custom field. Use returned records and supported representations, not assumed numeric encodings. If the team's estimate settings cannot represent the required Fibonacci value, report the configuration gap; do not change team settings or substitute another scale.

### 2. Check the seven authoring groups

1. **Title:** non-empty and specific. Name the problem or deliverable, not merely “Fix issue” or “New feature.”
2. **Description:** non-empty; state the problem and scope sufficiently for someone to understand the assignment. Do not fabricate missing requirements.
3. **Type:** exactly one explicit Linear label: Feature, Bug, or Chore. Title text is not a type label. Resolve the actual accessible label before writing; do not create a missing label. If the type is ambiguous, ask rather than silently inferring it from the title.
4. **Assignee:** a real, resolvable Linear assignee for anything expected to progress. A placeholder or unassigned value is a gap, not a completed assignment. If the responsible agent is not assignable in Linear, ask for a resolvable accountable owner; do not invent an agent identity or choose an arbitrary person.
5. **Points:** use the Fibonacci scale: 1, 2, 3, 5, 8, 13, and subsequent Fibonacci values. During authorized creation or estimation, if points are missing and scope is sufficient, estimate from title, description, and scope. Explicitly note in the description or an authorized issue comment that the estimate was agent-generated, rather than requester-provided. Preserve valid existing estimates unless asked to revise them. During a read-only check, suggest an estimate and its provenance in the response only.
   - 1–2: trivial or a few-hour fix.
   - 3: approximately half a day.
   - 5: approximately 1–2 days.
   - 8: approximately most of a week.
   - 13 or more: recommend breaking the work into smaller issues; do not create children unless asked.
   These are estimation heuristics, not delivery promises. If scope is too unclear to estimate responsibly, ask for clarification.
6. **Priority and cycle:** priority is None, Low, Medium, High, or Urgent. Set the requested priority using Linear's supported representation; do not invent urgency or a cycle commitment. Use an existing cycle belonging to the selected team when relevant and known. An omitted cycle does not mean “remove the current cycle.” Do not create cycles or change team settings to satisfy a ticket.
7. **Project:** select an existing Linear project by its resolved identity and exact existing name. Use only an explicitly identified or already-established selection and verify it is available to the intended team. If multiple projects could apply or none matches, ask. Never invent a spelling, create a project, or decide project identity from approximate name similarity. Propose a new project only when explicitly asked; proposal is not creation.

### 3. Create or patch minimally

**Create:** populate all seven groups at creation time where known. Cycle is conditional. If essential details are unresolved, explain them before claiming the issue is complete or ready to progress. If the user authorizes creating an incomplete issue, distinguish it clearly from a complete issue. Before retrying an uncertain create, look for the issue already created by that request to avoid duplicates.

**Update:** preserve existing valid values. Patch only what the request actually changes; do not blank or default title, description, assignee, estimate, priority, cycle, or project merely because another field is being edited. Missing or invalid unrelated fields can be reported without silently changing them. Do not change team, status, or any other field as an incidental hygiene repair.

If changing Type requires replacing the label list, preserve all unrelated labels and remove only the superseded type labels. Do not alter accounting labels. If the available operation cannot preserve unrelated values, stop and report the limitation rather than issuing a destructive replacement. Re-read before a full-list replacement if needed to avoid overwriting concurrent changes.

A description-only update must leave assignee, estimate, priority, cycle, project, title, type, unrelated labels, team, and status unchanged. Do not add an estimate as a side effect of such an update.

### 4. Verify the saved record

Read back the created or updated Linear issue. Confirm the intended fields persisted, record references resolve, and untouched fields remain unchanged. Review operation inputs for excluded fields or calls. Do not inspect accounting data, read/write Completed On, or perform Mission Control board operations to verify authoring. If independent automation reacts to a Linear write, distinguish that from this skill's actions.

## Output

Return the Linear issue reference/link, a short summary of fields created or changed, and any unresolved gaps. Identify agent-generated estimates explicitly. For checks, return findings and proposed corrections only. Distinguish proposed, saved, and verified results; do not claim verification if read-back failed.

## Reference files

- `references/acceptance-tests.md`: sanitized example and acceptance scenarios for routing, field quality, minimal updates, read-only checks, and excluded operations. Read when testing installation or reviewing a change to this skill. Use authorized Linear test issues, not real operational issues.
