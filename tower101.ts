/**
 * tower101.ts — 台北101系列
 *
 * 訓練概念：函式組合（部件化）、迴圈（重複疊「節」）、參數（節數/寬度）
 *
 * 台北101的結構拆解：
 *   底座（含裙樓）→ 8個重複的「斗形節」→ 塔冠與天線塔尖
 * 每個部件都是獨立積木，可以一鍵蓋整棟，也可以自己組裝。
 *
 * 部件高度（組裝時計算堆疊位置用）：
 *   底座 = 12 格、每節 = 7 格、塔尖 ≈ 依寬度約 14~20 格
 * 所有位置參數都是「該部件底部的中心點」。
 */

//% color="#00838f" icon="\uf1ad" block="台北101"
namespace tower101 {

    // ── 經典配色（可改這三個函式換配色）──
    function glassBlock(): number { return blocks.blockWithData(Block.StainedGlass, 9) } // 青綠帷幕玻璃
    function frameBlock(): number { return Block.StoneBrick }                            // 灰色結構框架
    function spireBlock(): number { return Block.IronBlock }                             // 塔尖金屬

    // ── 幾何小工具：以「中心點」為基準 ──

    /** 在高度 dy 鋪一層實心正方形（half = 半寬） */
    function layerAt(material: number, center: Position, dy: number, half: number): void {
        csps.fillBox(material, center, -half, dy, -half, half, dy, half)
    }

    /** 在四個角落放框架柱腳（增加立體感） */
    function corners(center: Position, dy: number, half: number): void {
        const f = frameBlock()
        blocks.place(f, csps.offset(center, half, dy, half))
        blocks.place(f, csps.offset(center, half, dy, -half))
        blocks.place(f, csps.offset(center, -half, dy, half))
        blocks.place(f, csps.offset(center, -half, dy, -half))
    }

    // ═══════════ 部件一：底座（塔基＋裙樓）═══════════

    /**
     * 建造101底座：向上收窄的塔基，可附裙樓（購物中心）
     * 高度固定 12 格
     * @param width 塔身節寬（建議奇數，9~25）
     * @param podium 是否加蓋旁邊的裙樓
     * @param pos 底座底部中心點
     */
    //% block="建造101底座 節寬 %width 裙樓 %podium 位置 %pos=minecraftCreatePosition"
    //% width.min=9 width.max=25 width.defl=15
    //% podium.defl=true
    //% weight=80
    export function buildBase(width: number, podium: boolean, pos: Position): void {
        const half = Math.idiv(width - 1, 2)
        // 12 層，每 3 層內縮 1 格：half+2 → half-1
        for (let y = 0; y < 12; y++) {
            const hw = half + 2 - Math.idiv(y, 3)
            // 每 4 層一條灰色橫帶，其餘是玻璃
            layerAt(y % 4 == 3 ? frameBlock() : glassBlock(), pos, y, hw)
            corners(pos, y, hw)
        }
        // 正面挖出入口（南側）
        csps.fillBox(Block.Air, pos, -1, 1, half + 1, 1, 3, half + 2)
        if (podium) {
            buildPodium(width, pos)
        }
    }

    /** 裙樓：塔樓旁的低層購物中心 */
    function buildPodium(width: number, center: Position): void {
        const half = Math.idiv(width - 1, 2)
        const x0 = half + 4              // 蓋在東側
        const d = Math.max(4, Math.idiv(width, 2))   // 進深的一半
        // 玻璃主體 7 層
        csps.fillBox(glassBlock(), center, x0, 0, -d, x0 + width - 1, 6, d)
        // 每 3 層一條橫帶
        csps.fillBox(frameBlock(), center, x0, 2, -d, x0 + width - 1, 2, d)
        csps.fillBox(frameBlock(), center, x0, 5, -d, x0 + width - 1, 5, d)
        // 屋頂
        csps.fillBox(frameBlock(), center, x0, 7, -d, x0 + width - 1, 7, d)
        // 入口
        csps.fillBox(Block.Air, center, x0 + Math.idiv(width, 2) - 1, 1, d, x0 + Math.idiv(width, 2) + 1, 3, d)
    }

    // ═══════════ 部件二：斗形節（101的招牌造型）═══════════

    /**
     * 建造101樓層節：下窄上寬的「斗」，頂部有外突簷口
     * 高度固定 7 格
     * @param width 節寬（與底座相同，建議奇數）
     * @param pos 這一節底部的中心點
     */
    //% block="建造101樓層節 節寬 %width 位置 %pos=minecraftCreatePosition"
    //% width.min=9 width.max=25 width.defl=15
    //% weight=70
    export function buildSegment(width: number, pos: Position): void {
        segmentAt(width, pos, 0)
    }

    /** 內部版本：在 center 上方 dy 處疊一節，回傳節高 */
    function segmentAt(width: number, center: Position, dy: number): number {
        const half = Math.idiv(width - 1, 2)
        const g = glassBlock()
        // 六層玻璃：由窄到寬（half-2 → half），做出外斜的「斗」形
        for (let i = 0; i < 6; i++) {
            const hw = half - 2 + Math.idiv(i, 2)
            layerAt(g, center, dy + i, hw)
            corners(center, dy + i, hw)
        }
        // 頂部外突簷口（灰色橫帶，比節寬多 1 格）
        layerAt(frameBlock(), center, dy + 6, half + 1)
        return 7
    }

    // ═══════════ 部件三：塔冠與天線塔尖 ═══════════

    /**
     * 建造101塔尖：收窄的塔冠＋金屬天線
     * 高度依節寬約 14~20 格
     * @param width 節寬（與塔身相同）
     * @param pos 塔尖底部的中心點
     */
    //% block="建造101塔尖 節寬 %width 位置 %pos=minecraftCreatePosition"
    //% width.min=9 width.max=25 width.defl=15
    //% weight=60
    export function buildSpire(width: number, pos: Position): void {
        spireAt(width, pos, 0)
    }

    /** 內部版本：在 center 上方 dy 處蓋塔尖，回傳塔尖高度 */
    function spireAt(width: number, center: Position, dy: number): number {
        const half = Math.idiv(width - 1, 2)
        let d = dy
        // 塔冠：一層層快速收窄
        let hw = half - 2
        while (hw > 2) {
            layerAt(frameBlock(), center, d, hw)
            d++
            hw -= 2
        }
        // 塔冠頂座
        csps.fillBox(frameBlock(), center, -2, d, -2, 2, d + 1, 2)
        d += 2
        // 天線基柱
        csps.fillBox(spireBlock(), center, -1, d, -1, 1, d + 2, 1)
        d += 3
        // 細天線（1 格柱），中途兩個環形突起
        csps.fillBox(spireBlock(), center, 0, d, 0, 0, d + 7, 0)
        layerAt(spireBlock(), center, d + 2, 1)
        layerAt(spireBlock(), center, d + 5, 1)
        d += 8
        return d - dy
    }

    // ═══════════ 主積木：一鍵整棟 ═══════════

    /**
     * 建造整棟台北101：底座 → 重複疊節 → 塔尖
     * @param segments 節數（真實的101是8節）
     * @param width 節寬（建議奇數，9~25）
     * @param pos 大樓底部中心點
     */
    //% block="建造台北101 節數 %segments 節寬 %width 裙樓 %podium 位置 %pos=minecraftCreatePosition"
    //% segments.min=1 segments.max=12 segments.defl=8
    //% width.min=9 width.max=25 width.defl=15
    //% podium.defl=true
    //% weight=100
    export function buildTower(segments: number, width: number, podium: boolean, pos: Position): void {
        buildBase(width, podium, pos)
        let dy = 12                              // 底座高度
        // 迴圈：一節一節往上疊（這就是101的「重複結構」）
        for (let i = 0; i < segments; i++) {
            dy += segmentAt(width, pos, dy)
        }
        spireAt(width, pos, dy)
    }

    /**
     * 在我前方建造台北101（經典8節，適合快速示範）
     */
    //% block="在我前方建造台北101 節數 %segments"
    //% segments.min=1 segments.max=12 segments.defl=8
    //% weight=90
    export function buildTowerHere(segments: number): void {
        buildTower(segments, 15, true, csps.offset(player.position(), 15, 0, 15))
    }
}
