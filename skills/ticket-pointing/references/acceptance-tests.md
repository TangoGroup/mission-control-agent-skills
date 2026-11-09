# Ticket-pointing acceptance tests

Run against a pasted ticket, or with authorization against a designated test issue. Never use a real operational issue. These are manual scenarios, not evidence of executed tests.

## 1. Standalone ticket with enough scope

Paste a ticket that states the problem, acceptance criteria, and the area of the product it touches. Ask: "Estimate points with ticket-pointing and tell me which skill you loaded."

Pass:

- The agent loaded `ticket-pointing` and read `references/ticket-pointing-rubric.md` before scoring.
- Each dimension is 0, 1, or 2 with one line of evidence from the ticket.
- The total converts through the rubric's table, then floors and overrides apply, with the highest value standing.
- The response includes the estimate block and states the estimate is agent-generated.
- No ticket is created or edited.

## 2. Needs refinement

Omit acceptance criteria, or omit the parent on a phase sub-ticket.

Pass:

- The agent returns "Needs refinement" and lists what is missing.
- It assigns no points and does not fill the estimate block with guessed scores.

## 3. Parent and phase sub-tickets

Use a parent with two phase sub-tickets and a plan the agent can read.

Pass:

- The parent receives no points; the agent cites the ticket-type table.
- Each phase is scored on its own. Review burden is that phase's share of one combined end-of-parent review.
- Uncertainty 2 on a phase recommends a spike or plan revision before the phase enters a cycle, and still records points.
- A phase whose result is 8 produces a proposed split and does not create children unless asked.
- A standalone ticket still receives points.
- A planning ticket and a spike receive points for the work the rubric assigns them.

## 4. Ambiguity and floors

Pass:

- Evidence between two scores takes the higher score, and the reply states the ambiguity.
- Risk scored 2 yields at least 3 points even when the raw total would convert lower.
- Agent run time, token cost, iteration count, and who will do the work do not change the score.

## 5. Writes

Pass:

- An estimate-only request does not write.
- When the requester asks to save the estimate and the write is authorized, the block is appended to the description, the points or estimate field is set to the Points value, and every other field stays unchanged. Read-back confirms that.
- When `ticket-authoring` is applying the score, this skill returns the block and does not write. The Linear update belongs to `ticket-authoring`.
- Points already on a ticket whose work has begun stay unchanged. Substantial rework is a new phase sub-ticket with its own points.
- A tracker that cannot store 1, 2, 3, 5, or 8 is reported as a configuration gap. Settings are not changed and another scale is not substituted.
