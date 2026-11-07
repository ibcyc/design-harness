# Third-party sources

The root MIT license applies to this project's original code, documentation, and demo assets. It does not replace or relicense any third-party component below. Keep each component's notices and license when redistributing it. Generated local installations under `.agents/skills/` and `.claude/skills/` are created by `npm run setup` and are not committed to this repository.

The upstream skills are bundled without modifying their SKILL.md text. Complete support files and local licenses are retained; tests and CI files not used by this toolkit are omitted. `skills.lock.json` pins commits and file hashes. Each installation into `.claude/skills/` and `.agents/skills/` retains those licenses.

| Component | Source | License / terms |
|---|---|---|
| Oil UI | https://github.com/oil-oil/oil-ui | MIT; `vendor/skills/oil-ui/LICENSE` |
| frontend-design | https://github.com/anthropics/skills/tree/main/skills/frontend-design | Apache-2.0; `vendor/skills/frontend-design/LICENSE.txt` |
| UI UX Pro Max | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | MIT; `vendor/skills/ui-ux-pro-max/LICENSE` |
| Space Grotesk | https://github.com/google/fonts/tree/main/ofl/spacegrotesk | SIL Open Font License; `demo/assets/fonts/OFL-SpaceGrotesk.txt` |
| GSAP / ScrollTrigger | https://gsap.com | Standard No Charge GSAP License (not MIT); distribution headers and upstream README retained under `demo/assets/motion/`; terms: https://gsap.com/standard-license/ |
| Playwright | https://github.com/microsoft/playwright | Apache-2.0; installed npm package retains license |
| axe-core | https://github.com/dequelabs/axe-core | MPL-2.0; installed npm package retains license |

Reference screenshots of Hack Club and Luma were inspected during research and are not redistributed as demo assets. The demo's HTML/CSS and structural graphics were authored for this harness. `demo/assets/illustration/shared-table.png` was generated with the built-in imagegen tool for this project; its prompt and intended meaning are recorded in `design/HERO-ASSET.md`. It is conceptual artwork, not event photography or evidence of real attendees.
