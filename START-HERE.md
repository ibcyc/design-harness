# 你可以直接這樣用

這是 Design Harness 0.2，已附三套設計 skills 與一個完成重新設計的活動頁。

## 在 Claude Code 或 Codex 中

以這個 `design-harness` 資料夾作為工作目錄，開啟新的對話讓專案 skills 被載入。也可以明確叫 AI 讀檔，不依賴自動載入。

直接貼：

```text
請先讀 AGENTS.md 和 skill/SKILL.md，使用整合的 Oil UI、frontend-design、
UI UX Pro Max。執行 npm install、npm run setup、npm run skills:check，
並安裝測試用 Chromium。啟動 npm run demo，讓我看目前的新版示範。
執行 npm run check，真正看手機和桌機截圖，再說明設計決定與檢查結果。
```

## 我要做自己的產品

在同一個對話貼：

```text
我的產品是：[用一兩句話說明]
主要使用者是：[誰會用]
最重要的操作是：[例如建立活動、搜尋餐廳、整理讀書筆記]
我喜歡的感覺／參考是：[可以留空，讓 AI 決定]

請用 Design Harness 更新 brief.md 與驗收條件，依整合的三套 skills
選一個適合本產品的設計方向並做成可操作頁面。
把字體、顏色、版型與採用 skill 的理由留下；看實際截圖後修到完成，
最多三輪。先自行決定可逆細節，有真正阻礙再告訴我。
```

## 手動啟動

需要 Node.js 20.11+；資料庫查詢另需 Python 3。在本資料夾的終端機執行：

```sh
npm install
npm run setup
npx playwright install chromium
npm run demo
```

瀏覽器開 `http://127.0.0.1:4173/`。保持第一個終端機開著，在第二個終端機的同一資料夾執行 `npm run check`。

Windows PowerShell 若限制執行 npm.ps1，將命令中的 npm／npx 寫成 npm.cmd／npx.cmd。

明天的故障重演、報告與兩個 AI 交接，請看 README.md 的 loop test。
