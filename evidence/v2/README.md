# Design Harness 0.2 的驗證

日期：2026-11-05（America/Vancouver）；原始報告檔名以 UTC 記錄。

- **已整合**：Oil UI、Anthropic frontend-design、UI UX Pro Max 原始 skill／參考／helpers／授權；`skills.lock.json` 固定 commit 和逐檔 SHA-256。Claude 與 Codex 專案目錄各有一份，共195個管理檔。
- **已實際使用**：Oil UI 概念與評審流程、frontend-design 實作指導、UI UX Pro Max `community maker workshop event --design-system` 與 `error summary validation --domain ux` 查詢。不是只有放連結。
- **視覺**：前兩輪7/10，按回饋放大時間資訊、刪口號，並以專屬共同工作桌插畫取代文字便箋；最終8/10。完整三輪報告及對應畫面保留。這是特定評審的設計判斷，不是使用者研究或保證所有人的審美。
- **獨立UX**：ux_review_v2 從真實頁面自行選擇任務，桌機與手機皆完成原型流程。當時指出日期／時區不明；最終版補上虛構示範場次2026/11/13、溫哥華UTC−8。原始走查在插畫改版前進行，未宣稱已由該評審重走最終版。
- **最終自動檢查**：`final/` 是插畫版真正執行 npm run check 的結果。桌機1440×900、手機390×844的鍵盤、無效信箱、提交、溢出、JS錯誤與axe掃描通過；每個狀態有圖。JSON／HTML中的視覺PENDING是執行當下的原始狀態，後續結論見 `final/review.md`。
- **補充操作**：`additional-checks.json` 驗證最終插畫版在320、768、1440px正常動態模式下，空表單錯誤、摘要聚焦、錯誤連結、姓名座位牌、返回座位與編輯後清除成功狀態皆通過。頁面 runtime 外部請求為0。
- **故障閉環**：`overflow-detected.json` 與 `overflow-repaired.json` 是同一URL、同一配置，在手機注入720px最小寬度後正確失敗（內容740px），修正後通過。這兩份在最終插畫替換前擷取，報名區與故障規則未變；最終版另有完整正常檢查。
- **安裝器**：另外在隔離資料夾實測新安裝、重複執行、受管理版本更新、保護使用者改動與先檢查再寫入，均通過。

目前仍為前端範例：沒有後端儲存、寄信或真實活動名額。沒有執行跨Claude/Codex自主交接，也沒有Figma連線；兩邊共用同樣的已安裝skills與交接格式。
