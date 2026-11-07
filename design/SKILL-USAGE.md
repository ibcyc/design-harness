# 本次實際使用紀錄

版本以 `skills.lock.json` 為準；三個原始 SKILL.md 均未改寫。

| 階段 | 實際讀取／執行 | 產生的決定 |
|---|---|---|
| 方向 | Oil UI SKILL.md；design-direction、direction-persuasion、workdir、visual-language、media、motion、scroll-narrative、visual-review、ux-review | 先灰度骨架、獨立概念生成與把關、共用桌面北極星、實際看圖再驗收 |
| 資料庫 | UI UX Pro Max SKILL.md；`search.py "community maker workshop event" --design-system` | 確認命中活動／青年創作者場景；保留 Hero-Centric 與一致控件，覆寫泛用紫橘色／字體建議 |
| 表單 | `search.py "error summary validation" --domain ux -n 2` | 命中 Focusable Error Summary、Error Messages；使用可聚焦錯誤區、欄位連結、aria-invalid，保留輸入 |
| 實作 | Anthropic frontend-design SKILL.md | 不沿用舊版暗綠＋螢光色海報；以主題相關便箋與字體建立識別，單一記憶點、較少裝飾 |
| 場景資產 | Oil UI media 規則＋宿主 imagegen skill（內建工具） | 視覺評審指出文字主視覺不足後，生成共同工作桌及空椅；圖片保留透明背景，座位姓名仍由 HTML 提供 |
| 驗收 | 原有 Playwright／axe 檢查器＋真實截圖＋獨立視覺／UX 走查 | 結果在 evidence/v2/；不同於「有安裝就算用過」 |

Figma 連接工具、貼文中的未知手繪 UI 專案及付費 Oil UI Pro 未整合。這次採用已確認來源的開源 skills，沒有冒稱已取得未知工具。未呼叫其他模型 API；Claude／Codex 是執行這個流程的宿主。
