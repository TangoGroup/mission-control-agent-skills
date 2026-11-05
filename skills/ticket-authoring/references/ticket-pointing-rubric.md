# Ticket Pointing Rubric

## Purpose

This rubric lets an AI agent assign story points to tickets consistently. A point measures the human effort and risk required to bring a ticket to done. Agent run time, token cost and the number of agent iterations carry no weight.

Scale: 1, 2, 3, 5, 8.

## What counts as human effort

- Writing or approving the scope and acceptance criteria
- Starting and steering the agent loop
- Reading the agentic verifier's output and resolving what it flags
- Human review of the work
- Manual testing and any check the verifier cannot perform
- Integration, rollout and coordination with other people

## Which tickets receive points

| Ticket type | Pointed | What the points cover |
| --- | --- | --- |
| Parent ticket | No | The phase sub-tickets carry the points; pointing the parent would count the work twice. |
| Planning ticket, where the team tracks one | Yes | The engineer's work with AI to produce and approve the plan. |
| Phase sub-ticket | Yes | Steering and verification of that phase, plus its share of the final human review. |
| Standalone ticket | Yes | All human work from scope to done. |
| Spike | Yes | The investigation itself; its output is a plan or a decision. |

## Readiness check before scoring

The agent assigns no points when any of the following is missing. It returns "Needs refinement" and lists what is missing.

- A clear statement of the problem or deliverable
- Acceptance criteria a reviewer can check, stated in the ticket or in a linked plan the agent can read
- The parent ticket, for a phase sub-ticket
- The areas of the product or codebase the work touches, when the plan names them

## Scoring dimensions

Score each dimension 0, 1 or 2, and cite the evidence from the ticket in one line.

### 1. Review burden

How much this phase adds to the human review. All phases of a parent share one PR, and a person other than the orchestrator reviews the whole work once at the end, so score each phase on its share of that combined review.

- 0: A small, contained change in one area; a reviewer can approve it in a single short read.
- 1: A moderate change across several files or one feature area.
- 2: A large or cross-cutting change, or generated code that a reviewer must check for intent as well as correctness.

### 2. Risk

The cost of a mistake that both the verifier and the reviewer miss.

- 0: Internal and easily reverted, with no user-facing or data impact.
- 1: User-facing behavior or shared components, recoverable by a revert.
- 2: Authentication, permissions, security, payments, data migrations, public APIs, or anything difficult to roll back.

### 3. Uncertainty

How well the approach and the outcome are known.

- 0: The plan names the approach, and similar work has shipped before.
- 1: The approach is known, but details or edge cases remain open.
- 2: The approach is unproven, or the outcome depends on behavior no one has confirmed, such as an external service, an undocumented system or model output.

### 4. Verification gap

How much checking falls to a human because the agentic verifier cannot cover it.

- 0: Existing automated tests and the verifier cover the acceptance criteria.
- 1: Some manual checks are required, such as a UI flow, a configuration or sample data.
- 2: The area lacks tests, acceptance depends on human judgment (UX, content or model output quality), or the work requires a special environment.

### 5. Coordination

Dependence on people or systems outside the ticket.

- 0: The assignee can finish without anyone else.
- 1: One input or handoff is required, such as a design, a review from another sub-team or a configuration change.
- 2: Several parties, another team's release or a staged rollout are required.

## Converting scores to points

Add the five scores for a total between 0 and 10.

| Total | Points |
| --- | --- |
| 0 to 2 | 1 |
| 3 to 4 | 2 |
| 5 to 6 | 3 |
| 7 to 8 | 5 |
| 9 to 10 | 8 |

### Floors and overrides

Apply these after the conversion. Where more than one applies, the highest value stands.

- Risk scored 2: the ticket receives at least 3 points.
- Uncertainty scored 2 on a phase sub-ticket: the agent recommends a spike or a revision of the plan before the phase enters a cycle, and still records its points.
- A result of 8: the agent proposes a split into smaller phases. An 8 enters a cycle only when the team agrees the work cannot be split.

## Rules for the agent

- Score from the ticket, its parent and the plan. Invent no requirements and assume no scope the ticket does not state.
- Disregard who will do the work and how quickly the agent runs.
- When the evidence for a dimension falls between two scores, choose the higher score and state the ambiguity, so that unclear tickets surface for refinement.
- Leave a ticket's points unchanged once work begins. When human review returns work for substantial rework, the rework becomes a new phase sub-ticket with its own points.

## Output format

The agent appends this block to the ticket description. The values below are illustrative.

```
Estimate (agent-generated, rubric v1.1)
Points: 2
Review burden: 1 (changes several files in one feature area)
Risk: 1 (user-facing; a revert restores prior behavior)
Uncertainty: 1 (time zone edge cases remain open)
Verification gap: 1 (manual check of the affected screen)
Coordination: 0
Total: 4; floor applied: none
Flags: none
```
