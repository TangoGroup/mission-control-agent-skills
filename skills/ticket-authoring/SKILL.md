---
name: ticket-authoring
description: Create and update well-formed Linear issues with specific titles, useful descriptions, one Feature/Bug/Chore label, resolvable assignees, Fibonacci estimates, priority/cycle, the capitalizable accounting label, and projects — selecting an existing one or creating a new one, including a new major-version project, when none fits. Load when asked to create a ticket, edit a Linear issue, estimate points, set bug priority, set the capitalization label, clean up ticket fields, or check ticket hygiene. Hygiene checks are read-only. Does not perform Completed On stamping.
---

# Ticket authoring

Use this focused procedure for ticket hygiene directly in Linear, the ticket system of record. It does not grant access or approval to change records; follow the invoking agent's authorization and tool-approval rules.

## When to use

- Create a Linear issue or update its authoring fields when requested.
- Check ticket hygiene without changing the issue.
- Estimate missing points from the issue's title, description, and scope.
- Set priority on a Bug-type ticket.
- Determine whether a ticket's work is capitalizable and apply the label.
- Select an existing Linear project, or create a new one (including a new major-version project) when none fits.

## Steps

### 1. Establish the target and current values

A request to **check ticket hygiene is read-only**: report gaps and proposed corrections, without writes, comments, transitions, or automatic repairs. A request to create or update an issue authorizes only the requested scope, subject to the invoking agent's approval rules.

Use the available Linear integration and its actual supported operations; do not invent tool names, field IDs, API payloads, or permissions. If the integration or a needed operation is unavailable, explain the blocker and provide a proposed issue or patch instead. Do not use a different account.

For a create, resolve the intended Linear team before selecting team-dependent fields. Use the workspace's approved routing configuration and resolve actual team IDs from Linear. In a multi-product team hierarchy:
- Route product-specific work to the appropriate product sub-team.
- Reserve the parent team for issues encompassing **all** products covered by that hierarchy, not merely more than one product.
- For ambiguous work or work spanning only some products, ask which product sub-team owns it; do not default to the parent or create duplicate issues.
- If routing configuration or team identity cannot be resolved, ask rather than inventing a team.

Keep private team names, IDs, and product launch states in the invoking agent's private configuration, not this public skill.

For an update or check, read the current issue first and confirm the target issue is unambiguous. Do not silently move an existing issue to a different team. Report a routing mismatch and ask before moving it.

Discover actual team-accessible labels, assignees, estimate settings, priorities, cycles, and projects before setting them. In this procedure, "sprint" means Linear's **Cycle**, "points" means its issue **estimate**, and Project means a native Linear **Project**. Use returned records and supported representations, not assumed numeric encodings. If the team's estimate settings cannot represent the required Fibonacci value, report the configuration gap; do not change team settings or substitute another scale.

### 2. Check the eight authoring groups

1. **Title:** non-empty and specific. Name the problem or deliverable, not merely "Fix issue" or "New feature."
2. **Description:** non-empty; state the problem and scope sufficiently for someone to understand the assignment. Do not fabricate missing requirements.
3. **Type:** exactly one explicit Linear label: Feature, Bug, or Chore. Title text is not a type label. Resolve the actual accessible label before writing; do not create a missing label. If the type is ambiguous, ask rather than silently inferring it from the title.
4. **Assignee:** a real, resolvable Linear assignee for anything expected to progress. A placeholder or unassigned value is a gap, not a completed assignment. If the responsible agent is not assignable in Linear, ask for a resolvable accountable owner; do not invent an agent identity or choose an arbitrary person.
5. **Points:** use the Fibonacci scale capped at 1, 2, 3, 5, 8. When points are missing and scope is sufficient, score the ticket using `references/ticket-pointing-rubric.md`: rate the five dimensions (review burden, risk, uncertainty, verification gap, coordination), convert the total to points, and apply the rubric's floors and overrides. A result of 8 means the rubric calls for proposing a split into smaller phase sub-tickets rather than issuing a single large estimate; propose the split and do not create children unless asked. Explicitly note in the description or an authorized issue comment that the estimate was agent-generated, rather than requester-provided, and record the rubric's dimension breakdown. Preserve valid existing estimates unless asked to revise them. A parent ticket — one whose points are carried by its phase sub-tickets — receives no points; do not assign them, per the rubric's ticket-type table. During a read-only check, suggest an estimate and its provenance in the response only. These are effort-and-risk estimates, not delivery-time promises. If scope is too unclear to score responsibly under the rubric's readiness check, ask for clarification or report "Needs refinement."
6. **Priority and cycle:** priority is None, Low, Medium, High, or Urgent. For a Bug-type ticket where priority is not explicitly requested, determine it using `references/bug-priority-rubric.md` (P0→Urgent, P1→High, P2→Medium, P3→Low): work through its decision questions, apply its rules, and record the rationale. Never lower a priority a human already set; propose the change and flag it instead. Flag for human review rather than guessing when the rubric's own review triggers apply (unclear scope or workaround, conflicting evidence, a theological or pastoral call), and still surface a P0 result immediately rather than waiting on review. This rubric only sets the Priority field on a ticket already being created or updated under this skill — it is not an upstream triage, alerting, or auto-ticketing workflow, and it never decides whether a ticket should exist. For Feature and Chore tickets, set the requested priority using Linear's supported representation; do not invent urgency. Use an existing cycle belonging to the selected team when relevant and known. An omitted cycle does not mean "remove the current cycle." Do not create cycles or change team settings to satisfy a ticket.
7. **Project:** select an existing Linear project by its resolved identity and exact existing name when one fits the work. When no existing project fits — including when the work starts a new major version (v2, v3, ...) of an existing product line — create a new Linear project with a clear, specific name and attach the ticket to it. Verify the project is or will be available to the intended team. If multiple existing projects could apply, ask rather than guessing; never invent a spelling or decide project identity from approximate name similarity. Creating a project is a deliberate conclusion that no existing project fits, not a fallback for an ambiguous match.
8. **Capitalization label:** determine whether the ticket's work is capitalizable using `references/capitalization-rubric.md`, based on the project launch state of the ticket's resolved project (step 7). Apply or omit the `capitalizable` label accordingly and record the rubric's reasoning.

### 3. Create or patch minimally

**Create:** populate all eight groups at creation time where known. Cycle is conditional. If essential details are unresolved, explain them before claiming the issue is complete or ready to progress. If the user authorizes creating an incomplete issue, distinguish it clearly from a complete issue. Before retrying an uncertain create, look for the issue already created by that request to avoid duplicates.

**Update:** preserve existing valid values. Patch only what the request actually changes; do not blank or default title, description, assignee, estimate, priority, cycle, project, or the capitalizable label merely because another field is being edited. Missing or invalid unrelated fields can be reported without silently changing them. Do not change team, status, or any other field as an incidental hygiene repair.

If changing Type requires replacing the label list, preserve all unrelated labels and remove only the superseded type labels. The `capitalizable` label follows the capitalization rubric rather than being blindly preserved or blindly removed — re-run step 8 whenever Type or Project changes, since either can change the rubric's answer. Do not alter any other accounting field or label this skill does not own (cost, labor hours, journal dates, final accounting treatment). If the available operation cannot preserve unrelated values, stop and report the limitation rather than issuing a destructive replacement. Re-read before a full-list replacement if needed to avoid overwriting concurrent changes.

A description-only update must leave assignee, estimate, priority, cycle, project, the capitalizable label, title, type, unrelated labels, team, and status unchanged. Do not add an estimate as a side effect of such an update.

### 4. Verify the saved record

Read back the created or updated Linear issue. Confirm the intended fields persisted, record references resolve, and untouched fields remain unchanged. Review operation inputs for excluded fields or calls. Verifying the `capitalizable` label is in scope; do not inspect deeper accounting data (cost, labor hours, journal entries, final treatment) or read/write Completed On to verify authoring. If independent automation reacts to a Linear write, distinguish that from this skill's actions.

## Output

Return the Linear issue reference/link, a short summary of fields created or changed, and any unresolved gaps. Identify agent-generated estimates, rubric-derived priorities, and rubric-derived capitalization labels explicitly. For checks, return findings and proposed corrections only. Distinguish proposed, saved, and verified results; do not claim verification if read-back failed.

## Reference files

- `references/acceptance-tests.md`: sanitized example and acceptance scenarios for routing, field quality, minimal updates, read-only checks, and excluded operations. Read when testing installation or reviewing a change to this skill. Use authorized Linear test issues, not real operational issues.
- `references/ticket-pointing-rubric.md`: the five-dimension rubric used to score Points during authorized creation or estimation. Read before estimating points on any ticket.
- `references/bug-priority-rubric.md`: the decision-question rubric used to set Priority on Bug-type tickets only. Read before setting priority on a bug.
- `references/capitalization-rubric.md`: the rubric used to apply or omit the `capitalizable` label, based on the resolved project's project launch state. Read before authoring or editing any ticket.
