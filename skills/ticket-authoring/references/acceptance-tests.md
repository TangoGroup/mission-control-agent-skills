# Ticket-authoring acceptance tests

Run only on an authorized test board. Discover valid field options and a resolvable test assignee first. Replace placeholders with actual test identities and values; never submit placeholder strings as identities. Capture before/after records and operation inputs. These are manual scenarios, not evidence of an executed integration test.

## Sanitized example

- **Title:** Receipt qualification workflow (HITL)
- **Description:** Build the human-in-the-loop qualification flow for incoming receipts — flag ambiguous category matches for user confirmation before posting to the ledger.
- **Type:** Feature
- **Assignee:** a named, resolvable test person or agent
- **Points:** 5
- **Priority:** High
- **Project:** Housing Allowance Agent
- **Sprint:** an existing test sprint, when relevant

The Project example is illustrative. Select it only if that exact option exists and is the intended value; otherwise use a requester-selected existing test option. The ticket's subject matter does not authorize ledger or accounting actions.

## 1. Create a complete ticket

Request: “Create this ticket on the test board using the example title and description, Feature type, the identified test assignee, 5 points, High priority, and the specified existing Project and sprint. Use ticket-authoring and tell me which skill you loaded.”

Pass:
- All seven authoring groups are populated with valid values; priority/sprint is one group.
- Type is an explicit Feature board tag, not just title text.
- Assignee, Project, and sprint resolve to the selected existing records/options.
- Points remain requester-provided; the agent does not falsely call them its own estimate.
- A read-back confirms saved values.

Variant: omit points while retaining sufficient scope. Pass if the agent supplies a Fibonacci estimate, labels it agent-generated, and recommends decomposition for an estimate of 13 or more. If scope is insufficient, it asks rather than guessing.

## 2. Description-only update preserves other fields

Save a before snapshot of the complete ticket. Request: “Change only the description to: Build the human-in-the-loop receipt qualification flow and include a review screen for ambiguous category matches. Leave every other field unchanged.”

Pass:
- Only description changes.
- Assignee, points, priority, sprint, Project, title, and type remain exactly as before.
- No blank, default, or reset values are sent for untouched fields.
- Read-back confirms preservation.

Variant: begin with points missing. A description-only update still does not insert an estimate; the missing field may be reported separately.

## 3. Excluded operations remain untouched

Review operation inputs and calls for both scenarios above.

Pass:
- No Linear validation, lookup, or write occurs.
- No accounting field/tag or Completed On mutation is sent.
- No project or Project option is created and no cross-system project matching occurs.
- Unrelated tags and custom fields are preserved.
- A hygiene check does not independently transition status to completed.

This checks the invoking agent's actions. If independent downstream automation reacts to a board write, record that separately; do not misrepresent it as a direct action of this skill.
