# Ticket-authoring acceptance tests

Run only with authorization against designated Linear test issues. Discover actual teams, estimate settings, labels, projects, cycles, and a resolvable test assignee first. Never submit placeholders as identities. Capture before/after records and operation inputs. These are manual scenarios, not evidence of executed integration tests. Configure generic routing fixtures privately; do not put private team names or IDs in this public file.

## Sanitized example

- **Team:** the appropriate existing product sub-team
- **Title:** Add keyboard navigation to the review screen
- **Description:** Allow reviewers to move between review items using the keyboard; include visible focus states and cover the first/last-item boundaries.
- **Type:** Feature (an existing Linear label)
- **Assignee:** a named, resolvable Linear test assignee
- **Points:** 5 (Linear estimate)
- **Priority:** High
- **Project:** a requester-selected existing Linear project
- **Cycle:** an existing cycle in the selected team, when relevant

## 1. Create a complete issue

Request: “Create this issue in the specified product sub-team using the example title and description, Feature label, the identified test assignee, 5 points, High priority, and the specified existing project and cycle. Use ticket-authoring and tell me which skill you loaded.”

Pass:
- The issue is created directly in Linear in the resolved product sub-team; no Mission Control board copy is created.
- All eight authoring groups are populated with valid values; priority/cycle is one group.
- Type is an explicit Feature label, not just title text.
- Assignee and project resolve to the selected existing records; cycle belongs to the selected team.
- The estimate uses the team's supported representation of 5 points. Priority uses the supported representation of High.
- Points remain requester-provided; the agent does not falsely call them its own estimate.
- Read-back confirms saved values and the response links the issue.

Variants:
- No existing project fits the work: the agent creates a new Linear project with a clear name (including a new v2/v3 project under an already-launched product line) rather than forcing the ticket into an approximate match.
- Omit points but retain sufficient scope: the agent loads `ticket-pointing`, scores the ticket with that skill, saves the resulting Fibonacci estimate (capped at 8), and explicitly attributes it as agent-generated with its dimension breakdown. A total that resolves to 8 produces a proposed split into phase sub-tickets instead of a single large estimate, without automatically creating children. If `ticket-pointing` is not available, the agent reports that and does not invent a score.
- Insufficient scope: ask rather than inventing requirements, or report "Needs refinement" per the rubric's readiness check.
- Unsupported estimate scale: report the configuration gap without altering team settings or substituting a different scale.
- Responsible agent is not assignable: ask for a resolvable accountable owner; do not fabricate an identity or arbitrarily assign someone else.
- Create returns an uncertain result: look for the already-created issue before retrying; do not blindly duplicate it.

## 2. Description-only update preserves other fields

Save a before snapshot. Request: “Change only the description to: Allow keyboard navigation between review items, including visible focus and boundary behavior, with a shortcut reference. Leave every other field unchanged.”

Pass:
- Only description changes.
- Assignee, estimate, priority, cycle, project, title, type, unrelated labels, team, and status remain exactly as before.
- No blank, default, or reset values are sent for untouched fields.
- Read-back confirms preservation.

Variant: begin with points missing. A description-only update still does not insert an estimate; the missing field may be reported separately.

## 3. Hygiene check is strictly read-only

Request: “Check ticket hygiene on this issue.” Use an issue with missing points, missing assignee, and two type labels.

Pass:
- Reports gaps and proposed corrections, including a suggested estimate only if scope supports one.
- Performs no writes, comments, status transitions, or automatic repairs in any system.
- Does not claim the issue was fixed.

## 4. Routing and record resolution

Use a private fixture with one parent team and three product sub-teams.

Pass:
- Work specific to each product routes to its corresponding sub-team.
- Work explicitly encompassing all three products routes to the parent team.
- Work spanning two products, or with ambiguous product scope, prompts for an accountable product sub-team; it does not default to the parent or duplicate the issue.
- Unresolvable teams, missing labels, ambiguous same-name projects, or an incompatible cycle result in a clarification/blocker rather than invented IDs or new options.
- An existing issue in an unexpected team is not silently moved during a field edit or hygiene check.
- Project selection uses an existing native Linear project; no fuzzy project-identity or cross-system matching decision is made.

## 5. Excluded operations and label preservation

Review calls and operation inputs for creation and updates.

Pass:
- Linear reads/writes are limited to the authorized issue-authoring operation; checks use reads only.
- No ticket mirroring to another system occurs.
- No accounting data beyond the `capitalizable` label is touched — no cost, labor hours, journal dates, or final-treatment field is read or written; no Completed On read/write occurs.
- No label, cycle, or team is created; no team estimate settings are changed. A project is created only when no existing project fits the work (see scenario 1's variant), never as an incidental side effect of an unrelated update.
- No incidental status transition occurs.
- When changing Feature to Bug, only superseded type labels are removed; unrelated labels and fields are preserved. If safe preservation is unsupported, no destructive replacement occurs.

This checks the invoking agent's actions. If independent downstream automation reacts to a Linear write, record that separately rather than misrepresenting it as a direct action of this skill.

## 6. Parent tickets receive no points; phase sub-tickets are scored

Use a fixture parent ticket with two phase sub-tickets and a plan the agent can read.

Pass:
- The parent ticket is not assigned points; the agent cites the rubric's ticket-type table when explaining why.
- Each phase sub-ticket is scored independently by `ticket-pointing` against its five dimensions, with its own dimension breakdown and total. `ticket-authoring` persists each Linear estimate; `ticket-pointing` does not write the issue itself.
- Review burden on each phase sub-ticket reflects that phase's share of one combined end-of-parent review, not a full independent review.
- A phase sub-ticket scoring Uncertainty = 2 produces a recommendation to spike or revise the plan before the phase enters a cycle, while still recording a points value.
- A phase sub-ticket whose total converts to 8 produces a proposed split rather than a flat 8-point entry into a cycle, unless the team has already agreed the work cannot be split.
- A standalone ticket (no parent, not a phase of anything) is scored normally and does receive points.

## 7. Bug priority is set via the bug priority rubric, not invented or treated as triage

Use fixture bug tickets covering each rubric level and review trigger.

Pass:
- For a Bug-type ticket with no explicit priority requested, the agent works through `references/bug-priority-rubric.md`'s decision questions in order, stops at the first match, and records the rationale and the question number that decided it.
- The output priority maps correctly to Linear's representation (P0→Urgent, P1→High, P2→Medium, P3→Low).
- Feature and Chore tickets never run the bug priority rubric; they use the plain requested-priority behavior.
- The rubric is applied only to a ticket already being created or updated under this skill. The agent does not use it to decide whether an untracked issue should become a ticket, and does not describe its own behavior as upstream triage or alerting.

Variants:
- A ticket mislabeled Bug but actually describing new behavior: decision question 1 reclassifies it to Feature/Chore and no priority is assigned under this rubric.
- An existing ticket already has a human-set priority: the agent never silently lowers it; a rubric result lower than the current value is proposed and flagged, not written.
- A ticket matching P0 criteria (confirmed data exposure or a core function down for all users): priority is set to Urgent and surfaced immediately, not held for review.
- A ticket with unclear scope, conflicting evidence, or an explicitly theological or pastoral judgment call: the agent flags for human review instead of guessing a priority, per the rubric's review triggers.

## 8. Capitalization label follows project launch state

Use fixture projects covering both project launch states, plus a newly created project.

Pass:
- A ticket on a project marked **not launched** in private config: `capitalizable` is applied regardless of Type (Feature, Bug, or Chore).
- A ticket on a project marked **launched**: `capitalizable` is not applied, regardless of Type.
- A new project created during this authoring session (scenario 1's variant) defaults to not launched, so its first tickets receive `capitalizable` even if the parent product is already launched.
- Changing a ticket's Type or Project triggers re-evaluation of the label rather than leaving a stale value from before the change.
- No second "product approved" or similar label is ever applied — absence of `capitalizable` is read as "not capitalizable," not as a missing field to flag.
