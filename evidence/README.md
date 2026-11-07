# 實測紀錄

測試日期：2026-11-05（America/Vancouver；原始檔名使用 UTC，所以顯示 11-06）。

1. `01-detected-overflow/`：網址 `http://127.0.0.1:4173/?fault=overflow`，故意設 `min-width:720px`。檢查正確回傳 exit 1；手機 viewport 390px、內容 scrollWidth 720px。這是預期失敗，不是交付版的未修復問題。
2. 修正 `.fault-overflow` 為 `min-width:0px`，在相同網址重測。另補上鍵盤導覽、每條 flow 的截圖，以及海報的 img role。全程由目前這個 Codex 工作階段操作，沒有假裝 Claude 已參與。
3. `02-fixed-and-verified/`：最終版 exit 0，兩個 viewport 通過頁面載入、必要文字、鍵盤切換、無效 email、成功報名、水平溢出及 JS 錯誤檢查。axe 初始及最終狀態各為 0 violations／0 incomplete。視覺審查詳見 `review.md`。

最終環境：Windows、Node.js 24.14.0、Playwright 1.65.0、axe-core 4.14.0、Chromium 158.0.8127.18。

HTML／JSON 中的 visualReview:pending 是檢查器執行當下的狀態；後續的視覺結論以 `review.md` 為準，沒有改寫自動檢查原始結果。

故障輪保留原始檢查器輸出；最終輪增加鍵盤 flow 與逐 flow 截圖，因此兩次的完整 config 不完全相同。兩輪的 URL、viewport、主要報名驗收條件與溢出判斷相同。相同原始 config 在修正後也曾通過，完整紀錄保存在 `same-config-repair-report.json`。

重新演示：依主 README 執行 `fault:on`，用同一故障網址測試，再修改寬度規則或執行 `fault:off` 後重測。Claude 與 Codex 之間的交接請依 README 在你們自己的工作階段操作，本次未宣稱已完成跨工具交接。
