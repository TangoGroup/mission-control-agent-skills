# Bug Priority Rubric

Give every bug ticket one priority, P0 to P3. This rubric runs inside ticket-authoring: when a bug ticket is created or updated, use it to set the Priority field. It does not decide whether a ticket should exist. Answer the decision questions in order, stop at the first match, then apply the rules.

## Levels

Core functions are sign-in, a product's primary workflow, saving and retrieving user content, integrations users depend on, message delivery, and payments.

**P0 Critical (Linear: Urgent).** Broad, ongoing, or irreversible harm. Stop current work; all hands until mitigated.

- A core function is down for all or most users.
- Confirmed exposure of data, credentials, or personal information, or an actively exploited vulnerability (CVSS 9.0 or higher).
- Data lost or corrupted with no recovery path.
- An AI feature sends harmful or false content widely, or takes an action no one approved.

Examples: sign-in fails for everyone; one customer can see another customer's data.

**P1 High (Linear: High).** Serious harm to a meaningful group, or a lower-level bug that is growing. Fix within the current one-week cycle.

- A core function fails for some users or customers with no workaround.
- CVSS 7.0 to 8.9, or a credible but unconfirmed exposure report.
- Data lost or corrupted but recoverable.
- Reproducible harmful or false AI output, or AI loops that run away and burn cost, not yet widespread.

Examples: a calendar integration fails for several accounts every day; checkout succeeds but the subscription is never provisioned.

**P2 Medium (Linear: Medium).** Degraded, but users can still finish their work. Fix in the next one or two cycles.

- A core function misbehaves but a reasonable workaround exists.
- A secondary feature is broken.
- Noticeably slow, but work completes.
- CVSS 4.0 to 6.9.

Examples: a vendor outage disables one optional feature; a save fails once and works on retry.

**P3 Low (Linear: Low).** No effect on what users can accomplish. Backlog.

- Cosmetic, layout, or copy defects.
- Misleading logs or report-only warnings that block nothing.
- A rare edge case with a trivial workaround.
- CVSS 0.1 to 3.9.

Examples: an icon fails to load; a typo in a label.

## Decision questions

1. Does the ticket describe new or changed behavior rather than a defect? Label it Feature or Chore and assign no priority.
2. Are data, credentials, or personal information exposed, or is a vulnerability being exploited? Confirmed: P0. Credible but unconfirmed: P1.
3. Has data been lost or corrupted? Irreversibly: P0. Recoverably: P1.
4. Did an AI feature produce harmful or false content, take an unapproved action, or loop without limit? Widespread, already acted, or costly right now: P0. Reproducible or recurring: P1.
5. Is a core function unavailable? For all or most users: P0. For some, with no workaround: P1.
6. Is a core function degraded with a workaround, a secondary feature broken, or the product slow? P2.
7. Otherwise: P3.
8. If the error rate is rising or spreading to new users or customers, raise the result one level.

## Rules

- Torn between two levels, choose the higher.
- A vendor cause, a low error count, or an old ticket never lowers a level. High error volume alone never raises one; judge by what users cannot do.
- Duplicates take the higher of their priorities.
- Never lower a priority a human set; propose the change and flag it.
- For a P0 or P1 that began within 24 hours of a deploy, suggest rollback first.
- Flag for human review instead of guessing when scope or workaround is unknown and would change the level, when evidence conflicts, when the call is theological or pastoral, or when the result is P0 (alert anyway; do not wait).

## Inputs to read from the ticket

Product and team; observed and expected behavior; who and how many are affected; whether a workaround exists; whether data, credentials, or AI behavior are involved; first seen, last seen, and trend; source (ours, a named vendor, or another team); tracking status; any deploy in the last 24 hours.

## Output

```json
{
  "priority": "P1",
  "rationale": "Calendar integration fails for 4 accounts with no workaround (question 5).",
  "team": "<resolved team>",
  "source": "vendor: <vendor name>",
  "needs_human_review": false,
  "review_reason": null
}
```
