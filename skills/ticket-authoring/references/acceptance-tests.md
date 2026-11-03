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
- All seven authoring groups are populated with valid values; priority/cycle is one group.
- Type is an explicit Feature label, not just title text.
- Assignee and project resolve to the selected existing records; cycle belongs to the selected team.
- The estimate uses the team's supported representation of 5 points. Priority uses the supported representation of High.
- Points remain requester-provided; the agent does not falsely call them its own estimate.
- Read-back confirms saved values and the response links the issue.

Variants:
- Omit points but retain sufficient scope: a Fibonacci estimate is saved and explicitly attributed as agent-generated. For 13 or more, recommend decomposition without automatically creating children.
- Insufficient scope: ask rather than inventing requirements or an estimate.
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
- No Mission Control board create, update, or mirroring occurs.
- No accounting classification or accounting-field/label mutation occurs; no Completed On read/write occurs.
- No project, label, cycle, or team is created; no team estimate settings are changed.
- No incidental status transition occurs.
- When changing Feature to Bug, only superseded type labels are removed; unrelated labels and fields are preserved. If safe preservation is unsupported, no destructive replacement occurs.

This checks the invoking agent's actions. If independent downstream automation reacts to a Linear write, record that separately rather than misrepresenting it as a direct action of this skill.
