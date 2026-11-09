---
name: ticket-pointing
description: Score a ticket's story points with the five-dimension effort-and-risk rubric (review burden, risk, uncertainty, verification gap, coordination) on the Fibonacci scale 1, 2, 3, 5, 8. A point measures human effort and risk to done, not agent run time, token cost, or iteration count. Load when asked to estimate points, point a ticket, score story points, or when ticket-authoring needs a points value. Returns "Needs refinement" when scope is insufficient and proposes a split when the result is 8. Does not create tickets or set priority, assignee, type, or capitalization.
---

# Ticket pointing

Assign story points from the ticket, its parent, and any linked plan the agent can read. Follow the rubric exactly. This skill does not grant access to a tracker. Use the tools the environment actually provides, and do not invent tool names, field IDs, or permissions. It works on a pasted ticket or in Linear, GitHub, Jira, or another tracker.

## When to use

- Estimate or revise points for a pasted ticket or an issue in whatever tracker is available.
- Score points for `ticket-authoring` during an authorized Linear create, update, or read-only hygiene check.
- Not for creating a full ticket, or choosing type, assignee, priority, cycle, project, or the capitalizable label. Use `ticket-authoring` for Linear issue authoring (`TangoGroup/mission-control-agent-skills@ticket-authoring`).
- Not a delivery-date or cycle-commitment promise.

## Steps

1. Read `references/ticket-pointing-rubric.md` before scoring. Do not estimate from memory or substitute another scale.
2. Classify the ticket using the rubric's ticket-type table. A parent ticket receives no points; say so and cite the table. Do not point it.
3. Run the readiness check. If any required item is missing, return "Needs refinement" and list what is missing. Assign no points.
4. Score each dimension 0, 1, or 2. Cite evidence from the ticket in one line per dimension. Invent no requirements and assume no scope the ticket does not state. When the evidence falls between two scores, choose the higher score and state the ambiguity.
5. Add the five scores and convert the total with the rubric's table. Then apply floors and overrides. Where more than one applies, the highest value stands.
6. A result of 8: propose a split into smaller phases. Do not create child tickets unless asked. Record 8 only when the team has agreed the work cannot be split.
7. Uncertainty scored 2 on a phase sub-ticket: recommend a spike or a revision of the plan before the phase enters a cycle, and still record the points.
8. Disregard who will do the work, how quickly an agent runs, token cost, and the number of agent iterations.
9. Leave points unchanged once work begins. When human review returns work for substantial rework, the rework is a new phase sub-ticket with its own points. Do not overwrite the original estimate.
10. Produce the rubric's estimate block. When `ticket-authoring` invoked this skill, return the block and the points value to that procedure and do not write the issue; `ticket-authoring` persists the Linear estimate. Otherwise, append the block to the ticket description and set the tracker's points or estimate field only when the requester asked to save the estimate and the write is authorized. Change no other field. An estimate-only request or a read-only check returns the block and does not write. If the tracker cannot store 1, 2, 3, 5, or 8, report that gap; do not change tracker settings or substitute another scale.

## Output

Return the rubric's estimate block, including the dimension breakdown, total, any floor, and flags (`none`, `Needs refinement`, proposed split, or spike/plan revision). State that the estimate is agent-generated. Distinguish a proposed estimate from one saved on the ticket. Do not claim a write succeeded without reading the record back.

## Reference files

- `references/ticket-pointing-rubric.md`: scale, what human effort includes, which tickets receive points, the readiness check, the five dimensions, the conversion table, floors and overrides, and the estimate block. Read before every estimate.
- `references/acceptance-tests.md`: scenarios for scoring, refusals, splits, and writes. Read when testing this skill or reviewing a change to it. Use pasted fixtures or authorized test issues, not real operational issues.
