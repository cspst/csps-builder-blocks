/**
 * pixelart.ts — 像素畫產生器系列
 *
 * 訓練概念：巢狀迴圈（逐列逐格）、二維資料（文字列陣列）、字元對應（調色盤）
 *
 * 自訂圖案的畫法：每一行文字是一列像素，每個字元是一格：
 *   "." 或 "0" = 不畫（留空）
 *   "1"~"9"    = 對應調色盤的色號（可用「設定色號」積木更換方塊）
 */

/** 內建圖案 */
enum PixelPattern {
    //% block="愛心"
    Heart,
    //% block="笑臉"
    Smiley,
    //% block="苦力怕"
    Creeper,
    //% block="菱形"
    Diamond
}

/** 呈現方式 */
enum PixelOrient {
    //% block="直立牆面"
    Wall,
    //% block="平鋪地面"
    Floor
}

//% color="#e91e63" icon="\uf03e" block="像素畫"
namespace pixelart {

    // ── 調色盤：色號字元 → 方塊 ──
    // 預設用羊毛色：1黑 2紅 3橙 4黃 5綠 6藍 7紫 8白 9灰
    let paletteKeys = ""
    let paletteBlocks: number[] = []

    function initPalette(): void {
        if (paletteKeys.length > 0) return
        paletteKeys = "123456789"
        paletteBlocks = [
            blocks.blockWithData(Block.Wool, 15), // 1 黑
            blocks.blockWithData(Block.Wool, 14), // 2 紅
            blocks.blockWithData(Block.Wool, 1),  // 3 橙
            blocks.blockWithData(Block.Wool, 4),  // 4 黃
            blocks.blockWithData(Block.Wool, 5),  // 5 綠
            blocks.blockWithData(Block.Wool, 11), // 6 藍
            blocks.blockWithData(Block.Wool, 10), // 7 紫
            blocks.blockWithData(Block.Wool, 0),  // 8 白
            blocks.blockWithData(Block.Wool, 7)   // 9 灰
        ]
    }

    /** 查詢色號對應的方塊，查不到回傳 -1 */
    function blockFor(ch: string): number {
        const i = paletteKeys.indexOf(ch)
        return i < 0 ? -1 : paletteBlocks[i]
    }

    // ── 內建圖案資料（就是「二維資料」的範例）──
    function patternRows(pattern: PixelPattern): string[] {
        if (pattern == PixelPattern.Heart) return [
            ".22.22.",
            "2222222",
            "2222222",
            ".22222.",
            "..222..",
            "...2..."
        ]
        if (pattern == PixelPattern.Smiley) return [
            ".444444.",
            "44444444",
            "44144144",
            "44144144",
            "44444444",
            "41444414",
            "44111144",
            ".444444."
        ]
        if (pattern == PixelPattern.Creeper) return [
            "55555555",
            "55555555",
            "51155115",
            "51155115",
            "55511555",
            "55111155",
            "55111155",
            "55155155"
        ]
        // Diamond 菱形
        return [
            "....6....",
            "...666...",
            "..66666..",
            ".6666666.",
            "666666666",
            ".6666666.",
            "..66666..",
            "...666...",
            "....6...."
        ]
    }

    /**
     * 畫一個內建圖案
     * @param pattern 內建圖案
     * @param orient 直立牆面或平鋪地面
     * @param pos 圖案左下角（牆面）或左上角（地面）位置
     */
    //% block="畫內建圖案 %pattern 方式 %orient 位置 %pos=minecraftCreatePosition"
    //% weight=100
    export function drawPattern(pattern: PixelPattern, orient: PixelOrient, pos: Position): void {
        drawCustom(patternRows(pattern), orient, pos)
    }

    /**
     * 在我前方畫內建圖案（適合低年級示範，畫成直立牆面）
     */
    //% block="在我前方畫內建圖案 %pattern"
    //% weight=95
    export function drawPatternHere(pattern: PixelPattern): void {
        drawCustom(patternRows(pattern), PixelOrient.Wall, csps.offset(player.position(), 3, 0, 3))
    }

    /**
     * 畫自訂像素圖：每行文字是一列，"."不畫，"1"~"9"是色號
     * @param rows 文字列陣列（由上到下）
     * @param orient 直立牆面或平鋪地面
     * @param pos 起點位置
     */
    //% block="畫自訂像素圖 %rows 方式 %orient 位置 %pos=minecraftCreatePosition"
    //% weight=90
    export function drawCustom(rows: string[], orient: PixelOrient, pos: Position): void {
        initPalette()
        const height = rows.length
        // 外層迴圈跑「列」，內層迴圈跑「格」→ 巢狀迴圈
        for (let r = 0; r < height; r++) {
            const row = rows[r]
            for (let c = 0; c < row.length; c++) {
                const ch = row.charAt(c)
                if (ch == "." || ch == "0" || ch == " ") continue
                const material = blockFor(ch)
                if (material < 0) continue
                if (orient == PixelOrient.Wall) {
                    // 牆面：第 0 列在最上面 → y 由高往低
                    blocks.place(material, csps.offset(pos, c, height - 1 - r, 0))
                } else {
                    // 地面：第 0 列在最遠處 → 沿 z 軸展開
                    blocks.place(material, csps.offset(pos, c, 0, r))
                }
            }
        }
    }

    /**
     * 更換調色盤：把色號字元對應到任何方塊
     * @param digit 色號字元（1~9）
     * @param material 方塊
     */
    //% block="設定色號 %digit 為 %material=minecraftBlock"
    //% digit.defl="1"
    //% weight=80
    export function setPalette(digit: string, material: number): void {
        initPalette()
        if (digit.length != 1) return
        const i = paletteKeys.indexOf(digit)
        if (i >= 0) {
            paletteBlocks[i] = material   // 已有色號 → 更換方塊
        } else {
            paletteKeys += digit          // 新色號 → 加入調色盤
            paletteBlocks.push(material)
        }
    }
}
