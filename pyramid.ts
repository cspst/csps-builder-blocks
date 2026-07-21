/**
 * pyramid.ts — 金字塔系列
 *
 * 訓練概念：迴圈（逐層）、函式拆解（模組化）、座標運算
 */

/** 金字塔樣式 */
enum PyramidStyle {
    //% block="階梯式"
    Stepped,
    //% block="平滑式（沙岩階梯斜面）"
    Smooth
}

//% color="#e5a50a" icon="\uf1b2" block="金字塔"
namespace pyramid {

    /**
     * 建造一座模組化金字塔
     * @param size 底邊寬度（建議用奇數，頂端才會是一格尖頂）
     * @param material 方塊材質
     * @param hollow 是否空心（內部挖出密室）
     * @param style 階梯式或平滑式
     * @param pos 金字塔西北角（最小座標）的位置
     */
    //% block="建造金字塔 底邊 %size 材質 %material=minecraftBlock 空心 %hollow 樣式 %style 位置 %pos=minecraftCreatePosition"
    //% size.min=3 size.max=63 size.defl=11
    //% hollow.defl=false
    //% weight=100
    export function buildPyramid(size: number, material: number, hollow: boolean, style: PyramidStyle, pos: Position): void {
        let layer = 0
        let s = size
        // 一層一層往上蓋，每層邊長減 2
        while (s > 0) {
            buildLayer(pos, layer, size, material)
            if (hollow) {
                hollowLayer(pos, layer, size)
            }
            s -= 2
            layer += 1
        }
        if (style == PyramidStyle.Smooth) {
            addSmoothEdges(pos, size)
        }
    }

    /**
     * 在玩家前方快速建造一座金字塔（適合低年級示範）
     */
    //% block="在我前方建造金字塔 底邊 %size 材質 %material=minecraftBlock"
    //% size.min=3 size.max=63 size.defl=11
    //% weight=90
    export function buildPyramidHere(size: number, material: number): void {
        const base = csps.offset(player.position(), 2, 0, 2)
        buildPyramid(size, material, false, PyramidStyle.Stepped, base)
    }

    // ─── 內部模組（不會出現在工具箱，示範「模組化」拆解）───

    /** 蓋出第 layer 層的實心正方形平面 */
    function buildLayer(base: Position, layer: number, size: number, material: number): void {
        const lo = layer
        const hi = size - 1 - layer
        csps.fillBox(material, base, lo, layer, lo, hi, layer, hi)
    }

    /** 把第 layer 層的內部挖空（保留一格厚的外殼；底層保留當地板） */
    function hollowLayer(base: Position, layer: number, size: number): void {
        const inner = size - 2 * layer - 2   // 內部邊長
        if (layer == 0 || inner <= 0) return
        const lo = layer + 1
        const hi = size - 2 - layer
        csps.fillBox(Block.Air, base, lo, layer, lo, hi, layer, hi)
    }

    /** 平滑式：在每層外圍鋪上朝外的沙岩階梯，形成斜面 */
    function addSmoothEdges(base: Position, size: number): void {
        // 階梯方塊的資料值：0=往東上升 1=往西上升 2=往南上升 3=往北上升
        const stairsE = blocks.blockWithData(Block.SandstoneStairs, 0) // 西面用
        const stairsW = blocks.blockWithData(Block.SandstoneStairs, 1) // 東面用
        const stairsS = blocks.blockWithData(Block.SandstoneStairs, 2) // 北面用
        const stairsN = blocks.blockWithData(Block.SandstoneStairs, 3) // 南面用

        let layer = 0
        let s = size
        while (s > 2) {
            const lo = layer
            const hi = size - 1 - layer
            // 西面（x 最小）：樓梯往東上升
            csps.fillBox(stairsE, base, lo, layer, lo, lo, layer, hi)
            // 東面（x 最大）：樓梯往西上升
            csps.fillBox(stairsW, base, hi, layer, lo, hi, layer, hi)
            // 北面（z 最小）：樓梯往南上升
            csps.fillBox(stairsS, base, lo, layer, lo, hi, layer, lo)
            // 南面（z 最大）：樓梯往北上升
            csps.fillBox(stairsN, base, lo, layer, hi, hi, layer, hi)
            s -= 2
            layer += 1
        }
    }
}
