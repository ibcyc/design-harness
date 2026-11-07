---
name: design-harness
description: Design and refine web interfaces through a bounded implement, browser-check, screenshot-review, and repair loop. Use for hackathon UI creation, design iteration, or a design loop test in a project containing this harness.
---

# Design Harness

Use this skill with the project root that contains `brief.md`, `harness.config.json`, and `scripts/check.mjs`. The root `skill/SKILL.md` is canonical; installed project-local copies carry the same instructions.

## Establish the target

Read the brief and executable configuration. Identify the audience, primary task, required states, visual intent, and measurable acceptance conditions. Preserve existing product and brand choices. If a noncritical detail is missing, record an assumption and proceed. Do not replace an unknown product with the bundled demo.

## Integrated design skills

The original, pinned skills and their helper files are bundled in `vendor/skills/` and installed project-locally for both Claude and Codex by `npm run setup`. Read their actual instructions when using each stage, rather than relying on the summaries below. Resolve their relative references from their own skill folders. `skills.lock.json` records upstream commits and file hashes; `npm run skills:check` verifies sources and both installed copies. Missing dependencies must be reported, never claimed as used.

- **Direction and visual critique:** read `vendor/skills/oil-ui/SKILL.md`. Use its product facts, concept, grayscale structure, screenshot critique and proportional independent-review workflow. For unattended or already-authorized implementation, select a recommended direction and continue; do not add an unnecessary approval stop. Request distinct public options only when the user wants a comparison. Use a fresh concept generator and separate gate/reviewer when the host supports delegation. Otherwise label that stage self-review.
- **Design knowledge:** read `vendor/skills/ui-ux-pro-max/SKILL.md`. For a new system, run `npm run design:research -- "<2–5 product-specific terms>"`. Verify search fit before adopting results. Use its absolute `scripts/search.py` path for focused `--domain ux` or typography/color queries. State which recommendations you adopt and override; its output is guidance, not the approved brief. Python 3 is required for its database, not for the text-based skills.
- **Implementation craft:** read `vendor/skills/frontend-design/SKILL.md`. Apply its subject-specific composition, coherent token system, typography and anti-template critique while building the working interface.

Keep the decision in `design/DIRECTION.md`: audience, one north star, primary action, layout sketch, color/type/spacing tokens, assets, interaction states and intentional tradeoffs. Record exactly which source files and database queries informed the result in `design/SKILL-USAGE.md`. Preserve existing accepted brand choices. Optional Figma or image-generation tools are used only when available and helpful; do not present them as integrated when they are absent.

These project-local packages are pinned for repeatable hackathon runs. Set `OIL_NO_UPDATE_CHECK=1` when running Oil UI's updater helper so it does not write global update cache or change the pinned installation. Upstream updates are a separate explicit action. Do not request paid credits or install other tools merely because an upstream reference suggests them.

## Implement and inspect

Implement the smallest complete user task, including relevant empty, error, success, keyboard, and mobile states. Replace the example `flows` with actual product acceptance paths when adopting this harness. Start the app using the project's existing command, then run `npm run check` with the appropriate URL and config.

Read the newly emitted `report.json` and `summary.md`. Actually open `desktop.png` and `mobile.png` and the `*-after.png` screenshots when present. Never infer appearance from source alone. If screenshot inspection is unavailable, explicitly record visual review as blocked and ask a teammate to review the evidence; do not declare visual acceptance.

Review task clarity, hierarchy, legibility, spacing, distinctiveness, state feedback, and mobile fit against the brief. In that run's `review.md`, record pass/fail per criterion with concrete visible evidence, remaining defects, reviewer identity, and a final accepted / needs-work / blocked verdict. Automated success is separate from visual acceptance; axe does not cover all accessibility requirements.

## Repair loop and stop conditions

Default budget: three check-and-review rounds per task, unless the user sets another limit. Prioritize a blocked primary task or failed check, then severe layout/legibility problems, then polish. Make targeted changes, rerun the same acceptance paths, and save evidence for each round. Do not remove assertions, suppress errors, bypass validation, or hide meaningful content to obtain a pass.

Stop early when the brief is fulfilled, automatic checks pass, and visual review accepts the result. Stop with a precise handoff when the budget is exhausted, credentials or required services are unavailable, or a design decision requires the user's input. Report what remains; do not label an incomplete task complete. The checker itself does not call a model or modify the app; you are the agent controlling the repair loop.

## Evidence and handoff

Report the tested URL, commands, run directory, automatic results, visual verdict, and unresolved issues. Distinguish simulated frontend behavior from a real backend. Use `handoff-template.md` when changing agents. Keep the same brief, test config, URL, and run evidence across the handoff unless a documented requirement change makes an update necessary.
