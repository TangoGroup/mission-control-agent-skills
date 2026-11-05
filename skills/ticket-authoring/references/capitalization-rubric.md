# Capitalization Label Rubric

## Purpose

This rubric lets an agent apply Linear's `capitalizable` label as part of normal ticket authoring. It sets one label, derived from where a ticket's work sits relative to launch. It is not a determination of final accounting treatment, cost, labor hours, or journal entries — those stay with accounting.

## Rule

1. Resolve the Linear Project the ticket's work belongs to (the same project selected or created during authoring).
2. Resolve that project's project launch state — launched or not launched — from the invoking agent's private configuration, the same place team routing IDs and point-rubric calibration live. This public rubric names no specific products.
3. A project created during this authoring session, including a new major-version project (v2, v3, ...) spun off an already-launched product, defaults to **not launched** until the private config is updated to mark it launched. A new major-version project has no tickets live in production yet, so it restarts the capitalization clock independently of its predecessor's state.
4. **Not launched:** apply `capitalizable` to the ticket, regardless of Type (Feature, Bug, or Chore).
5. **Launched:** do not apply `capitalizable` to the ticket, regardless of Type.
6. There is no "not capitalizable" label. Its absence on a ticket means not capitalizable.
7. This rubric does not retroactively relabel other tickets when a project's launch state changes. Flag that as a separate bulk question if asked; do not silently mass-relabel as a side effect of authoring one ticket.

## Private configuration

Keep a list of products/projects and their current project launch state in private configuration, e.g.:

```
<product/project> — project launch state: launched | not launched (estimated launch: <date>, if not launched)
```

## Output

Append alongside the estimate/priority blocks:

```
Capitalization (agent-generated, rubric v1.0)
Project: <resolved project>
Project launch state: not launched
Label applied: capitalizable
```

Or, when launched:

```
Capitalization (agent-generated, rubric v1.0)
Project: <resolved project>
Project launch state: launched
Label applied: none
```
