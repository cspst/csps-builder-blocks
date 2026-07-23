# csps-builder-blocks

CSPS 建築積木系列 — 訓練運算思維的模組化 Minecraft 教育版（MakeCode）擴充套件。

學生匯入後，工具箱會出現對應分類，每個系列的原始碼本身就是可閱讀的範例程式，適合「先使用、再拆解、後擴充」的教學流程。

## 目前包含的系列

| 分類 | 檔案 | 主要積木 | 訓練概念 |
|------|------|---------|---------|
| 金字塔 | `pyramid.ts` | 建造金字塔（底邊/材質/空心/樣式/位置）、在我前方建造金字塔 | 迴圈、函式拆解、座標運算 |
| 像素畫 | `pixelart.ts` | 畫內建圖案（愛心/笑臉/苦力怕/菱形）、畫自訂像素圖、設定色號 | 巢狀迴圈、二維資料、字元對應 |
| 台北101 | `tower101.ts` | 建造台北101（節數/節寬/裙樓）、101底座、101樓層節、101塔尖 | 函式組合（部件化）、迴圈疊層 |

規劃中：圓形/球體、螺旋塔、迷宮產生器、長條圖、碎形樹、密室逃脫出題機、尋寶遊戲。

### 台北101用法

一鍵整棟（真實101是8節）：聊天指令 `101`；或自己組裝部件——先蓋「101底座」（高12格），再重複疊「101樓層節」（每節高7格），最後蓋「101塔尖」。所有位置都是部件底部中心點，是練習「函式組合＋座標計算」的素材。

### 像素畫用法

自訂圖案用「文字列陣列」：`.` 或 `0` 不畫，`1`~`9` 是色號（預設羊毛：1黑 2紅 3橙 4黃 5綠 6藍 7紫 8白 9灰），可用「設定色號」積木把任何色號換成任何方塊：

```typescript
pixelart.setPalette("1", Block.GoldBlock)   // 色號 1 改用金塊
pixelart.drawCustom([
    ".111.",
    "1....",
    "1....",
    ".111."
], PixelOrient.Wall, pos(3, 0, 3))
```

## 學生如何匯入

1. 在 Minecraft 教育版世界中按 **C** 開啟 Code Builder（MakeCode）
2. 開啟任一專案 → 工具箱最下方點「**擴充套件 (Extensions)**」
3. 在搜尋列貼上：`github.com/你的帳號/csps-builder-blocks` → 點選加入
4. 工具箱出現「金字塔」等分類，即可使用

更新：老師發佈新版後，學生在「擴充套件」頁面對已安裝的套件點更新（或移除後重新加入）即可取得新積木。

## 老師如何發佈到 GitHub

### 方式 A：MakeCode 編輯器內建 GitHub 功能（推薦，免裝 git）

1. 在 [minecraft.makecode.com](https://minecraft.makecode.com) 開新專案
2. 切到 JavaScript 檢視，用檔案總管建立本專案的各檔案並貼入內容（`pxt.json` 的設定可透過「專案設定」編輯，或直接在 Explorer 中修改）
3. 點編輯器下方的 **GitHub 按鈕** → 登入 → 命名為 `csps-builder-blocks` → 建立儲存庫
4. 之後每次修改點「提交 (commit)」即可；發佈正式版用「建立發行版 (release)」

### 方式 B：git 指令（本資料夾已備妥所有檔案）

```bash
cd 20260721_csps-builder-blocks
git init
git add .
git commit -m "v0.1.0 金字塔系列"
# 先在 GitHub 建立空儲存庫 csps-builder-blocks，然後：
git remote add origin https://github.com/你的帳號/csps-builder-blocks.git
git push -u origin main
```

發佈後建議在 GitHub 打上版本標籤（如 `v0.1.0`），MakeCode 會優先抓取 release 版本，避免學生拿到改到一半的程式碼。

## 如何新增一個系列（擴充指南）

以「迷宮」為例，三步驟：

1. **新增檔案** `maze.ts`，套用固定骨架：

```typescript
//% color="#2e86c1" icon="\uf047" block="迷宮"
namespace maze {
    //% block="產生迷宮 大小 %size 牆壁 %material=minecraftBlock 位置 %pos=minecraftCreatePosition"
    //% size.min=5 size.max=41 size.defl=15
    export function buildMaze(size: number, material: number, pos: Position): void {
        // 主流程：呼叫下面的內部模組
    }

    // 內部模組函式寫在這裡（不加 //% block 就不會出現在工具箱）
}
```

2. **登記到 `pxt.json`**：在 `files` 陣列加入 `"maze.ts"`，並把 `version` 加 0.1.0
3. **提交到 GitHub**：commit + 建立新 release

慣例約定：每個系列一個檔案、一個 namespace、一種代表色；共用工具（座標位移 `csps.offset`、區域填滿 `csps.fillBox`）一律放 `_shared.ts`，不要重複實作；每個對外積木附中文 JSDoc 註解，學生拆解時看得懂。

## 檔案結構

```
csps-builder-blocks/
├── pxt.json      ← 套件設定（名稱、版本、檔案清單）
├── _shared.ts    ← 全系列共用工具（不出現在工具箱）
├── pyramid.ts    ← 金字塔系列
├── test.ts       ← 開發測試用（匯入者不會載入）
├── README.md
├── LICENSE
└── .gitignore
```

## 授權

MIT — 歡迎其他學校老師自由取用與改作。
