# Design Harness 專案約定

進行 UI 設計與驗證時，先讀 `skill/SKILL.md`、`brief.md` 和 `harness.config.json`。依階段讀取 `vendor/skills/oil-ui/SKILL.md`、`vendor/skills/frontend-design/SKILL.md`、`vendor/skills/ui-ux-pro-max/SKILL.md`，原始 skill 與其 helpers 已整合。視覺規範在 `design/DIRECTION.md`，使用證據在 `design/SKILL-USAGE.md`。

Claude 與 Codex 共用需求與驗收條件。同一份 checkout 一次由一個 agent 修改；交接時使用 `handoff-template.md` 記錄目前報告、修改與待辦，不把另一個 agent 的工作當作自己已驗證。

本專案的 `npm run check` 只做瀏覽器檢查，不會呼叫其他 agent。保留每輪報告，根據實際截圖完成 `review.md`。自動項目通過仍需要視覺審查。

可修正產品程式；不可為取得綠燈而刪除驗收條件、關閉檢查或把溢出內容藏掉。需求改變時，先記錄原因，再同步 brief 與配置。
