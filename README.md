# 屋頂上的數據

[直接開始遊戲](https://Evan645test.github.io/rooftop-data-game/)

校園調查型圖文小說。玩家擔任校刊社記者，透過圖片判讀、訪談與公開說明會，檢查屋頂太陽能評估的實驗設計與推估方法。

## 本次發布

2026-10-12：圖片判讀與調查提示版，包含序章及第一章。遊戲內版本為 `0.2-picture-interpretation`，發行識別為 `0.2-picture-interpretation+guidance.20261012`。第二、三章尚未開放。

包含自動收集圖片、四選一判讀、來源提示、雙人對話、調查清單及下一步提示。對決仍採提出資料與解釋兩階段；三錯整章重試，3／4／5 題正確分級勝利。原始數據未遭竄改，教學重點在實驗設計與模型。

建議使用桌面 Chrome 或 Edge。首次載入包含約 187 MiB 遊戲包，請等待載入完成；手機尚未完整驗收。存檔保存在瀏覽器，網站網址不同時不會自動共用存檔；可用左上角選單匯出備份。

## 本機預覽與部署

需要 Python 3.9 以上，不需 API 金鑰、資料庫或額外套件。此儲存庫保存可直接發布的網頁包；遊戲腳本與素材在 `game.zip` 中。

```sh
python3 tools/assemble_github_pages.py
python3 -m http.server 8766 --bind 127.0.0.1 --directory _site
```

開啟 http://127.0.0.1:8766/ 。不要以 file:// 直接開啟。

`game.zip` 以小於 GitHub 單檔限制的片段存放在 `payload/`，部署前自動合併。`release.json` 記錄全部檔案及片段的 SHA-256；組裝會驗證雜湊、ZIP CRC、必要新版來源，以及不包含測試腳本或存檔。

推送 `main` 後，由 GitHub Actions 組裝並發布至 GitHub Pages。可在 Actions 手動執行同一流程。回復舊版本時，對發布 commit 執行 revert 後推送，部署流程會重新發布對應檔案。

遊戲使用 Ren’Py；引擎、字型及其他第三方素材授權保留在發行包內。本儲存庫未額外授予遊戲原創內容開源授權。
